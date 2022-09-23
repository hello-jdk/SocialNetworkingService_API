# SocialNetworkingService_API

Social Networking Service REST API Server

## 목차

1. [개요](#1-개요)
2. [How To Use](#2-how-to-use)
3. [Convention](#3-convention)

`22.09.23 ~ 22.09.`

## 1. 개요

SNS 서비스 Server REST API

- 사용자는 서비스에 접속하여 게시물을 업로드 하거나 다른 사람의 게시물을 확인하고, 좋아요 기능을 이용할 수 있다.
- 사용자 정보는 JWT토큰을 이용
- 로그아웃은 프론트엔드에서 처리

### Applied Technology

- 사용언어 : `Javascript`
- 런타임 환경 : `Node.js`
- 프레임워크 : `Express`
- 데이터베이스 : `Mysql`
- ORM : `Sequelize`

### ERD

TODO: dbdiagram.io

### Directory Structure

```
TODO: Tree Structure
```

## 2. How To Use

```
npm install
npm start
```

### API DOCS

TODO: POSTMAN API DOCS 링크

### Preferences(.env)

```
TODO: (.env)
```

## 3. Convention

### Branch Convention

```
Main : Release 용, 완성된 버전(ex_v1.0)만 merge 됩니다.
Develop: 버전이 완성되기까지 이 브랜치를 사용합니다.
Feature: 기능별로 커밋합니다. API 도메인별로 나누어집니다.
Release: Develop 브랜치의 버전이 완성된 경우 이 브랜치에 저장합니다.
Hotfix: Release된 코드에서 버그가 발견될 경우 사용됩니다.
```

### Commit Convention

```
Init : 처음 커밋 및 환경 설정
Feat : 새로운 API에 대한 기능 추가
Modify : 기존 API에 대한 기능 고도화 및 코드 수정 (버그x)
Chore : 빌드 업무 수정, 패키지 매니저 수정, 그 외 주석수정 etc.
Docs : 문서 수정
Style : 코드 포맷팅, 코드 변경이 없는 경우, linting
Test : 테스트 코드, 리팩터링 테스트 코드
Refactor : 코드 리팩터링
Fix : 버그 수정
```
