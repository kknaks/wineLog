export interface WineAnalysis {
  name: string;
  origin: string;
  grape: string;
  year: string;
  type: string;
  description: string;
}

export const mockWineAnalysis: WineAnalysis = {
  name: "Rotgipfler (로트기프플러)",
  origin: "Gumpoldskirchen, Austria (오스트리아 굼폴트스키르헨)",
  grape: "Rotgipfler (로트기프플러)",
  year: "2023",
  type: "white",
  description: `로트기프플러는 오스트리아 고유의 백포도 품종으로, 특히 굼폴트스키르헨 지역에서 전통적으로 재배되는 품종입니다. 이 와인은 Familie Reinisch(파밀리에 라이니시) 와이너리에서 2023년에 생산된 것으로 보입니다.

굼폴트스키르헨은 오스트리아 니더외스터라이히주에 위치한 유명한 와인 산지로, 로트기프플러와 지프안들러 같은 토착 품종으로 잘 알려져 있습니다.`
};