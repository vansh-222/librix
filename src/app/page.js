'use client';
import Link from 'next/link';
import { BookOpen, Star } from 'lucide-react';

const BLUE = '#1A73E8';
const DARK = '#052033';
const BC = ['#1A73E8','#052033','#0D725D','#E8341A','#8B5CF6','#F59E0B','#EC4899','#06B6D4','#10B981','#6366F1','#DC2626','#059669','#7C3AED','#DB2777','#2563EB'];
const TS = [...BC,...BC].map((c,i)=>({color:c,h:[90,72,100,65,85,110,70,95,60,80,105,68,92,75,88,94,66,78,102,70,84,60,96,72,88,100,65,80,90,74][i%30],w:[40,44,38,46,42,36,48,40,44,38,46,42,36,48,40,44,38,46,42,36,48,40,44,38,46,42,36,48,40,44][i%30]}));
const BS = [...BC,...BC].reverse().map((c,i)=>({color:c,h:[80,65,95,72,88,60,100,75,90,68,82,105,70,85,62,96,74,88,65,92,78,100,66,84,72,90,60,80,96,70][i%30],w:[38,42,36,44,40,46,38,42,36,44,40,46,38,42,36,44,40,46,38,42,36,44,40,46,38,42,36,44,40,46][i%30]}));

const Sp=({color,h,w=42})=><div style={{width:w,height:h,background:color,borderRadius:4,flexShrink:0,boxShadow:'2px 0 6px rgba(0,0,0,0.15)'}}/>;

const BookMock=()=>(
  <div style={{background:'#F4F8FE',borderRadius:20,padding:24,boxShadow:'0 4px 30px rgba(26,115,232,0.1)'}}>
    <div style={{background:DARK,borderRadius:10,padding:'10px 16px',marginBottom:16,display:'flex',gap:6}}>
      {['#DD4D4D','#D3DB58','#0D725D'].map(c=><div key={c} style={{width:10,height:10,borderRadius:'50%',background:c}}/>)}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
      {[BLUE,DARK,'#8B5CF6','#10B981','#E8341A','#F59E0B'].map((c,i)=><div key={i} style={{height:90,background:c,borderRadius:8}}/>)}
    </div>
  </div>
);

const RecordMock=()=>(
  <div style={{background:'#F4F8FE',borderRadius:20,padding:24,boxShadow:'0 4px 30px rgba(26,115,232,0.1)'}}>
    <div style={{background:DARK,borderRadius:10,padding:'10px 16px',marginBottom:16,display:'flex',gap:6}}>
      {['#DD4D4D','#D3DB58','#0D725D'].map(c=><div key={c} style={{width:10,height:10,borderRadius:'50%',background:c}}/>)}
    </div>
    {['Atomic Habits','Clean Code','Sapiens'].map((t,i)=>(
      <div key={t} style={{display:'flex',gap:12,marginBottom:14,alignItems:'center'}}>
        <div style={{width:40,height:56,background:[BLUE,DARK,'#8B5CF6'][i],borderRadius:6,flexShrink:0}}/>
        <div style={{flex:1}}>
          <div style={{height:11,background:'rgba(0,0,0,0.12)',borderRadius:6,marginBottom:6,width:'65%'}}/>
          <div style={{height:9,background:'rgba(0,0,0,0.07)',borderRadius:6,width:'40%'}}/>
        </div>
        <div style={{padding:'4px 12px',background:BLUE,borderRadius:20,color:'white',fontSize:12,fontWeight:500}}>Issued</div>
      </div>
    ))}
  </div>
);

