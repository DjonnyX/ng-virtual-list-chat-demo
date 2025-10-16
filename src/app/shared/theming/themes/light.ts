import { objectAsReadonly } from "@shared/utils";
import { ITheme } from "./interfaces/theme";

const manifest: ITheme = {
    chat: {
        header: {
            background: 'rgb(67, 33, 139)',
            color: 'rgb(161, 153, 219)',
            fontSize: '14px',
            menuButton: {
                normal: {
                    background: 'transparent',
                    color: 'none',
                    fill: 'rgb(161, 153, 219)',
                },
                pressed: {
                    background: 'transparent',
                    color: 'none',
                    fill: 'rgb(161, 153, 219)',
                },
                focused: {
                    background: 'transparent',
                    color: 'none',
                    fill: 'rgb(161, 153, 219)',
                },
            },
            search: {
                normal: {
                    background: 'rgb(79, 46, 156)',
                    borderColor: 'rgb(84, 76, 177)',
                    color: 'rgb(190, 214, 235)',
                    fontSize: '14px',
                    fill: 'rgb(214, 209, 255)',
                    placeholder: {
                        color: 'rgb(145, 169, 190)',
                        fontSize: '14px',
                    },
                },
                focused: {
                    background: 'rgb(79, 46, 156)',
                    borderColor: 'rgb(198, 244, 255)',
                    color: 'rgb(190, 214, 235)',
                    fontSize: '14px',
                    fill: 'rgb(214, 209, 255)',
                    placeholder: {
                        color: 'rgb(145, 169, 190)',
                        fontSize: '14px',
                    },
                }
            },
        },
        messages: {
            background: "linear-gradient(180deg, rgb(80, 42, 155) 0%, rgb(53, 147, 184) 100%)",
            backgroundImage: "url(background_infinity.png)",
            group: {
                normal: {
                    background: "rgba(255, 255, 255, 0.361)",
                    color: "rgb(255, 255, 255)",
                    fill: "rgb(255, 255, 255)",
                    borderColor: "transparent",
                },
                selected: {
                    background: "rgba(255, 255, 255, 0.4)",
                    color: "rgb(255, 255, 255)",
                    fill: "rgb(255, 255, 255)",
                    borderColor: "transparent",
                },
                focused: {
                    background: "rgba(255, 255, 255, 0.438)",
                    color: "rgb(255, 255, 255)",
                    fill: "rgb(255, 255, 255)",
                    borderColor: "rgba(255, 240, 185, 0.643)",
                },
                focusedSelected: {
                    background: "rgba(255, 255, 255, 0.47)",
                    color: "rgb(255, 255, 255)",
                    fill: "rgb(255, 255, 255)",
                    borderColor: "rgba(255, 244, 206, 0.64)",
                },
            },
            message: {
                container: {
                    normal: {
                        background: "none",
                    },
                    selected: {
                        background: "rgba(200,244,255,0.41)",
                    },
                    edited: {
                        background: "rgb(166, 219, 255)",
                    },
                },
                content: {
                    searchSubstringColor: 'rgba(255, 0, 191, 0.23)',
                    normal: {
                        fill: ["rgb(255, 255, 255)", "rgb(185, 210, 233)"],
                        color: "rgb(25, 34, 37)",
                    },
                    selected: {
                        fill: ["rgb(230, 255, 255)", "rgb(171, 209, 245)"],
                        color: "rgb(25, 34, 37)",
                    },
                    focused: {
                        fill: ["rgb(255, 255, 255)", "rgb(234, 245, 255)"],
                        color: "rgb(25, 34, 37)",
                    },
                    focusedSelected: {
                        fill: ["rgb(238, 252, 255)", "rgb(218, 237, 255)"],
                        color: "rgb(25, 34, 37)",
                    },
                    removal: {
                        fill: ["rgb(255, 230, 238)", "rgb(255, 171, 198)"],
                        color: "rgb(25, 34, 37)",
                    },
                    removalSelected: {
                        fill: ["rgb(255, 230, 238)", "rgb(255, 171, 198)"],
                        color: "rgb(25, 34, 37)",
                    }
                },
                styles: {
                    processing: {
                        stroke: ['rgba(255,255,255,0)', 'rgb(160, 102, 194)'],
                    },
                    removing: {
                        stroke: ['rgba(0,188,212,0)', 'rgba(255,100,133,1)'],
                    },
                },
            },
        },
        chats: {

        },
    },
};

const THEME_LIGHT = objectAsReadonly(manifest);

export {
    THEME_LIGHT,
};
