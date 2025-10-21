import { RoundedCorner } from "../../types";
import { objectAsReadonly } from "./utils";
import { ITheme } from "./interfaces/theme";
import { ButtonPresets, ContextMenuPresets, DialogPresets } from "./presets";

const BUTTON_ROUNDED_CORNER: RoundedCorner = [8, 8, 8, 8],
    BUTTON_ROUNDED_RECT_PADDING = "4px 6px",
    CONTEXT_MENU_ROUNDED_CORNER: RoundedCorner = [12, 12, 12, 12],
    CONTEXT_MENU_PADDING = "8px 0px",
    DIALOG_ROUNDED_CORNER: RoundedCorner = [12, 12, 12, 12],
    DIALOG_PADDING = "36px 52px";

const manifest: ITheme = {
    chat: {
        header: {
            background: "rgb(10, 8, 17)",
            color: "rgb(181, 158, 202)",
            fontSize: "14px",
            menuButton: {
                normal: {
                    color: "none",
                    fill: ["rgba(0,0,0,0)", "rgba(0,0,0,0)"],
                    iconFill: "rgb(181, 158, 202)",
                },
                pressed: {
                    color: "none",
                    fill: ["rgba(0,0,0,0)", "rgba(0,0,0,0)"],
                    iconFill: "rgb(181, 158, 202)",
                },
                focused: {
                    color: "none",
                    fill: ["rgba(0,0,0,0)", "rgba(0,0,0,0)"],
                    iconFill: "rgb(212, 196, 228)",
                    outline: `2px solid rgba(212, 196, 228, 0.25)`,
                },
                disabled: {
                    color: "none",
                    fill: ["rgba(0,0,0,0)", "rgba(0,0,0,0)"],
                    iconFill: "rgba(212, 196, 228, 0.5)",
                },
            },
            search: {
                timeoutIndicatorColor: "rgba(255, 255, 255, 0.05)",
                normal: {
                    background: "rgb(9, 5, 19)",
                    borderColor: "rgb(34, 24, 51)",
                    color: "rgb(181, 158, 202)",
                    fontSize: "14px",
                    fill: "rgb(181, 158, 202)",
                    placeholder: {
                        color: "rgb(161, 138, 182)",
                        fontSize: "14px",
                    },
                },
                focused: {
                    background: "rgb(35, 15, 56)",
                    borderColor: "rgb(198, 244, 255)",
                    color: "rgb(181, 158, 202)",
                    fontSize: "14px",
                    fill: "rgb(181, 158, 202)",
                    placeholder: {
                        color: "rgb(161, 138, 182)",
                        fontSize: "14px",
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
                        background: "unset",
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
                    rippleColor: "rgba(255, 255, 255, 0.15)",
                    searchSubstringColor: "rgba(139, 0, 86, 0.84)",
                    editingTextBackground: "rgba(0, 0, 0, 0.1)",
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
                        fill: ["rgb(167, 87, 111)", "rgb(167, 87, 111)"],
                        color: "rgb(206, 191, 220)",
                    },
                    removalSelected: {
                        fill: ["rgb(167, 87, 111)", "rgb(167, 87, 111)"],
                        color: "rgb(206, 191, 220)",
                    }
                },
                controls: {
                    menu: {
                        normal: {
                            fill: ["rgb(56, 43, 179)", "rgb(82, 32, 126)"],
                            iconFill: "rgb(206, 191, 220)",
                            strokeGradientColor: ['rgba(255,255,255,0)', 'rgb(255, 255, 255)'],
                        },
                        pressed: {
                            fill: ["rgb(87, 74, 204)", "rgb(106, 55, 151)"],
                            iconFill: "rgb(206, 191, 220)",
                            strokeGradientColor: ['rgba(255,255,255,0)', 'rgb(255, 255, 255)'],
                        },
                        disabled: {
                            fill: ["rgba(56, 43, 179, .25)", "rgba(82, 32, 126, .25)"],
                            iconFill: "rgb(206, 191, 220)",
                            strokeGradientColor: ['rgba(255,255,255,0)', 'rgb(255, 255, 255)'],
                        },
                    },
                    cancel: {
                        normal: {
                            fill: ["rgb(86, 22, 190)", "rgb(104, 0, 136)"],
                            iconFill: "rgb(206, 191, 220)",
                            strokeGradientColor: ['rgba(255,255,255,0)', 'rgb(255, 255, 255)'],
                        },
                        pressed: {
                            fill: ["rgb(68, 20, 146)", "rgb(89, 6, 114)"],
                            iconFill: "rgb(206, 191, 220)",
                            strokeGradientColor: ['rgba(255,255,255,0)', 'rgb(255, 255, 255)'],
                        },
                        disabled: {
                            fill: ["rgba(86, 22, 190, .25)", "rgba(104, 0, 136, .25)"],
                            iconFill: "rgb(206, 191, 220)",
                            strokeGradientColor: ['rgba(255,255,255,0)', 'rgb(255, 255, 255)'],
                        },
                    },
                    send: {
                        normal: {
                            fill: ["rgb(86, 22, 190)", "rgb(104, 0, 136)"],
                            iconFill: "rgb(206, 191, 220)",
                            strokeGradientColor: ['rgba(186, 250, 255, 0)', 'rgb(183, 235, 255)'],
                        },
                        pressed: {
                            fill: ["rgb(68, 20, 146)", "rgb(89, 6, 114)"],
                            iconFill: "rgb(206, 191, 220)",
                            strokeGradientColor: ['rgba(186, 250, 255, 0)', 'rgb(183, 235, 255)'],
                        },
                        disabled: {
                            fill: ["rgba(86, 22, 190, .25)", "rgba(104, 0, 136, .25)"],
                            iconFill: "rgb(206, 191, 220)",
                            strokeGradientColor: ['rgba(186, 250, 255, 0)', 'rgb(183, 235, 255)'],
                        },
                    },
                },
                styles: {
                    processing: {
                        stroke: ["rgba(255,255,255,0)", "rgb(219, 156, 255)"],
                    },
                    removing: {
                        stroke: ["rgba(0,188,212,0)", "rgb(255, 192, 205)"],
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
                fill: ["rgb(86, 22, 190)", "rgb(104, 0, 136)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgb(68, 20, 146)", "rgb(89, 6, 114)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgb(86, 22, 190)", "rgb(104, 0, 136)"],
                iconFill: "rgb(206, 191, 220)",
                outline: "2px solid rgba(227, 134, 255, 0.25)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(86, 22, 190, .25)", "rgba(104, 0, 136, .25)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(240, 217, 255)",
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
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                outline: "2px solid rgb(136, 171, 202)",
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
            rippleColor: "rgba(255, 255, 255, 0.2)",
            normal: {
                fill: ["rgb(67, 19, 145)", "rgb(72, 22, 153)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgb(101, 37, 204)", "rgb(99, 34, 204)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgb(67, 19, 145)", "rgb(72, 22, 153)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(67, 19, 145, .25)", "rgba(72, 22, 153, .25)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [ButtonPresets.CANCEL]: {
            rippleColor: "rgba(255, 255, 255, 0.1)",
            normal: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(199, 186, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.08)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(160, 147, 218)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(199, 186, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgba(206, 191, 220, 0.45)",
                color: "rgba(199, 186, 255, 0.45)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [ButtonPresets.WARN]: {
            normal: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(255, 122, 120)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.08)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(223, 91, 164)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(206, 191, 220)",
                outline: "2px solid rgba(227, 134, 255, 0.25)",
                color: "rgb(255, 122, 195)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgba(206, 191, 220, 0.45)",
                color: "rgba(255, 122, 195, 0.45)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [ButtonPresets.CONTEXT_MENU_PRIMARY]: {
            rippleColor: "rgba(255, 255, 255, 0.1)",
            normal: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(199, 186, 255)",
                color: "rgb(199, 186, 255)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.08)"],
                iconFill: "rgb(229, 223, 255)",
                color: "rgb(229, 223, 255)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(229, 223, 255)",
                color: "rgb(229, 223, 255)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgba(199, 186, 255, 0.45)",
                color: "rgba(199, 186, 255, 0.45)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [ButtonPresets.CONTEXT_MENU_SECONDARY]: {
            rippleColor: "rgba(255, 255, 255, 0.1)",
            normal: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(199, 186, 255)",
                color: "rgb(199, 186, 255)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.08)"],
                iconFill: "rgb(229, 223, 255)",
                color: "rgb(229, 223, 255)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(229, 223, 255)",
                color: "rgb(229, 223, 255)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgba(199, 186, 255, 0.45)",
                color: "rgba(199, 186, 255, 0.45)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [DialogPresets.PRIMARY]: {
            fill: ["rgb(59, 44, 99)", "rgb(59, 44, 99)"],
            roundedCorner: DIALOG_ROUNDED_CORNER,
            padding: DIALOG_PADDING,
            strokeAnimationDuration: 10000,
            strokeGradientColor: ["rgba(0, 71, 151, 0)", "rgb(255, 122, 162)"],
            title: {
                fontSize: 14,
                textAlign: "left",
                fontWeight: "bold",
                textTransform: "uppercase",
                color: "rgb(199, 186, 255)",
            },
            message: {
                fontSize: 14,
                textAlign: "left",
                textTransform: "none",
                color: "rgb(199, 186, 255)",
            },
        },
        [DialogPresets.SECONDARY]: {
            fill: ["rgb(59, 44, 99)", "rgb(59, 44, 99)"],
            roundedCorner: DIALOG_ROUNDED_CORNER,
            padding: DIALOG_PADDING,
            strokeAnimationDuration: 10000,
            title: {
                fontSize: 12,
                textAlign: "left",
                textTransform: "uppercase",
                color: "rgb(126, 191, 218)",
            },
            message: {
                fontSize: 12,
                textAlign: "left",
                textTransform: "none",
                color: "rgb(203, 223, 223)",
            },
        },
        [ContextMenuPresets.PRIMARY]: {
            fill: ["rgb(59, 44, 99)", "rgb(59, 44, 99)"],
            roundedCorner: CONTEXT_MENU_ROUNDED_CORNER,
            padding: CONTEXT_MENU_PADDING,
            strokeAnimationDuration: 10000,
            strokeGradientColor: ["rgba(0, 71, 151, 0)", "rgb(7, 247, 255)"],
            buttonPreset: ButtonPresets.CONTEXT_MENU_PRIMARY,
        },
        [ContextMenuPresets.SECONDARY]: {
            fill: ["rgb(59, 44, 99)", "rgb(59, 44, 99)"],
            roundedCorner: CONTEXT_MENU_ROUNDED_CORNER,
            padding: CONTEXT_MENU_PADDING,
            strokeAnimationDuration: 10000,
            strokeGradientColor: ["rgba(0, 71, 151, 0)", "rgb(255, 122, 162)"],
            buttonPreset: ButtonPresets.CONTEXT_MENU_SECONDARY,
        },
    }
};

const THEME_DARK = objectAsReadonly(manifest);

export {
    THEME_DARK,
};
