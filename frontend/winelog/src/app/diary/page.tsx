import Image from 'next/image';

interface WineDiary {
  image: string;
  name: string;
  origin: string;
  grape: string;
  year: string;
  type: string;
  description: string;
  date: string;
}

export default function DiaryPage() {
  // 샘플 와인 다이어리 데이터
  const wineDiaries: WineDiary[] = [
    {
      image: '/images/samples/sample_image.jpg',
      name: 'Rotgipfler (로트기프플러)',
      origin: 'Gumpoldskirchen, Austria',
      grape: 'Rotgipfler',
      year: '2023',
      type: 'white',
      description: '오스트리아 고유의 백포도 품종으로, 굼폴트스키르헨 지역의 전통적인 와인입니다.',
      date: '2024.01.15'
    },
    {
      image: '/images/samples/sample_image1.jpeg',
      name: 'Pinot Noir (피노 누아)',
      origin: 'Burgundy, France',
      grape: 'Pinot Noir',
      year: '2022',
      type: 'red',
      description: '부르고뉴의 우아한 피노 누아로, 섬세한 과일향과 실키한 텍스처가 특징입니다.',
      date: '2024.01.12'
    },
    {
      image: '/images/samples/sample_image2.jpeg',
      name: 'Chardonnay (샤르도네)',
      origin: 'Chablis, France',
      grape: 'Chardonnay',
      year: '2023',
      type: 'white',
      description: '샤블리의 미네랄리티가 돋보이는 샤르도네로, 깔끔하고 드라이한 맛이 인상적입니다.',
      date: '2024.01.10'
    },
    {
      image: '/images/samples/sample_image3.jpeg',
      name: 'Cabernet Sauvignon (카베르네 소비뇽)',
      origin: 'Napa Valley, USA',
      grape: 'Cabernet Sauvignon',
      year: '2021',
      type: 'red',
      description: '나파 밸리의 풀바디 카베르네 소비뇽으로, 진한 과일향과 오크 향이 조화롭습니다.',
      date: '2024.01.08'
    },
    {
      image: '/images/samples/sample_image4.jpeg',
      name: 'Riesling (리슬링)',
      origin: 'Mosel, Germany',
      grape: 'Riesling',
      year: '2023',
      type: 'white',
      description: '모젤 지역의 달콤한 리슬링으로, 꽃향기와 과일의 단맛이 균형잡혀 있습니다.',
      date: '2024.01.05'
    },
    {
      image: '/images/samples/sample_image5.jpeg',
      name: 'Sangiovese (산지오베제)',
      origin: 'Tuscany, Italy',
      grape: 'Sangiovese',
      year: '2022',
      type: 'red',
      description: '토스카나의 클래식한 산지오베제로, 체리향과 허브의 복합적인 아로마가 특징입니다.',
      date: '2024.01.03'
    },
    {
      image: '/images/samples/sample_image6.jpeg',
      name: 'Sauvignon Blanc (소비뇽 블랑)',
      origin: 'Loire Valley, France',
      grape: 'Sauvignon Blanc',
      year: '2023',
      type: 'white',
      description: '루아르 밸리의 상큼한 소비뇽 블랑으로, 그래스향과 시트러스 노트가 생동감 있습니다.',
      date: '2024.01.01'
    },
    {
      image: '/images/samples/sample_image7.jpeg',
      name: 'Merlot (메를로)',
      origin: 'Bordeaux, France',
      grape: 'Merlot',
      year: '2022',
      type: 'red',
      description: '보르도의 부드러운 메를로로, 벨벳같은 질감과 자두의 달콤함이 매력적입니다.',
      date: '2023.12.28'
    },
    {
      image: '/images/samples/sample_image8.jpeg',
      name: 'Gewürztraminer (게뷔르츠트라미너)',
      origin: 'Alsace, France',
      grape: 'Gewürztraminer',
      year: '2023',
      type: 'white',
      description: '알자스의 향긋한 게뷔르츠트라미너로, 라이치와 장미꽃의 독특한 아로마가 인상적입니다.',
      date: '2023.12.25'
    },
    {
      image: '/images/samples/sample_image9.jpeg',
      name: 'Tempranillo (템프라니요)',
      origin: 'Rioja, Spain',
      grape: 'Tempranillo',
      year: '2021',
      type: 'red',
      description: '리오하의 전통적인 템프라니요로, 바닐라와 스파이스 향이 어우러진 복합적인 맛입니다.',
      date: '2023.12.22'
    },
  ];

  const getTypeColor = (type: string) => {
    return type === 'red' ? 'text-red-600' : 'text-yellow-600';
  };

  const getTypeIcon = (type: string) => {
    return type === 'red' ? '🍷' : '🥂';
  };

  return (
    <div className="bg-white min-h-full p-6">
      {/* 와인 다이어리 카드 목록 */}
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {wineDiaries.map((wine, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100">
            <div className="flex">
              {/* 왼쪽: 이미지 */}
              <div className="relative w-40 h-52 flex-shrink-0 bg-gray-50">
                <Image
                  src={wine.image}
                  alt={wine.name}
                  fill
                  className="object-contain"
                  sizes="160px"
                />
              </div>

              {/* 오른쪽: 와인 정보 */}
              <div className="flex-1 p-4">
                <h3 className="text-lg font-semibold text-gray-800 leading-tight mb-1">
                  {wine.name}
                </h3>
                <span className="text-sm text-gray-500 mb-3 block">
                  {wine.date}
                </span>

                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-medium ${getTypeColor(wine.type)}`}>
                      {getTypeIcon(wine.type)} {wine.type.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600">
                      {wine.year}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    📍 {wine.origin}
                  </p>
                  <p className="text-sm text-gray-600">
                    🍇 {wine.grape}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
