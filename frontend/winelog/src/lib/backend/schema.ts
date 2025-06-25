// 임시 타입 정의 - 실제 OpenAPI 스키마에서 생성되어야 함

export interface paths {
  '/api/v1/diary/wine-analysis': {
    post: {
      requestBody: {
        content: {
          'multipart/form-data': {
            image_files: File[];
          };
        };
      };
      responses: {
        200: {
          content: {
            'application/json': {
              analysis_result: {
                success: boolean;
                analysis: {
                  wine_analysis: {
                    name: string;
                    origin: string;
                    grape: string;
                    year: string;
                    alcohol: string;
                    type: string;
                    description: string;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
  '/api/v1/diary/wine-taste': {
    post: {
      requestBody: {
        content: {
          'application/json': {
            name: string;
            origin?: string;
            grape?: string;
            year?: string;
            type?: string;
          };
        };
      };
      responses: {
        200: {
          content: {
            'application/json': {
              taste_result: {
                tastingNote: {
                  aroma: string;
                  taste: string;
                  finish: string;
                  sweetness: number;
                  acidity: number;
                  tannin: number;
                  body: number;
                };
              };
            };
          };
        };
      };
    };
  };
  '/api/v1/diary/save': {
    post: {
      requestBody: {
        content: {
          'multipart/form-data': {
            wineData: string;
            drinkDate: string;
            rating: string;
            review: string;
            price: string;
            isPublic: string;
            frontImage?: File;
            backImage?: File;
            thumbnailImage?: File;
            downloadImage?: File;
          };
        };
      };
      responses: {
        200: {
          content: {
            'application/json': {
              success: boolean;
              message: string;
            };
          };
        };
      };
    };
  };
} 