import { InjectionToken } from "@angular/core";
import { IMediaConfig } from "../interfaces";

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com).
 */
export const MEDIA_CONFIG = new InjectionToken<IMediaConfig>('media.config');
