"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarDays, Camera, Check, Clock3, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

const services = [
  { id: "mao-simples", name: "Mão Simples", price: 11, minutes: 50, group: "Simples" },
  { id: "pe-simples", name: "Pé Simples", price: 16, minutes: 50, group: "Simples" },
  { id: "pe-mao-simples", name: "Pé e Mão Simples", price: 26, minutes: 90, group: "Simples" },
  { id: "mao-gelinho", name: "Mão Gelinho", price: 14, minutes: 50, group: "Gelinho" },
  { id: "pe-gelinho", name: "Pé Gelinho", price: 18, minutes: 60, group: "Gelinho" },
  { id: "alongamento-gel", name: "Alongamento em Gel", price: 35, minutes: 90, group: "Gel" },
  { id: "sobrancelhas", name: "Sobrancelhas", price: 10, minutes: 30, group: "Beleza" },
];
const durationLabel = (minutes: number) => minutes < 60 ? `${minutes} min` : minutes === 60 ? "1 h" : minutes === 90 ? "1 h 30" : "2 h";
const minDate = () => { const date = new Date(); date.setDate(date.getDate() + 1); return date.toISOString().slice(0, 10); };
const apiBase = "https://mica-nail-braga.rodolfo-guedes-dev.chatgpt.site";

const showcaseImages = ["https://raw.githubusercontent.com/RodolfoGuedes/Mica-Manicure/main/IMG-20260920-WA0042.jpg","https://raw.githubusercontent.com/RodolfoGuedes/Mica-Manicure/main/IMG-20260920-WA0043.jpg","https://raw.githubusercontent.com/RodolfoGuedes/Mica-Manicure/main/IMG-20260920-WA0044.jpg","https://raw.githubusercontent.com/RodolfoGuedes/Mica-Manicure/main/IMG-20260920-WA0045.jpg","https://raw.githubusercontent.com/RodolfoGuedes/Mica-Manicure/main/IMG-20260920-WA0046.jpg","https://raw.githubusercontent.com/RodolfoGuedes/Mica-Manicure/main/IMG-20260920-WA0047.jpg","https://raw.githubusercontent.com/RodolfoGuedes/Mica-Manicure/main/IMG-20260920-WA0048.jpg","https://raw.githubusercontent.com/RodolfoGuedes/Mica-Manicure/main/file_00000000e31881f4a59c4b2184ba9ee2.png"];

export default function Home() {
  const [serviceId, setServiceId] = useState(services[0].id);
  const [date, setDate] = useState(minDate());
  const [slots, setSlots] = useState<string[]>([]);
  const [slot, setSlot] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [reference, setReference] = useState("");
  const [showcaseIndex, setShowcaseIndex] = useState<number>(0);
  const service = useMemo(() => services.find((item) => item.id === serviceId)!, [serviceId]);

  useEffect(() => { const timer = window.setInterval(() => setShowcaseIndex((i) => (i + 1) % showcaseImages.length), 3500); return () => window.clearInterval(timer); }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoadingSlots(true); setSlot("");
    fetch(`${apiBase}/api/availability?date=${date}&service=${serviceId}`, { signal: controller.signal })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => setSlots(data.slots ?? []))
      .catch(() => setSlots([])).finally(() => setLoadingSlots(false));
    return () => controller.abort();
  }, [date, serviceId]);

  async function book(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!slot) return;
    const form = new FormData(event.currentTarget);
    setStatus("saving");
    const response = await fetch(`${apiBase}/api/bookings`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      serviceId, date, startTime: slot, name: form.get("name"), email: form.get("email"), phone: form.get("phone"),
    }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setStatus("error"); return; }
    setReference(data.reference); setStatus("success");
  }

  return <main>
    <header className="topbar">
      <a className="brand brand-text" href="#inicio" aria-label="Mica Nail Designer — início"><span>Mica</span><small>Nail Designer</small></a>
      <nav aria-label="Navegação principal"><a href="#servicos">Serviços</a><a href="#trabalhos">Trabalhos</a><a href="https://www.instagram.com/mica_manicure_braga/" target="_blank" rel="noreferrer">Instagram</a><a href="#contacto">Contacto</a></nav>
      <a className="header-cta" href="#agendar">Agendar</a>
    </header>

    <section id="inicio" className="hero">
      <div className="hero-copy">
        <img className="hero-logo" src="https://raw.githubusercontent.com/RodolfoGuedes/Mica-Manicure/main/file_0000000012c881f4820b91e8a6578cb5.png" alt="Mica Nail Designer"/>
        <p className="eyebrow"><Sparkles size={15}/> Nail designer em Braga</p>
        <h1>Mais que unhas,<br/><em>é autoestima.</em></h1>
        <p className="hero-text">Cuidados, elegância e qualidade para realçar a sua beleza em cada detalhe.</p>
        <div className="hero-actions"><a className="primary-link" href="#agendar">Marcar agora</a><a className="instagram-link" href="https://www.instagram.com/mica_manicure_braga/" target="_blank" rel="noreferrer"><Camera/> Instagram</a></div>
        <div className="trust-row"><span><Check/> Confirmação imediata</span><span><Check/> Pagamento no local</span></div>
      </div>
      <div className="hero-gallery hero-carousel"><img className="gallery-main" src={showcaseImages[showcaseIndex]} alt="Trabalho realizado pela Mica Nail Designer"/><div className="showcase-dots hero-dots">{showcaseImages.map((_, i) => <button key={i} aria-label={`Ver trabalho ${i + 1}`} className={i === showcaseIndex ? "active" : ""} onClick={() => setShowcaseIndex(i)} />)}</div></div>
    </section>

    <section id="servicos" className="section services-section">
      <div className="section-heading"><div><p className="eyebrow">Serviços</p><h2>Cuidados à sua medida</h2></div><p>O tempo indicado fica reservado exclusivamente para si.</p></div>
      <div className="services-grid">{services.map((item) => <article className="service-card" key={item.id}>
        <div><span className="service-group">{item.group}</span><h3>{item.name}</h3><p><Clock3/> {durationLabel(item.minutes)}</p></div>
        <strong>{item.price} €</strong><button onClick={() => { setServiceId(item.id); document.querySelector("#agendar")?.scrollIntoView({ behavior: "smooth" }); }}>Escolher</button>
      </article>)}</div>
    </section>

    <section id="trabalhos" className="portfolio section">
