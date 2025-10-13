import { objectAsReadonly } from "@shared/utils";
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
                        background: "rgba(79, 42, 119, 0.41)",
                    },
                    edited: {
                        background: "rgba(124, 79, 173, 0.41)",
                    },
                },
                content: {
                    searchSubstringColor: 'rgba(0, 140, 255, 0.38)',
                    normal: {
                        fill: "rgb(69, 38, 97)",
                        color: "rgb(206, 191, 220)",
                    },
                    selected: {
                        fill: "rgb(86, 33, 136)",
                        color: "rgb(206, 191, 220)",
                    },
                    focused: {
                        fill: "rgb(98, 54, 139)",
                        color: "rgb(206, 191, 220)",
                    },
                    focusedSelected: {
                        fill: "rgb(107, 70, 143)",
                        color: "rgb(206, 191, 220)",
                    },
                    removal: {
                        fill: "rgb(99, 32, 69)",
                        color: "rgb(206, 191, 220)",
                    },
                    removalSelected: {
                        fill: "rgb(99, 32, 69)",
                        color: "rgb(206, 191, 220)",
                    }
                },
                styles: {
                    processing: {
                        stroke: ['rgba(255,255,255,0)', 'rgb(160, 102, 194)'],
                    },
                    removing: {
                        stroke: ['rgba(0,188,212,0)', 'rgba(255,100,133,1)'],
                    },
                    loading: {
                        stroke: ['rgba(0,188,212,0)', 'rgba(0,188,212,1)'],
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
