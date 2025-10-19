import { objectAsReadonly } from "./utils";
import { ITheme } from "./interfaces/theme";

const manifest: ITheme = {
    chat: {
        header: {
            background: 'rgb(10, 8, 17)',
            color: 'rgb(181, 158, 202)',
            fontSize: '14px',
            menuButton: {
                normal: {
                    background: 'transparent',
                    color: 'none',
                    fill: 'rgb(181, 158, 202)',
                },
                pressed: {
                    background: 'transparent',
                    color: 'none',
                    fill: 'rgb(181, 158, 202)',
                },
                focused: {
                    background: 'transparent',
                    color: 'none',
                    fill: 'rgb(212, 196, 228)',
                },
            },
            search: {
                normal: {
                    background: 'rgb(9, 5, 19)',
                    borderColor: 'rgb(34, 24, 51)',
                    color: 'rgb(181, 158, 202)',
                    fontSize: '14px',
                    fill: 'rgb(181, 158, 202)',
                    placeholder: {
                        color: 'rgb(161, 138, 182)',
                        fontSize: '14px',
                    },
                },
                focused: {
                    background: 'rgb(35, 15, 56)',
                    borderColor: 'rgb(198, 244, 255)',
                    color: 'rgb(181, 158, 202)',
                    fontSize: '14px',
                    fill: 'rgb(181, 158, 202)',
                    placeholder: {
                        color: 'rgb(161, 138, 182)',
                        fontSize: '14px',
                    },
                }
            },
        },
        messages: {
            background: "linear-gradient(180deg, rgb(8, 4, 15) 0%, rgb(4, 16, 20) 100%)",
            backgroundImage: "url(background_infinity-dark.png)",
            group: {
                normal: {
                    background: "rgba(20, 6, 36, 0.74)",
                    color: "rgb(206, 191, 220)",
                    fill: "rgb(206, 191, 220)",
                    borderColor: "transparent",
                },
                selected: {
                    background: "rgba(45, 15, 73, 0.57)",
                    color: "rgb(206, 191, 220)",
                    fill: "rgb(206, 191, 220)",
                    borderColor: "transparent",
                },
                focused: {
                    background: "rgba(57, 23, 90, 0.57)",
                    color: "rgb(206, 191, 220)",
                    fill: "rgb(206, 191, 220)",
                    borderColor: "rgba(206, 191, 220, 0.1)",
                },
                focusedSelected: {
                    background: "rgba(70, 32, 107, 0.57)",
                    color: "rgb(206, 191, 220)",
                    fill: "rgb(206, 191, 220)",
                    borderColor: "rgba(206, 191, 220, 0.14)",
                },
            },
            message: {
                container: {
                    normal: {
                        background: "none",
                    },
                    selected: {
                        background: "rgba(50, 42, 119, 0.41)",
                    },
                    edited: {
                        background: "rgba(93, 79, 173, 0.41)",
                    },
                },
                content: {
                    textEditor: {
                        link: {
                            normal: {
                                color: "rgb(151, 202, 231)",
                            },
                            visited: {
                                color: "rgb(206, 176, 212)",
                            },
                            hover: {
                                color: "rgb(209, 238, 255)",
                            },
                            active: {
                                color: "rgb(236, 214, 144)",
                            },
                        }
                    },
                    searchSubstringColor: 'rgba(0, 140, 255, 0.38)',
                    editingTextBackground: 'rgba(0, 0, 0, 0.1)',
                    normal: {
                        fill: ["rgb(56, 43, 179)", "rgb(82, 32, 126)"],
                        color: "rgb(206, 191, 220)",
                    },
                    selected: {
                        fill: ["rgb(74, 61, 196)", "rgb(96, 44, 141)"],
                        color: "rgb(206, 191, 220)",
                    },
                    focused: {
                        fill: ["rgb(87, 74, 204)", "rgb(106, 55, 151)"],
                        color: "rgb(206, 191, 220)",
                    },
                    focusedSelected: {
                        fill: ["rgb(87, 74, 204)", "rgb(106, 55, 151)"],
                        color: "rgb(206, 191, 220)",
                    },
                    removal: {
                        fill: ["rgb(163, 53, 173)", "rgb(139, 20, 86)"],
                        color: "rgb(206, 191, 220)",
                    },
                    removalSelected: {
                        fill: ["rgb(163, 53, 173)", "rgb(139, 20, 86)"],
                        color: "rgb(206, 191, 220)",
                    }
                },
                controls: {
                    menu: {
                        normal: {
                            fill: ["rgb(56, 43, 179)", "rgb(82, 32, 126)"],
                            iconFill: "rgb(206, 191, 220)",
                        },
                        pressed: {
                            fill: ["rgb(87, 74, 204)", "rgb(106, 55, 151)"],
                            iconFill: "rgb(206, 191, 220)",
                        },
                        disabled: {
                            fill: ["rgba(56, 43, 179, .25)", "rgba(82, 32, 126, .25)"],
                            iconFill: "rgb(206, 191, 220)",
                        },
                    },
                    cancel: {
                        normal: {
                            fill: ["rgb(86, 22, 190)", "rgb(104, 0, 136)"],
                            iconFill: "rgb(206, 191, 220)",
                        },
                        pressed: {
                            fill: ["rgb(68, 20, 146)", "rgb(89, 6, 114)"],
                            iconFill: "rgb(206, 191, 220)",
                        },
                        disabled: {
                            fill: ["rgba(86, 22, 190, .25)", "rgba(104, 0, 136, .25)"],
                            iconFill: "rgb(206, 191, 220)",
                        },
                    },
                    send: {
                        normal: {
                            fill: ["rgb(86, 22, 190)", "rgb(104, 0, 136)"],
                            iconFill: "rgb(206, 191, 220)",
                        },
                        pressed: {
                            fill: ["rgb(68, 20, 146)", "rgb(89, 6, 114)"],
                            iconFill: "rgb(206, 191, 220)",
                        },
                        disabled: {
                            fill: ["rgba(86, 22, 190, .25)", "rgba(104, 0, 136, .25)"],
                            iconFill: "rgb(206, 191, 220)",
                        },
                    },
                },
                styles: {
                    processing: {
                        stroke: ['rgba(255,255,255,0)', 'rgb(219, 156, 255)'],
                    },
                    removing: {
                        stroke: ['rgba(0,188,212,0)', 'rgb(255, 176, 193)'],
                    },
                },
            },
        },
        chats: {

        },
    },
};

const THEME_DARK = objectAsReadonly(manifest);

export {
    THEME_DARK,
};
