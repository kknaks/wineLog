import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

// 플랫폼 확인
export const isNativeApp = () => Capacitor.isNativePlatform();
export const getPlatform = () => Capacitor.getPlatform();

// 카메라 권한 미리 요청
export const requestCameraPermissions = async () => {
  if (!isNativeApp()) {
    return { camera: 'granted', photos: 'granted' };
  }

  try {
    const permissions = await Camera.checkPermissions();
    console.log('현재 권한 상태:', permissions);

    if (permissions.camera !== 'granted' || permissions.photos !== 'granted') {
      console.log('권한 요청 중...');
      const requestResult = await Camera.requestPermissions();
      console.log('권한 요청 완료:', requestResult);
      return requestResult;
    }

    return permissions;
  } catch (error) {
    console.error('권한 요청 실패:', error);
    throw error;
  }
};

// 카메라로 와인 사진 촬영
export const takeWinePhoto = async () => {
  if (!isNativeApp()) {
    // 웹에서는 일반 파일 입력 사용
    return null;
  }

  try {
    // 먼저 권한을 확인하고 요청
    const permissions = await Camera.checkPermissions();
    console.log('카메라 권한 상태:', permissions);

    if (permissions.camera !== 'granted') {
      console.log('카메라 권한 요청 중...');
      const requestResult = await Camera.requestPermissions();
      console.log('권한 요청 결과:', requestResult);
      
      if (requestResult.camera !== 'granted') {
        throw new Error('카메라 권한이 거부되었습니다.');
      }
    }

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      saveToGallery: false,
      correctOrientation: true,
    });

    return image.dataUrl;
  } catch (error) {
    console.error('사진 촬영 실패:', error);
    throw error;
  }
};

// 갤러리에서 와인 사진 선택
export const pickWinePhoto = async () => {
  if (!isNativeApp()) {
    return null;
  }

  try {
    // 포토 라이브러리 권한 확인
    const permissions = await Camera.checkPermissions();
    console.log('포토 라이브러리 권한 상태:', permissions);

    if (permissions.photos !== 'granted') {
      console.log('포토 라이브러리 권한 요청 중...');
      const requestResult = await Camera.requestPermissions();
      console.log('권한 요청 결과:', requestResult);
      
      if (requestResult.photos !== 'granted') {
        throw new Error('포토 라이브러리 권한이 거부되었습니다.');
      }
    }

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });

    return image.dataUrl;
  } catch (error) {
    console.error('사진 선택 실패:', error);
    throw error;
  }
};

// 와인 일기 공유
export const shareWineDiary = async (title: string, text: string, imageUrl?: string) => {
  if (!isNativeApp()) {
    // 웹에서는 Web Share API 사용
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: window.location.href,
        });
      } catch (error) {
        console.error('공유 실패:', error);
      }
    }
    return;
  }

  try {
    await Share.share({
      title,
      text,
      url: imageUrl,
    });
  } catch (error) {
    console.error('공유 실패:', error);
  }
};

// 햅틱 피드백
export const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Medium) => {
  if (!isNativeApp()) return;

  try {
    await Haptics.impact({ style });
  } catch (error) {
    console.error('햅틱 피드백 실패:', error);
  }
};

// 로컬 파일 저장
export const saveWineDiary = async (diaryId: string, data: any) => {
  if (!isNativeApp()) {
    // 웹에서는 localStorage 사용
    localStorage.setItem(`wine-diary-${diaryId}`, JSON.stringify(data));
    return;
  }

  try {
    await Filesystem.writeFile({
      path: `wine-diary-${diaryId}.json`,
      data: JSON.stringify(data),
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  } catch (error) {
    console.error('파일 저장 실패:', error);
  }
};

// 로컬 파일 불러오기
export const loadWineDiary = async (diaryId: string) => {
  if (!isNativeApp()) {
    const data = localStorage.getItem(`wine-diary-${diaryId}`);
    return data ? JSON.parse(data) : null;
  }

  try {
    const file = await Filesystem.readFile({
      path: `wine-diary-${diaryId}.json`,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });

    return JSON.parse(file.data as string);
  } catch (error) {
    console.error('파일 불러오기 실패:', error);
    return null;
  }
};