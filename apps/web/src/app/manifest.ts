import type { MetadataRoute } from 'next';
export default function manifest():MetadataRoute.Manifest{return{name:'Davas 감상 기록장',short_name:'Davas',description:'가까운 친구와 나누는 영화·드라마 감상 기록장',start_url:'/',scope:'/',display:'standalone',background_color:'#f6f8fc',theme_color:'#284778',orientation:'portrait',icons:[{src:'/icon.jpg',sizes:'512x512',type:'image/jpeg',purpose:'maskable'}]}}
