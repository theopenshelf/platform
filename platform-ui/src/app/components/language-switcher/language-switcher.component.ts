import { NgForOf, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TUI_DOC_ICONS } from '@taiga-ui/addon-doc/tokens';
import { TuiButton } from '@taiga-ui/core/components/button';
import { TuiDataList } from '@taiga-ui/core/components/data-list';
import { tuiScrollbarOptionsProvider } from '@taiga-ui/core/components/scrollbar';
import { TuiTextfield } from '@taiga-ui/core/components/textfield';
import { TuiFlagPipe } from '@taiga-ui/core/pipes/flag';
import type { TuiCountryIsoCode, TuiLanguageName } from '@taiga-ui/i18n/types';
import { TuiLanguageSwitcherService } from '@taiga-ui/i18n/utils';
import { TuiBadge } from '@taiga-ui/kit/components/badge';
import { TuiBadgedContent } from '@taiga-ui/kit/components/badged-content';
import { TuiButtonSelect } from '@taiga-ui/kit/directives/button-select';

@Component({
  selector: 'language-switcher',
  imports: [
    NgForOf,
    ReactiveFormsModule,
    TitleCasePipe,
    TuiBadge,
    TuiBadgedContent,
    TuiButton,
    TuiButtonSelect,
    TuiDataList,
    TuiFlagPipe,
    TuiTextfield,
  ], templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
  providers: [tuiScrollbarOptionsProvider({ mode: 'hover' })],

})
export class LanguageSwitcherComponent {
  protected readonly icons = inject(TUI_DOC_ICONS);
  protected readonly switcher = inject(TuiLanguageSwitcherService);
  protected readonly language = new FormControl(capitalize(this.switcher.language));

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['fr', 'en']);
    this.translate.setDefaultLang(this.translate.defaultLang ?? 'en');
  }

  protected open = false;

  public readonly flags = new Map<TuiLanguageName, TuiCountryIsoCode>([
    ['english', 'GB'],
    ['french', 'FR'],
  ]);

  public readonly languageCodes = new Map<TuiLanguageName, string>([
    ['english', 'en'],
    ['french', 'fr'],
  ]);

  public readonly names: TuiLanguageName[] = Array.from(this.flags.keys());

  public setLang(lang: TuiLanguageName): void {
    this.language.setValue(lang);
    this.switcher.setLanguage(lang);
    this.open = false;
    this.translate.use(this.languageCodes.get(lang) ?? 'en');
  }
}

function capitalize(value: string): string {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