<div className="portfolio-copy"><p className="eyebrow">Portfólio</p><h2>Detalhes que fazem a diferença</h2><p>Do clássico às cores mais marcantes, cada trabalho é pensado para combinar consigo.</p><a href="https://www.instagram.com/mica_manicure_braga/" target="_blank" rel="noreferrer"><Camera/> Ver mais no Instagram</a></div>
      <div className="showcase-carousel"><img src={showcaseImages[showcaseIndex]} alt="Trabalho realizado pela Mica Nail Designer"/><div className="showcase-dots">{showcaseImages.map((_, i) => <button key={i} aria-label={`Ver trabalho ${i + 1}`} className={i === showcaseIndex ? "active" : ""} onClick={() => setShowcaseIndex(i)} />)}</div></div>
    </section>

    <section id="agendar" className="booking-section">
      <div className="booking-intro"><p className="eyebrow">Agenda online</p><h2>Reserve o seu horário</h2><p>Selecione o serviço e encontre um horário livre. A marcação fica confirmada na hora.</p>
        <div className="booking-points"><span><CalendarDays/> Segunda a sexta<br/><b>09:00 — 18:00</b></span><span><CalendarDays/> Sábado<br/><b>09:00 — 13:00</b></span><span><MapPin/> São Vítor<br/><b>Braga</b></span></div>
      </div>
      <form className="booking-card" onSubmit={book}>
        {status === "success" ? <div className="success-state"><div><Check/></div><p>Marcação confirmada</p><h3>{service.name}</h3><strong>{new Date(`${date}T12:00:00`).toLocaleDateString("pt-PT", { day: "numeric", month: "long" })} às {slot}</strong><small>Referência: {reference}</small><p>Guarde esta referência. Se precisar de ajuda, contacte-nos pelo WhatsApp.</p><Button type="button" onClick={() => setStatus("idle")}>Fazer outra marcação</Button></div> : <>
          <label>1. Escolha o serviço<NativeSelect className="field" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>{services.map((item) => <NativeSelectOption value={item.id} key={item.id}>{item.name} · {item.price} €</NativeSelectOption>)}</NativeSelect></label>
          <div className="booking-summary"><span>{durationLabel(service.minutes)}</span><strong>{service.price} €</strong></div>
          <label>2. Escolha o dia<Input className="field" type="date" min={minDate()} value={date} onChange={(e) => setDate(e.target.value)} required/></label>
          <fieldset><legend>3. Escolha o horário</legend><div className="slots">{loadingSlots ? <p>A procurar horários…</p> : slots.length ? slots.map((time) => <button type="button" className={slot === time ? "active" : ""} onClick={() => setSlot(time)} key={time}>{time}</button>) : <p>Sem horários disponíveis neste dia.</p>}</div></fieldset>
          <div className="identity-grid"><label>Nome completo<Input className="field" name="name" autoComplete="name" required/></label><label>Telefone<Input className="field" name="phone" type="tel" autoComplete="tel" placeholder="+351"/></label><label className="wide">E-mail<Input className="field" name="email" type="email" autoComplete="email" placeholder="Indique telefone ou e-mail"/></label></div>
          <p className="form-note">Informe pelo menos telefone ou e-mail. Cancelamentos devem ser feitos com 12 horas de antecedência.</p>
          {status === "error" && <p className="error">Não foi possível confirmar. Verifique os dados ou escolha outro horário.</p>}
          <Button className="submit-button" size="lg" disabled={!slot || status === "saving"}>{status === "saving" ? "A confirmar…" : "Confirmar marcação"}</Button>
        </>}
      </form>
    </section>

    <footer id="contacto"><div><a className="brand footer-brand" href="#inicio"><img className="footer-logo" src="https://raw.githubusercontent.com/RodolfoGuedes/Mica-Manicure/main/file_0000000012c881f4820b91e8a6578cb5.png" alt="Mica Nail Designer"/></a><p>Beleza, cuidado e atenção em cada detalhe.</p></div><div><b>Visite-nos</b><p>Rua Orfeão de Braga 4<br/>4710-411 São Vítor, Braga</p></div><div><b>Fale connosco</b><a href="https://wa.me/351964536960"><MessageCircle/> +351 964 536 960</a><a href="mailto:micleiasilva.mica@gmail.com">micleiasilva.mica@gmail.com</a><a href="https://www.instagram.com/mica_manicure_braga/" target="_blank" rel="noreferrer"><Camera/> @mica_manicure_braga</a></div></footer>
  </main>;
}

