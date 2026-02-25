# NgVirtualList Chat Demo

✨ NgVirtualList Chat Demo (ng-virtual-list-chat-demo) is an Angular-based showcase application designed to demonstrate high-performance rendering of long message history using virtual scrolling techniques.

The main task was to implement a virtual list with dynamically height elements using virtual scrolling.

The project uses dependencies only from the Angular ecosystem without implementing third-party solutions.

<img width="1033" height="171" alt="logo-center" src="https://github.com/user-attachments/assets/051bf2b3-0ead-4074-80f5-1ba6f994f419" />

<b>Angular version 20.X.X</b>.

[Live Demo](https://chat-demo.eugene-grebennikov.pro/)

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

## 🧩 Purpose and Problems Solved
This project addresses performance issues when working with long lists of chat messages:

- DOM overload: without virtualization, the browser attempts to display all messages at once, even those not visible to the user;
- Scrolling slowdown: with thousands of messages, scrolling becomes laggy;
- High memory consumption: storing all elements in memory reduces overall application performance.
- Virtual scrolling solves these issues by displaying only the messages visible to the user and a small buffer around them.

<br/>

## ⚡Advantages of this approach
- High performance: smooth scrolling even with 100,000+ elements;
- Low memory consumption: only visible elements are stored in memory;
- Flexibility: support for dynamic sizes, grouping, and animation;
- Integration with Angular: native template syntax, reactive forms;
- Ease of setup: minimal code changes required for implementation.

<br/>

## 🔍 Brief description of components

- [src\app\shared\components\substrate](https://github.com/DjonnyX/ng-virtual-list-chat-demo/tree/main/src/app/shared/components/substrate) is a basic component for rendering shapes with highlight animation.<br/>
- [src\app\shared\components\x-virtual-list](https://github.com/DjonnyX/ng-virtual-list-chat-demo/tree/main/src/app/shared/components/x-virtual-list) is a fork of the [ng-virtual-list](https://github.com/DjonnyX/ng-virtual-list) library.
- Added [src\app\shared\components\x-virtual-list\lib\components\scroller](https://github.com/DjonnyX/ng-virtual-list-chat-demo/tree/main/src/app/shared/components/x-virtual-list/lib/components/scroller) and [src\app\shared\components\x-virtual-list\lib\components\x-scroll-bar](https://github.com/DjonnyX/ng-virtual-list-chat-demo/tree/main/src/app/shared/components/x-virtual-list/lib/components/x-scroll-bar) developed based on [src\app\shared\components\substrate](https://github.com/DjonnyX/ng-virtual-list-chat-demo/blob/main/src/app/shared/components/substrate/substrate.component.ts).
- The [src\app\shared\components\x-virtual-list](https://github.com/DjonnyX/ng-virtual-list-chat-demo/tree/main/src/app/shared/components/x-virtual-list) core is adapted for virtual scrolling and rendering of SVG shapes.
- An example of virtual scrolling implementation [src\app\shared\components\x-virtual-list\lib\components\scroller\x-scroller.component.ts](https://github.com/DjonnyX/ng-virtual-list-chat-demo/blob/main/src/app/shared/components/x-virtual-list/lib/components/scroller/x-scroller.component.ts)

<br/>

## 🚀 Getting Started:

1. 📄 Clone the repository.

```bash
git clone https://github.com/DjonnyX/ng-virtual-list-chat-demo.git
cd ng-virtual-list-chat-demo
```

2. 📦 Install dependencies

```bash
npm install
```

3. 🔀 Launch the development server

```bash
npm ng serve
```
or

```bash
npm ng start
```

4. 📱Open http://localhost:4200/ in your browser

<br/>

![preview](https://github.com/user-attachments/assets/94c77231-07a6-443d-8c67-a1c831cd0e35)

<br/>

# 📄 LICENSE
Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
All rights reserved.
