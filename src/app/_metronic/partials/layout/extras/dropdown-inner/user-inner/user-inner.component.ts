import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from '../../../../../../modules/i18n';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  language: LanguageFlag;
  langs = languages;
  private unsubscribe: Subscription[] = [];
  user: UserModel;
  userType: string = '';

  constructor(
    private router: Router,
    private translationService: TranslationService,
    private authService: AuthService
  ) {
    this.user = this.authService.getcurrentUserValue();
    if (this.user.roleId == 1) {
      this.userType = 'Buyer';
    } else if (this.user.roleId == 2) {
      this.userType = 'Seller';
    }
    else if (this.user.roleId == 10) {
      this.userType = 'Admin';
    }
  }

  ngOnInit(): void {
    this.setLanguage(this.translationService.getSelectedLanguage());
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    // document.location.reload();
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'en',
    name: 'English',
    flag: './assets/media/flags/united-states.svg',
  },
  // {
  //   lang: 'zh',
  //   name: 'Mandarin',
  //   flag: './assets/media/flags/china.svg',
  // },
  // {
  //   lang: 'es',
  //   name: 'Spanish',
  //   flag: './assets/media/flags/spain.svg',
  // },
  // {
  //   lang: 'ja',
  //   name: 'Japanese',
  //   flag: './assets/media/flags/japan.svg',
  // },
  // {
  //   lang: 'de',
  //   name: 'German',
  //   flag: './assets/media/flags/germany.svg',
  // },
  {
    lang: 'fr',
    name: 'French',
    flag: './assets/media/flags/france.svg',
  },
];
