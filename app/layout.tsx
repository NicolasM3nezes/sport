import './globals.css';import {Shell} from '@/components/Shell';
export const metadata={title:'Sports Probability Engine',description:'Análise estatística e probabilística de partidas esportivas'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body><Shell>{children}</Shell></body></html>}
