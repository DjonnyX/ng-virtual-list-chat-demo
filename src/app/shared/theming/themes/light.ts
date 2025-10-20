import { RoundedCorner } from "../../types";
import { objectAsReadonly } from "./utils";
import { ITheme } from "./interfaces/theme";
import { ButtonPresets, DialogPresets } from "./presets";

const BUTTON_ROUNDED_CORNER: RoundedCorner = [8, 8, 8, 8],
    DIALOG_ROUNDED_CORNER: RoundedCorner = [12, 12, 12, 12],
    DIALOG_PADDING = '36px 52px',
    BUTTON_ROUNDED_RECT_PADDING = '4px 6px';

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
                    outline: `2px solid rgba(161, 153, 219, 0.25)`,
                },
                disabled: {
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
                    editingTextBackground: 'rgba(255, 240, 185, 0.151)',
                    textEditor: {
                        link: {
                            normal: {
                                color: "rgb(94, 65, 255)",
                            },
                            visited: {
                                color: "rgb(136, 61, 185)",
                            },
                            hover: {
                                color: "rgb(53, 30, 187)",
                            },
                            active: {
                                color: "rgb(65, 141, 255)",
                            },
                        }
                    },
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
                controls: {
                    menu: {
                        normal: {
                            fill: ["rgb(255, 255, 255)", "rgb(185, 210, 233)"],
                            iconFill: "rgb(48, 44, 160)",
                        },
                        pressed: {
                            fill: ["rgb(226, 239, 245)", "rgb(156, 184, 209)"],
                            iconFill: "rgb(48, 44, 160)",
                        },
                        disabled: {
                            fill: ["rgba(255, 255, 255, .25)", "rgba(185, 210, 233, .25)"],
                            iconFill: "rgb(35, 32, 122)",
                        },
                    },
                    cancel: {
                        normal: {
                            fill: ["rgb(255, 255, 255)", "rgb(185, 210, 233)"],
                            iconFill: "rgb(48, 44, 160)",
                        },
                        pressed: {
                            fill: ["rgb(226, 239, 245)", "rgb(156, 184, 209)"],
                            iconFill: "rgb(48, 44, 160)",
                        },
                        disabled: {
                            fill: ["rgba(255, 255, 255, .25)", "rgba(185, 210, 233, .25)"],
                            iconFill: "rgb(35, 32, 122)",
                        },
                    },
                    send: ButtonPresets.PRIMARY,
                },
                styles: {
                    processing: {
                        stroke: ['rgba(255,255,255,0)', 'rgb(102, 108, 194)'],
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
    presets: {
        [ButtonPresets.PRIMARY]: {
            normal: {
                fill: ["rgb(28, 25, 182)", "rgb(48, 0, 141)"],
                iconFill: "rgb(232, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgb(25, 22, 150)", "rgb(43, 6, 117)"],
                iconFill: "rgb(232, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgb(25, 22, 150)", "rgb(43, 6, 117)"],
                iconFill: "rgb(232, 217, 255)",
                outline: "2px solid rgb(35, 6, 94)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(28, 25, 182, .25)", "rgba(48, 0, 141, .25)"],
                iconFill: "rgb(232, 217, 255, .5)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [ButtonPresets.SECONDARY]: {
            normal: {
                fill: ["rgb(255, 255, 255)", "rgb(185, 210, 233)"],
                iconFill: "rgb(48, 44, 160)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgb(226, 239, 245)", "rgb(156, 184, 209)"],
                iconFill: "rgb(48, 44, 160)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgb(226, 239, 245)", "rgb(156, 184, 209)"],
                iconFill: "rgb(232, 217, 255)",
                outline: "2px solid rgb(136, 171, 202)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(255, 255, 255, .25)", "rgba(185, 210, 233, .25)"],
                iconFill: "rgb(35, 32, 122)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [ButtonPresets.THRID]: {
            normal: {
                fill: ["rgb(28, 25, 182)", "rgb(48, 0, 141)"],
                iconFill: "rgb(232, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgb(25, 22, 150)", "rgb(43, 6, 117)"],
                iconFill: "rgb(232, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgb(25, 22, 150)", "rgb(43, 6, 117)"],
                iconFill: "rgb(232, 217, 255)",
                outline: "2px solid rgb(35, 6, 94)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(28, 25, 182, .25)", "rgba(48, 0, 141, .25)"],
                iconFill: "rgb(232, 217, 255, .5)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [ButtonPresets.SUCCESS]: {
            normal: {
                fill: ["rgb(148, 213, 255)", "rgb(160, 217, 255)"],
                iconFill: "rgb(232, 217, 255)",
                color: "rgb(42, 79, 94)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgb(120, 189, 235)", "rgb(136, 197, 238)"],
                iconFill: "rgb(232, 217, 255)",
                color: "rgb(58, 102, 119)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgb(148, 213, 255)", "rgb(160, 217, 255)"],
                iconFill: "rgb(232, 217, 255)",
                outline: "2px solid rgb(162, 218, 255)",
                color: "rgb(42, 79, 94)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(148, 213, 255, .25)", "rgba(160, 217, 255, .25)"],
                iconFill: "rgb(232, 217, 255, .5)",
                color: "rgba(42, 79, 94, 0.45)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [ButtonPresets.CANCEL]: {
            normal: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(27, 27, 36)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.08)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(41, 41, 54)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(206, 191, 220)",
                outline: "2px solid rgb(162, 218, 255)",
                color: "rgb(27, 27, 36)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgba(206, 191, 220, 0.45)",
                color: "rgba(27, 27, 36, 0.45)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [ButtonPresets.WARN]: {
            normal: {
                fill: ["rgb(255, 238, 238)", "rgb(233, 185, 185)"],
                iconFill: "rgb(138, 101, 85)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgb(247, 215, 215)", "rgb(230, 175, 159)"],
                iconFill: "rgb(138, 101, 85)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgb(247, 215, 215)", "rgb(230, 175, 159)"],
                iconFill: "rgb(138, 101, 85)",
                outline: "2px solid rgb(231, 185, 163)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(247, 215, 215, .25)", "rgba(230, 175, 159, .25)"],
                iconFill: "rgb(167, 129, 113)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [DialogPresets.PRIMARY]: {
            fill: ["rgb(246, 250, 250)", "rgb(255, 255, 255)"],
            roundedCorner: DIALOG_ROUNDED_CORNER,
            padding: DIALOG_PADDING,
            strokeAnimationDuration: 10000,
            strokeGradientColor: ["rgba(148, 213, 255, 0)", "rgb(148, 213, 255)"],
            title: {
                fontSize: 14,
                textAlign: "left",
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: "rgb(27, 27, 36)",
            },
            message: {
                fontSize: 14,
                textAlign: "left",
                textTransform: 'none',
                color: "rgb(35, 35, 44)",
            },
        },
        [DialogPresets.SECONDARY]: {
            fill: ["rgb(49, 56, 73)", "rgb(45, 51, 66)"],
            roundedCorner: DIALOG_ROUNDED_CORNER,
            title: {
                fontSize: 13,
                textAlign: "center",
                textTransform: 'uppercase',
                color: "rgb(126, 191, 218)",
            },
            message: {
                fontSize: 12,
                textAlign: "center",
                textTransform: 'none',
                color: "rgb(203, 223, 223)",
            },
        },
    }
};

const THEME_LIGHT = objectAsReadonly(manifest);

export {
    THEME_LIGHT,
};
