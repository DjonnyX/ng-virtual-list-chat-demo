# NgVirtualList Chat Demo

✨ NgVirtualList Chat Demo (ng-virtual-list-chat-demo) is an Angular-based showcase application designed to demonstrate high-performance rendering of long message history using virtual scrolling techniques.

<img width="1033" height="171" alt="logo-center" src="https://github.com/user-attachments/assets/051bf2b3-0ead-4074-80f5-1ba6f994f419" />

<b>Angular version 20.X.X</b>.

[Live Demo](https://chat-demo.eugene-grebennikov.pro/)

![preview](https://github.com/user-attachments/assets/94c77231-07a6-443d-8c67-a1c831cd0e35)

<br/>

## ⚙️ Key Features
- List virtualization: Efficiently displays thousands of messages with minimal memory usage and no lag.
- Smooth user interface: Handles dynamic content height and maintains scroll position during real-time updates.
- Modern stack: Built using Angular and the ng-virtual-list library fork for optimized DOM management with improved list virtualization.
- Interactive testing: Includes a real-time message simulator to test list behavior under load.
- Implemented a virtual scroll handler, ensuring stable scrolling on all platforms.
- Implemented a UI kit using SVG components with a unique design and animation.
- Full multilingual support and interface adaptation for right-to-left languages.
- Implemented full theming.
- Works correctly in all browsers and platforms.

<br/>

## 🚀 Getting Started:

📄 Clone the repository.

📦 Install dependencies

```bash
npm install
```

🔀 Launch the development server

```bash
npm ng serve
```
or

```bash
npm ng start
```

📱Open http://localhost:4200/ in your browser

<br/>

## Description

[src\app\shared\components\substrate](https://github.com/DjonnyX/ng-virtual-list-chat-demo/tree/main/src/app/shared/components/substrate) is a basic component for rendering shapes with highlight animation.<br/>
[src\app\shared\components\x-virtual-list](https://github.com/DjonnyX/ng-virtual-list-chat-demo/tree/main/src/app/shared/components/x-virtual-list) is a fork of the [ng-virtual-list](https://github.com/DjonnyX/ng-virtual-list) library.<br/> Added [src\app\shared\components\x-virtual-list\lib\components\scroller](https://github.com/DjonnyX/ng-virtual-list-chat-demo/tree/main/src/app/shared/components/x-virtual-list/lib/components/scroller) and [src\app\shared\components\x-virtual-list\lib\components\x-scroll-bar](https://github.com/DjonnyX/ng-virtual-list-chat-demo/tree/main/src/app/shared/components/x-virtual-list/lib/components/x-scroll-bar) developed based on [src\app\shared\components\substrate](https://github.com/DjonnyX/ng-virtual-list-chat-demo/blob/main/src/app/shared/components/substrate/substrate.component.ts).<br/>
The [src\app\shared\components\x-virtual-list](https://github.com/DjonnyX/ng-virtual-list-chat-demo/tree/main/src/app/shared/components/x-virtual-list) core is adapted for virtual scrolling and rendering of SVG shapes.<br/>

An example of virtual scrolling implementation [src\app\shared\components\x-virtual-list\lib\components\scroller\x-scroller.component.ts](https://github.com/DjonnyX/ng-virtual-list-chat-demo/blob/main/src/app/shared/components/x-virtual-list/lib/components/scroller/x-scroller.component.ts)

<br/>

# 📄 LICENSE
Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
All rights reserved.
