# 📄 MongoDB 매니저

MongoDB 데이터베이스를 쉽게 관리하고 모니터링할 수 있는 웹 기반 관리 도구입니다. MongoDB의 기본적인 CRUD 작업부터 고급 쿼리 작성까지 직관적인 UI로 제공합니다.  
🔗 [사이트 바로가기](https://mongo-db-manager.vercel.app/documents?database=portfolio)

<img width="1920" alt="db_2" src="https://github.com/user-attachments/assets/819ba18e-1aff-4ab8-9d10-72449a344485">


## ✨ 주요 기능

- 📊 데이터베이스 연결 및 관리
- 🔍 컬렉션 및 문서 조회
- ✏️ 문서 추가, 수정, 삭제 기능
- 💻 고급 쿼리 작성 기능
- ♾️ 무한 스크롤을 통한 대량 문서 로딩

## 🛠 기술 스택

- **Frontend**: Next.js, TypeScript, Styled Components
- **상태 관리**: Recoil
- **데이터베이스**: MongoDB Native Driver
- **배포**: Vercel

## 💡 핵심 기능 설명

### 데이터베이스 관리 시스템

- MongoDB 네이티브 드라이버를 활용한 직접적인 데이터베이스 제어
- 다중 데이터베이스 연결 및 관리 지원
- 데이터베이스 구조 시각화

### 문서 관리 기능

- 컬렉션 내 문서 조회 및 필터링
- JSON 형식의 직관적인 문서 편집 인터페이스
- 대량의 문서도 원활하게 처리할 수 있는 무한 스크롤

### 쿼리 작성 시스템

- 고급 MongoDB 쿼리 작성 및 실행
- 쿼리 결과 실시간 프리뷰

### 성능 최적화

- **효율적인 데이터 로딩**: 무한 스크롤을 통한 점진적인 문서 로딩
- **캐시 최적화**: 브라우저 캐시를 활용한 빠른 데이터 접근
- **네이티브 드라이버**: MongoDB 네이티브 드라이버를 통한 직접 제어로 성능 향상
