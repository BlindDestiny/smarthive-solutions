'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, Mail, Clock, Check, ArrowRight, Sparkles, Wifi } from 'lucide-react'

const SERVICES_LIST = ['Residencial','Escritório','Limpeza Profunda','Mudanças','Janelas','Pós-Obra','Outro']

export default function Contact() {
  const [form, setForm] = useState({ name:'', phone:'', service:'', size:'', message:'' })
  const [sent, setSent] = useState(false)
  const set = (k:string, v:string) => setForm(f=>({...f,[k]:v}))

  const inputClass = "w-full bg-white border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 text-slate-900 placeholder-slate-300 font-sans text-sm px-4 py-3.5 rounded-2xl outline-none transition-all duration-200"
  const labelClass = "block font-sans text-xs font-semibold text-slate-500 mb-2 tracking-wide"

  return (
    <section id="contact" className="py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left */}
          <div>
            <motion.span initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              className="inline-block badge-light text-sky-700 font-sans text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              Sem compromisso
            </motion.span>
            <motion.h2 initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.65 }}
              className="font-display font-extrabold text-slate-900 mb-4" style={{ fontSize:'clamp(1.9rem,3.5vw,2.8rem)' }}>
              Orçamento grátis<br/><span className="text-sky-600">em 2 minutos</span>
            </motion.h2>
            <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              transition={{ delay:0.15 }}
              className="font-sans text-slate-400 text-base leading-relaxed mb-10 max-w-sm">
              Preencha o formulário e recebe resposta imediata via WhatsApp. Sem spam, sem obrigações.
            </motion.p>

            <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              transition={{ delay:0.2 }} className="space-y-3 mb-10">
              {[
                { Icon:MessageCircle, label:'WhatsApp', val:'912 345 678', href:'https://wa.me/351912345678', color:'#16a34a', sub:'Resposta em minutos' },
                { Icon:Phone,  label:'Telefone', val:'912 345 678',    href:'tel:912345678',            color:'#0284c7', sub:'Seg–Sáb, 8h–20h' },
                { Icon:Mail,   label:'Email',    val:'ola@sparkclean.pt', href:'mailto:ola@sparkclean.pt', color:'#7c3aed', sub:'Resposta em 2h' },
                { Icon:Clock,  label:'Horário',  val:'Seg–Sáb: 8h–20h',  href:'#',                        color:'#0284c7', sub:'Urgências ao Domingo' },
              ].map(c => (
                <a key={c.label} href={c.href}
                  className="flex items-center gap-4 card rounded-2xl px-5 py-4 hover:border-sky-200 hover:shadow-sm transition-all duration-200 group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background:`${c.color}12`, border:`1px solid ${c.color}25` }}>
                    <c.Icon style={{ color:c.color, width:18, height:18 }}/>
                  </div>
                  <div className="flex-1">
                    <div className="font-sans text-[10px] text-slate-400 uppercase tracking-widest">{c.label}</div>
                    <div className="font-display font-bold text-slate-900 text-sm group-hover:text-sky-600 transition-colors">{c.val}</div>
                  </div>
                  <span className="font-sans text-slate-300 text-xs">{c.sub}</span>
                </a>
              ))}
            </motion.div>

            <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              transition={{ delay:0.3 }} className="card rounded-2xl p-5">
              <div className="font-display font-bold text-slate-900 text-sm mb-3">As nossas garantias</div>
              {['Satisfação 100% ou repetimos grátis','Preço fechado sem surpresas','Equipas verificadas e seguradas','Produtos eco-friendly certificados'].map(g => (
                <div key={g} className="flex items-center gap-2.5 py-1.5">
                  <Check className="w-3.5 h-3.5 text-sky-500 flex-shrink-0"/>
                  <span className="font-sans text-slate-500 text-sm">{g}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Form */}
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.75, delay:0.1, ease:[0.22,1,0.36,1] }}>
            {sent ? (
              <motion.div initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }}
                className="card rounded-3xl p-12 text-center">
                <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-sky-600/20">
                  <Check className="w-7 h-7 text-white"/>
                </div>
                <h3 className="font-display font-extrabold text-slate-900 text-2xl mb-3">Pedido recebido!</h3>
                <p className="font-sans text-slate-400 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                  Vamos contactá-lo via WhatsApp nos próximos minutos com o orçamento personalizado.
                </p>
                <button onClick={() => setSent(false)} className="font-sans text-sky-600 hover:text-sky-700 text-sm transition-colors">
                  Enviar outro pedido
                </button>
              </motion.div>
            ) : (
              <form onSubmit={e=>{e.preventDefault();setSent(true)}} className="card rounded-3xl p-8 space-y-5 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Nome</label>
                    <input required value={form.name} onChange={e=>set('name',e.target.value)}
                      placeholder="O seu nome" className={inputClass}/>
                  </div>
                  <div>
                    <label className={labelClass}>Telefone / WhatsApp</label>
                    <input required value={form.phone} onChange={e=>set('phone',e.target.value)}
                      placeholder="9XX XXX XXX" className={inputClass}/>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Serviço pretendido</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SERVICES_LIST.map(s => (
                      <button key={s} type="button" onClick={() => set('service', s)}
                        className={`text-left px-4 py-2.5 rounded-xl font-sans text-xs border transition-all duration-150 ${
                          form.service===s
                            ? 'bg-sky-600 border-sky-600 text-white font-semibold'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-sky-300 hover:text-sky-600'
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Área aproximada</label>
                  <div className="flex gap-2">
                    {['< 50m²','50–100m²','100–150m²','> 150m²'].map(sz => (
                      <button key={sz} type="button" onClick={() => set('size', sz)}
                        className={`flex-1 py-2.5 rounded-xl font-sans text-xs border transition-all duration-150 ${
                          form.size===sz
                            ? 'bg-sky-600 border-sky-600 text-white font-semibold'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-sky-300'
                        }`}>
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Mensagem (opcional)</label>
                  <textarea value={form.message} onChange={e=>set('message',e.target.value)}
                    placeholder="Data preferida, informações adicionais..." rows={3}
                    className={inputClass+' resize-none'}/>
                </div>

                <motion.button type="submit"
                  whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}
                  className="group w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-display font-bold py-4 rounded-2xl transition-colors shadow-md shadow-sky-600/20">
                  Pedir orçamento gratuito
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"/>
                </motion.button>

                <p className="font-sans text-slate-400 text-xs text-center">
                  Resposta em menos de 2h · Sem spam · Sem compromisso
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