export default function LandingPage(){
  const NAV=['Features','Resources','About Us','Pricing','Contact'];
  const T=(s,extra={})=>({fontFamily:'Inter',wordWrap:'break-word',...extra,...s});

  return(
    <div style={{fontFamily:'Inter,sans-serif',background:'white',color:'black',overflowX:'hidden'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}a{text-decoration:none}
        .nl:hover{color:#1A73E8!important}.hl:hover{opacity:.85}
      `}</style>

      {/* NAVBAR */}
      <div style={{position:'sticky',top:16,zIndex:100,padding:'0 27px'}}>
        <nav style={{maxWidth:1386,margin:'0 auto',background:'white',boxShadow:'0px 4px 25.3px rgba(26,115,232,0.23)',borderRadius:40,border:'1px solid #D9D9D9',padding:'0 40px',height:71,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${BLUE},${DARK})`,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <BookOpen size={18} color="white"/>
            </div>
            <span style={{fontSize:20,fontWeight:700,color:DARK,fontFamily:'Inter'}}>Librar<span style={{color:BLUE}}>ium</span></span>
          </Link>
          <div style={{display:'flex',alignItems:'center',gap:44}}>
            {NAV.map(l=><a key={l} href={`#${l.toLowerCase().replace(' ','-')}`} className="nl" style={{color:'black',fontSize:16,fontFamily:'Inter',fontWeight:400,transition:'color 0.2s'}}>{l}</a>)}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <Link href="/login" style={{padding:'10px 28px',borderRadius:38,border:'1px solid rgba(5,32,51,0.42)',color:DARK,fontSize:16,fontFamily:'Inter',fontWeight:400}}>Login</Link>
            <Link href="/register" style={{padding:'10px 24px',borderRadius:38,background:BLUE,color:'white',fontSize:16,fontFamily:'Inter',fontWeight:500}}>For College</Link>
          </div>
        </nav>
      </div>

      {/* HERO */}
      <section style={{padding:'80px 24px 60px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        {/* Hero background image — 3D books left & right */}
        <img
          src="/hero-bg.png"
          alt=""
          aria-hidden="true"
          style={{
            position:'absolute',
            top:0, left:0,
            width:'100%', height:'100%',
            objectFit:'cover',
            objectPosition:'center',
            pointerEvents:'none',
            userSelect:'none',
            zIndex:0,
          }}
        />
        <div style={{maxWidth:900,margin:'0 auto',position:'relative',zIndex:1}}>
          <div style={{display:'inline-block',color:BLUE,fontSize:16,fontFamily:'Inter',fontWeight:400,marginBottom:24,padding:'6px 20px',background:'rgba(26,115,232,0.06)',borderRadius:30,border:'1px solid rgba(26,115,232,0.2)'}}>
            Digital Library Platform for Institutions
          </div>
          <h1 style={{fontSize:54,fontWeight:700,fontFamily:'Inter',lineHeight:1.15,marginBottom:24}}>
            Smart Library Management for Modern{' '}<span style={{color:BLUE}}>Institutions</span>
          </h1>
          <p style={{fontSize:20,fontWeight:400,fontFamily:'Inter',color:'rgba(0,0,0,0.60)',lineHeight:1.6,maxWidth:682,margin:'0 auto 40px'}}>
            Librarium is an all-in-one library management system to manage books, members, requests, issue &amp; return, fines and reports — designed for colleges, universities, and modern libraries.
          </p>
          <div style={{display:'flex',gap:15,justifyContent:'center',flexWrap:'wrap',marginBottom:48}}>
            <Link href="/register" style={{display:'flex',alignItems:'center',justifyContent:'center',width:231,height:47,background:DARK,borderRadius:38,color:'white',fontSize:20,fontFamily:'Inter',fontWeight:500}}>
              Start Your Library
            </Link>
            <a href="#features" style={{display:'flex',alignItems:'center',justifyContent:'center',width:212,height:47,background:'white',borderRadius:38,border:`1px solid ${BLUE}`,color:BLUE,fontSize:20,fontFamily:'Inter',fontWeight:500}}>
              Explore Features
            </a>
          </div>
          {/* Social proof */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:16}}>
            <div style={{display:'flex'}}>
              {[0,1,2].map(i=>(
                <img
                  key={i}
                  src="https://res.cloudinary.com/dadiutcqh/image/upload/v1781960954/clients_ki_profile_pics_de_202606120001_2_dalgmu.png"
                  alt="Student"
                  style={{width:35,height:35,borderRadius:'50%',border:`2px solid ${BLUE}`,marginLeft:i>0?-10:0,boxShadow:'0 2px 6px rgba(0,0,0,0.2)',objectFit:'cover'}}
                />
              ))}
            </div>
            <div style={{textAlign:'left'}}>
              <div style={{fontSize:16,fontWeight:500,fontFamily:'Inter',color:'black',textTransform:'capitalize'}}>10M+ students worldwide</div>
              <div style={{display:'flex',gap:2,alignItems:'center',marginTop:2}}>
                {[1,2,3,4,5].map(s=><Star key={s} size={10} fill={BLUE} color={BLUE}/>)}
                <span style={{fontSize:8,fontWeight:400,fontFamily:'Inter',color:'black',textTransform:'capitalize',marginLeft:4}}>4.5/5 (35k Reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETPLACE */}
      <section style={{padding:'60px 24px',maxWidth:1320,margin:'0 auto'}}>
        <div style={{display:'flex',gap:60,alignItems:'flex-start',flexWrap:'wrap'}}>

          {/* LEFT: Text + arrows */}
          <div style={{flex:'0 0 298px',minWidth:240}}>
            <div style={{display:'flex',gap:14,alignItems:'flex-start',marginBottom:20}}>
              <div style={{width:7,minHeight:105,background:BLUE,borderRadius:11,flexShrink:0,marginTop:4}}/>
              <div>
                <div style={{fontSize:16,fontFamily:'Inter',fontWeight:400,marginBottom:6}}>
                  <span style={{color:'black'}}>GET MORE </span><span style={{color:BLUE}}>CLOSER</span>
                </div>
                <div style={{fontSize:48,fontWeight:500,fontFamily:'Inter',lineHeight:1.15}}>
                  <span style={{color:'black'}}>Marketplace<br/>for </span><span style={{color:BLUE}}>Creativity</span>
                </div>
              </div>
            </div>
            <p style={{color:'rgba(0,0,0,0.60)',fontSize:16,fontWeight:400,fontFamily:'Inter',lineHeight:1.6,marginBottom:32}}>
              Organize books, track availability, manage members and simplify daily library operations.
            </p>
            {/* Navigation arrows */}
            <div style={{display:'flex',gap:8}}>
              {['←','→'].map((arrow,i)=>(
                <button key={i} style={{
                  width:37,height:37,borderRadius:'50%',
                  background:'rgba(0,0,0,0.08)',border:'none',cursor:'pointer',
                  fontSize:14,color:'black',display:'flex',alignItems:'center',justifyContent:'center',
                  transition:'background 0.2s',
                }}>{arrow}</button>
              ))}
            </div>
          </div>

          {/* RIGHT: Cards + View All */}
          <div style={{flex:1,minWidth:300}}>
            {/* View All aligned top-right */}
            <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>
              <Link href="/register" style={{
                padding:'10px 24px',height:39,borderRadius:38,
                background:BLUE,color:'white',fontSize:16,fontWeight:500,
                fontFamily:'Inter',display:'inline-flex',alignItems:'center',
              }}>View All</Link>
            </div>

            {/* 3 Book cards */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:12}}>
              {[
                {title:'Best Author',        img1:'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966160/2b6bdc8890caf6725bac452d668983177171fe75_pd81vb.png',  img2:'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966397/7dc2c9ce9f7e759580caf98f5b105fd21d5d57f4_t1sghw.png'},
                {title:'Deep Understanding', img1:'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966485/5d9d4ba558d3c5f069df8b6dba80b4871fe18641_aiv1sb.png',  img2:'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966543/1b5dd1dc0ba2203d7616047bc3e67e2539ab5ebd_hoyhdt.png'},
                {title:'Educational books',  img1:'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966564/e31e8b25a45e30befb5e8134306d7302e20e480f_pljnqm.png',  img2:'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966160/2b6bdc8890caf6725bac452d668983177171fe75_pd81vb.png'},
              ].map(({title,img1,img2})=>(
                <div key={title} style={{
                  background:'white',borderRadius:14,
                  border:'1px solid rgba(0,0,0,0.19)',
                  overflow:'hidden',
                }}>
                  {/* Book covers side by side */}
                  <div style={{display:'flex',height:209}}>
                    <img src={img1} alt={title} style={{width:'48%',height:'100%',objectFit:'cover',borderTopLeftRadius:7,borderBottomLeftRadius:7}}/>
                    <img src={img2} alt={title} style={{width:'52%',height:'100%',objectFit:'cover',borderTopRightRadius:7,borderBottomRightRadius:7}}/>
                  </div>
                  {/* Label */}
                  <div style={{padding:'10px 12px',color:'black',fontSize:16,fontWeight:500,fontFamily:'Inter'}}>
                    {title}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar spanning all 3 cards */}
            <div style={{height:5,background:'rgba(0,0,0,0.12)',borderRadius:27,width:'100%'}}>
              <div style={{width:'33.3%',height:'100%',background:DARK,borderRadius:27}}/>
            </div>
          </div>

        </div>
      </section>


      {/* VISION */}
      <section id="about" style={{background:'rgba(26,115,232,0.05)',padding:'80px 24px'}}>
        <div style={{maxWidth:1320,margin:'0 auto',display:'flex',gap:60,alignItems:'flex-start',flexWrap:'wrap'}}>

          {/* LEFT column */}
          <div style={{flex:'0 0 420px',minWidth:280}}>
            {/* Small icon top-left */}
            <div style={{width:30,height:30,borderRadius:12,border:'1px solid rgba(0,0,0,0.08)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>

            <h2 style={{fontSize:48,fontWeight:600,fontFamily:'Inter',lineHeight:1.2,marginBottom:16}}>
              <span style={{color:'black'}}>Our vision<br/>for Digital </span><span style={{color:BLUE}}>Education</span>
            </h2>
            <p style={{color:'black',fontSize:16,fontWeight:400,fontFamily:'Inter',lineHeight:1.7,marginBottom:28}}>
              Building smarter campuses through simple and efficient library technology.
            </p>
            <a href="#features" style={{display:'inline-flex',alignItems:'center',padding:'10px 24px',height:39,borderRadius:38,border:'1px solid rgba(0,0,0,0.12)',color:'rgba(0,0,0,0.81)',fontSize:16,fontWeight:500,fontFamily:'Inter',marginBottom:48}}>
              Learn More
            </a>

            {/* Scattered app/integration icons */}
            <div style={{position:'relative',height:160,width:'100%'}}>
              {[
                {top:0,   left:50,  size:62},
                {top:10,  left:110, size:62},
                {top:0,   left:175, size:62},
                {top:55,  left:25,  size:62},
                {top:60,  left:95,  size:62},
                {top:55,  left:165, size:62},
                {top:60,  left:235, size:62},
                {top:115, left:50,  size:62},
              ].map((pos,i)=>(
                <div key={i} style={{
                  position:'absolute', top:pos.top, left:pos.left,
                  width:pos.size, height:pos.size, borderRadius:46,
                  background:'white', boxShadow:'0 2px 8px rgba(0,0,0,0.08)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {/* placeholder — replace with actual icons later */}
                  <div style={{width:32,height:32,borderRadius:8,background:`hsl(${i*45},60%,65%)`}}/>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Dashboard panel */}
          <div style={{flex:1,minWidth:440}}>
            {/* "Business" tab sits ABOVE the card, outside */}
            <div style={{display:'flex',alignItems:'flex-end',gap:0,marginBottom:0}}>
              <div style={{
                padding:'12px 24px',color:'black',fontSize:24,fontWeight:500,fontFamily:'Inter',
                background:'white',borderRadius:'14px 14px 0 0',
                border:'1px solid rgba(0,0,0,0.08)',borderBottom:'none',
              }}>Business</div>
            </div>

            {/* White card */}
            <div style={{background:'white',borderRadius:'0 14px 14px 14px',overflow:'hidden',boxShadow:'0 4px 30px rgba(0,0,0,0.1)'}}>
              {/* Personal tab bar (active, dark bg) */}
              <div style={{background:DARK,padding:'12px 20px',display:'flex',alignItems:'center',gap:0}}>
                <div style={{color:'white',fontSize:24,fontWeight:500,fontFamily:'Inter',flex:1}}>Personal</div>
                {/* Traffic lights */}
                <div style={{display:'flex',gap:6,alignItems:'center',marginRight:12}}>
                  {['#DD4D4D','#D3DB58','#0D725D'].map(c=>(
                    <div key={c} style={{width:13,height:13,borderRadius:'50%',background:c}}/>
                  ))}
                </div>
                {/* Create button */}
                <div style={{background:'#F4F8FE',borderRadius:24,padding:'5px 14px',display:'flex',alignItems:'center',gap:6}}>
                  <div style={{width:10,height:10,borderRadius:'50%',background:BLUE}}/>
                  <span style={{color:'black',fontSize:16,fontWeight:500,fontFamily:'Inter'}}>Create</span>
                </div>
              </div>

              {/* 4×2 Book grid */}
              <div style={{padding:'16px',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
                {[
                  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967270/587a99a4b332f8a653f7020f2f5b4655e03686ef_niq00b.png',
                  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967264/cddacee78084dabbb4b846b509c20cd30ce44546_pkgfse.png',
                  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967246/a42412d3df3d12e6577cdb6a1418f0bde16fbdbe_fchgpo.png',
                  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967243/54a30c3a4505cafd2a8b753e026b73f80e8d97a3_kzzqey.png',
                  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967233/78cfcffed942089c708d535593091ab017a1bec8_l5uqod.png',
                  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967232/1ff261e52c8f2819a952d58c6e6bdc2974989328_dqwk84.png',
                  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967231/d69f6a3ad8778bdbf4149b18c012db676eff844f_sb5dq8.png',
                  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966564/e31e8b25a45e30befb5e8134306d7302e20e480f_pljnqm.png',
                ].map((src,i)=>(
                  <img key={i} src={src} alt={`Book ${i+1}`} style={{
                    width:'100%',height:140,objectFit:'cover',
                    borderRadius:8,boxShadow:'1px 2px 6px rgba(0,0,0,0.2)',
                    display:'block',
                  }}/>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* BOOK SPINES */}
      <section style={{padding:'80px 0',overflow:'hidden'}}>
        <div style={{textAlign:'center',marginBottom:48,padding:'0 24px'}}>
          <h2 style={{fontSize:48,fontWeight:600,fontFamily:'Inter',lineHeight:1.2}}>
            <span style={{color:'black'}}>Building the Future of Digital </span><span style={{color:BLUE}}>Libraries</span>
          </h2>
          <p style={{fontSize:16,fontWeight:400,fontFamily:'Inter',color:'rgba(0,0,0,0.60)',marginTop:16,maxWidth:440,margin:'16px auto 0'}}>
            A complete digital system for colleges, universities and libraries.
          </p>
        </div>
        <div style={{display:'flex',gap:5,overflowX:'hidden',alignItems:'flex-end',paddingBottom:4}}>
          {TS.map((s,i)=><Sp key={`t${i}`} color={s.color} h={s.h} w={s.w}/>)}
        </div>
        <div style={{display:'flex',gap:5,overflowX:'hidden',alignItems:'flex-start',paddingTop:4}}>
          {BS.map((s,i)=><Sp key={`b${i}`} color={s.color} h={s.h} w={s.w}/>)}
        </div>
      </section>

      {/* TRUSTED */}
      <section style={{padding:'80px 24px'}}>
        <div style={{maxWidth:1320,margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:16}}>
            <div style={{width:7,height:61,background:BLUE,borderRadius:11,flexShrink:0,marginTop:4}}/>
            <div>
              <h2 style={{fontSize:32,fontWeight:600,fontFamily:'Inter'}}>
                <span style={{color:'black'}}>Trusted by the </span><span style={{color:BLUE}}>best.</span>
              </h2>
              <p style={{fontSize:16,fontWeight:400,fontFamily:'Inter',color:'rgba(0,0,0,0.60)',marginTop:8}}>
                Our growth hackers are experts in the identifying and capitalizing on the most
              </p>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:20,marginTop:32}}>
            {[
              {name:'amazon',   label:'amazon',   color:'#FF9900',style:{fontSize:28,fontWeight:800,letterSpacing:-1}},
              {name:'Google',   label:'Google',   color:BLUE,    style:{fontSize:28,fontWeight:700}},
              {name:'∞ Meta',   label:'∞ Meta',   color:'#0866FF',style:{fontSize:22,fontWeight:700}},
              {name:'SAMSUNG',  label:'SAMSUNG',  color:'#1428A0',style:{fontSize:18,fontWeight:700,letterSpacing:2}},
              {name:'Infosys',  label:'Infosys',  color:'#007CC3',style:{fontSize:22,fontWeight:700}},
            ].map(b=>(
              <div key={b.name} style={{background:'rgba(255,255,255,0.54)',boxShadow:'0 4px 4px rgba(0,0,0,0.05)',borderRadius:10,padding:'28px 20px',display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid rgba(0,0,0,0.06)'}}>
                <span style={{color:b.color,fontFamily:'Inter',...b.style}}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{padding:'100px 24px'}}>
        <div style={{maxWidth:1320,margin:'0 auto'}}>
          <div style={{display:'flex',gap:80,alignItems:'center',marginBottom:100,flexWrap:'wrap'}}>
            <div style={{flex:1,minWidth:300}}><BookMock/></div>
            <div style={{flex:1,minWidth:280}}>
              <h2 style={{fontSize:32,fontWeight:600,fontFamily:'Inter',color:'black',marginBottom:16}}>Digital library experience</h2>
              <p style={{fontSize:20,fontWeight:500,fontFamily:'Inter',color:'rgba(0,0,0,0.60)',lineHeight:1.6,marginBottom:24}}>
                Librarium makes it simple to search, explore, and access resources while giving colleges a smarter way to manage books, members, requests, and everyday library operations.
              </p>
              <Link href="/register" style={{display:'inline-flex',padding:'10px 24px',borderRadius:38,background:BLUE,color:'white',fontSize:16,fontWeight:500,fontFamily:'Inter'}}>View All</Link>
            </div>
          </div>
          <div style={{display:'flex',gap:80,alignItems:'center',flexWrap:'wrap'}}>
            <div style={{flex:1,minWidth:280}}>
              <h2 style={{fontSize:32,fontWeight:600,fontFamily:'Inter',color:'black',marginBottom:16}}>Complete library control</h2>
              <p style={{fontSize:20,fontWeight:500,fontFamily:'Inter',color:'rgba(0,0,0,0.60)',lineHeight:1.6,marginBottom:24}}>
                Librarium provides colleges with a centralized library management system that simplifies book tracking, automates workflows, and helps librarians make smarter decisions with detailed insights.
              </p>
              <Link href="/register" style={{display:'inline-flex',padding:'10px 24px',borderRadius:38,background:BLUE,color:'white',fontSize:16,fontWeight:500,fontFamily:'Inter'}}>View All</Link>
            </div>
            <div style={{flex:1,minWidth:300}}><RecordMock/></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'40px 24px 60px'}}>
        <div style={{maxWidth:1203,margin:'0 auto',background:'linear-gradient(127deg,#08655A 29%,#0D725D 50%,#2FCC72 100%)',borderRadius:30,padding:'48px 60px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:32,position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',right:-30,top:-60,width:317,height:317,background:'rgba(255,255,255,0.09)',borderRadius:'50%',pointerEvents:'none'}}/>
          <div style={{position:'absolute',right:-80,bottom:-80,width:172,height:172,background:'rgba(255,255,255,0.09)',borderRadius:'50%',pointerEvents:'none'}}/>
          {/* Icon placeholder */}
          <div style={{width:67,height:65,background:'rgba(217,217,217,0.31)',borderRadius:20,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <BookOpen size={28} color="white"/>
          </div>
          <div style={{flex:1,minWidth:280}}>
            <h2 style={{color:'white',fontSize:24,fontWeight:600,fontFamily:'Inter',marginBottom:12}}>Transform Your Library Today</h2>
            <p style={{color:'rgba(255,255,255,0.72)',fontSize:16,fontWeight:400,fontFamily:'Inter',maxWidth:539,lineHeight:1.6,marginBottom:16}}>
              Join colleges using Librarium to simplify library management and transform the way they handle books, students, and daily operations.
            </p>
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              {['1000+ Members','Daily Updates','Active Discussions'].map(t=>(
                <div key={t} style={{background:'rgba(255,255,255,0.21)',borderRadius:28,padding:'4px 16px',color:'white',fontSize:14,fontWeight:400,fontFamily:'Inter'}}>{t}</div>
              ))}
            </div>
          </div>
          <Link href="/register" style={{display:'flex',alignItems:'center',gap:8,padding:'12px 28px',background:'white',borderRadius:38,color:'rgba(0,0,0,0.81)',fontSize:16,fontWeight:500,fontFamily:'Inter',flexShrink:0}}>
            <BookOpen size={20} color={DARK}/> Get Started
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:DARK}}>
        <div style={{maxWidth:1320,margin:'0 auto',padding:'60px 24px 40px'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr',gap:40,marginBottom:48}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
                <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${BLUE},${DARK})`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <BookOpen size={18} color="white"/>
                </div>
                <span style={{fontSize:18,fontWeight:700,color:'white',fontFamily:'Inter'}}>Librar<span style={{color:BLUE}}>ium</span></span>
              </div>
              <p style={{color:'white',fontSize:16,fontWeight:400,fontFamily:'Inter',lineHeight:1.6,marginBottom:12}}>Empowering smarter libraries worldwide</p>
              <p style={{color:'white',fontSize:16,fontWeight:400,fontFamily:'Inter'}}>Info@librarium.app</p>
            </div>
            {[
              {title:'Product',  links:['Features','Solutions','Pricing']},
              {title:'Platform', links:['Student Portal','Librarian Dashboard','Book Management']},
              {title:'Resources',links:['Help Center','FAQs','Contact Support']},
              {title:'Company',  links:['About Us','Careers','Privacy Policy','Terms & Conditions']},
            ].map(col=>(
              <div key={col.title}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
                  <div style={{width:4,height:20,background:BLUE,borderRadius:11}}/>
                  <div style={{color:'white',fontSize:20,fontWeight:500,fontFamily:'Inter'}}>{col.title}</div>
                </div>
                {col.links.map(l=>(
                  <div key={l} style={{color:'rgba(255,255,255,0.53)',fontSize:16,fontWeight:500,fontFamily:'Inter',marginBottom:12,cursor:'pointer'}}>{l}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{background:'#0B1B2D',padding:'18px 24px',textAlign:'center'}}>
          <div style={{color:'white',fontSize:12,fontWeight:500,fontFamily:'Inter'}}>© 2026 Librarium. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
