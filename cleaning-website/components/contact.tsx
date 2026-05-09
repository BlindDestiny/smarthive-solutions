'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, Mail, Clock, Check, ArrowRight, Sparkles } from 'lucide-react'

const SERVICES_LIST = ['Limpeza Residencial','Limpeza de Escritório','Limpeza Profunda','Mudanças','Limpeza de Janelas','Pós-Obra','Outro']

export default function Contact() {
  const [form, setForm] = useState({ name:'', phone:'', email:'', service:'', size:'', message:'' })
  const [sent, setSent] = useState(false)
  const set = (k:string, v:string) => setForm(f=>({...f,[k]:v}))

  const inputClass = "w-full bg-white/[0.04] border border-white/[0.08] focus:border-sky-500/50 focus:bg-white/[0.06] text-white placeholder-white/20 font-sans text-sm px-4 py-3.5 rounded-2xl outline-none transition-all duration-300"
  const labelClass = "block font-sans text-xs font-medium text-white/40 mb-2 tracking-wide"

  return (
    <section id="contact" className="py-32 bg-[#060915] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-500/5 blur-[120px] rounded-full"/>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left */}
          <div>
            <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-3 py-1.5 mb-6"
            >
              <Sparkles className="w-3 h-3 text-sky-400"/>
              <span className="font-sans text-sky-300 text-xs tracking-wide">Sem compromisso</span>
            </motion.div>

            <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.7 }}
              className="font-display font-extrabold text-white mb-5" style={{ fontSize:'clamp(1.9rem,3.5vw,2.8rem)' }}>
              Orçamento grátis<br/>
              <span className="gradient-text">em 2 minutos</span>
            </motion.h2>

            <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              transition={{ delay:0.2 }}
              className="font-sans text-white/45 text-base leading-relaxed mb-10"
            >
              Preencha o formulário e recebe uma resposta imediata via WhatsApp. Sem obrigações, sem spam.
            </motion.p>

            {/* Contact methods */}
            <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              transition={{ delay:0.3 }}
              className="space-y-4 mb-10"
            >
              {[
                { Icon:MessageCircle, label:'WhatsApp', val:'912 345 678', color:'#25d366', href:'https://wa.me/351912345678?text=Olá! Gostaria de pedir um orçamento.', sub:'Resposta em minutos' },
                { Icon:Phone, label:'Telefone', val:'912 345 678', color:'#38bdf8', href:'tel:912345678', sub:'Seg–Sáb, 8h–20h' },
                { Icon:Mail, label:'Email', val:'ola@sparkclean.pt', color:'#818cf8', href:'mailto:ola@sparkclean.pt', sub:'Resposta em 2h' },
                { Icon:Clock, label:'Horário', val:'Seg–Sáb: 8h–20h', color:'#34d399', href:'#', sub:'Urgências ao Domingo' },
              ].map(c => (
                <a key={c.label} href={c.href}
                  className="flex items-center gap-4 card-glass rounded-2xl px-5 py-4 hover:border-sky-500/20 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background:`${c.color}18`, border:`1px solid ${c.color}30` }}>
                    <c.Icon className="w-4.5 h-4.5" style={{ color:c.color, width:18, height:18 }}/>
                  </div>
                  <div className="flex-1">
                    <div className="font-sans text-[10px] text-white/30 uppercase tracking-widest">{c.label}</div>
                    <div className="font-display font-bold text-white text-sm group-hover:text-sky-300 transition-colors">{c.val}</div>
                  </div>
                  <div className="font-sans text-white/25 text-xs">{c.sub}</div>
                </a>
              ))}
            </motion.div>

            {/* Guarantees */}
            <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              transition={{ delay:0.4 }}
              className="p-5 rounded-2xl bg-sky-500/5 border border-sky-500/15"
            >
              <div className="font-display font-bold text-white text-sm mb-3">✦ As nossas garantias</div>
              {['100% satisfação ou repetimos de graça','Preço fixo sem surpresas','Equipas verificadas e seguradas','Produtos eco-friendly certificados'].map(g => (
                <div key={g} className="flex items-center gap-2.5 py-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0"/>
                  <span className="font-sans text-white/50 text-sm">{g}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Form */}
          <motion.div initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.8, delay:0.15, ease:[0.22,1,0.36,1] }}
          >
            {sent ? (
              <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                className="card-glass rounded-3xl p-12 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-sky-500/30">
                  <Check className="w-8 h-8 text-white"/>
                </div>
                <h3 className="font-display font-extrabold text-white text-2xl mb-3">Pedido recebido! 🎉</h3>
                <p className="font-sans text-white/45 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                  Vamos entrar em contacto via WhatsApp nos próximos minutos com o seu orçamento personalizado.
                </p>
                <button onClick={() => setSent(false)}
                  className="font-sans text-sky-400 hover:text-sky-300 text-sm transition-colors">
                  Enviar outro pedido
                </button>
              </motion.div>
            ) : (
              <form onSubmit={e=>{e.preventDefault();setSent(true)}} className="card-glass rounded-3xl p-8 space-y-5">
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
                        className={`text-left px-4 py-2.5 rounded-xl font-sans text-xs transition-all duration-200 ${
                          form.service===s
                            ? 'bg-sky-500/20 border border-sky-500/40 text-sky-300'
                            : 'bg-white/[0.03] border border-white/[0.06] text-white/45 hover:border-white/15 hover:text-white/70'
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
                        className={`flex-1 py-2.5 rounded-xl font-sans text-xs transition-all duration-200 ${
                          form.size===sz
                            ? 'bg-sky-500/20 border border-sky-500/40 text-sky-300'
                            : 'bg-white/[0.03] border border-white/[0.06] text-white/45 hover:border-white/15'
                        }`}>
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Mensagem (opcional)</label>
                  <textarea value={form.message} onChange={e=>set('message',e.target.value)}
                    placeholder="Informações adicionais, data preferida, urgência..." rows={3}
                    className={inputClass+' resize-none'}/>
                </div>

                <motion.button type="submit"
                  whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                  className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-display font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-300">
                  Pedir orçamento gratuito
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                </motion.button>

                <p className="font-sans text-white/20 text-xs text-center">
                  Resposta garantida em menos de 2h · Sem spam · Sem obrigações
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
