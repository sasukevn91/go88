(function () {

    var Extend = function (ns) {

        return Pt.Extensions[ns] || {};

    };

    _.Class('Pt.Core.Extend', Extend);

})();
/**
 * @namespace Pt.Core
 *
 * BindTrait
 * Created by isda on 13/12/2016.
 */

(function () {

    'use strict';

    /**
     * @namespace Pt.Core.BindTrait
     * @property render
     * @property _bindEvents
     */
    var BindTrait = {

        render: function (container, markup, options) {

            if (! _.isEmpty(markup)) {

                if(_.has(options,'behavior'))
                {

                    switch (options.behavior){

                        case 'append': $(container).append(markup); break;

                        default: $(container).html(markup); break;

                    }

                }else
                {
                    $(container).html(markup);

                }

            }

            if (arguments[2] && typeof arguments[2] === 'function') {

                arguments[2]();

            }

            EventBroker.dispatch(EventBroker.events.domChanged, { 
                container: container,
                markup: markup 
            });

            return this;

        },

        /**
         * Render Component
         */
        renderComponent: function (name, markup) {


            if (! _.isEmpty(markup)) {

                $(name).replaceWith(markup);

            }

            if (arguments[2] && typeof arguments[2] === 'function') {

                arguments[2]();

            }

            return this;

        },

        /**
         * Bind all events
         * @private
         */
        _bindEvents: function () {

            var self = this;

            if (! _.isEmpty(this.actions)) {

                _.each(this.actions, function (action) {

                    if (_.indexOf([ 'scroll', 'submit', 'unload', 'hashchange', 'play' ], action[ 1 ]) !== - 1) {

                        $(action[ 0 ])
                            .off(action[ 1 ], self[ action[ 2 ] ])
                            .on(action[ 1 ], { "context": self }, self[ action[ 2 ] ]);

                    } else {

                        $('body')
                            .off(action[ 1 ], action[ 0 ], self[ action[ 2 ] ])
                            .on(action[ 1 ], action[ 0 ], { "context": self }, self[ action[ 2 ] ]);

                    }

                });

            }

            return this;

        },

        _destroyEvents: function () {

            var self = this;

            if (! _.isEmpty(this.actions)) {

                _.each(this.actions, function (action) {

                    if (_.indexOf([ 'scroll', 'submit' ], action[ 1 ]) !== - 1) {

                        $(action[ 0 ])
                            .off(action[ 1 ], self[ action[ 2 ] ]);

                    } else {

                        $('body')
                            .off(action[ 1 ], action[ 0 ], self[ action[ 2 ] ]);

                    }

                });

            }

            return this;

        }

    };

    _.Class('Pt.Core.BindTrait', BindTrait);

})();
/**
 * Routing Manager
 * Created by isda on 12/07/2016.
 */

/** @namespace Pt.Core.Router */

(function ($router) {

    "use strict";

    var routeContext = null;

    _.Class('Pt.Core.Router', new Router());

    /**
     * Router Manager
     * @constructor
     */
    function Router() {

        var instances = {};

        return {
            add: add,
            redirect: redirect,
            navigate: navigate,
            getContext: getContext,
            setContext: setContext
        };

        //////////////////////////

        function add(routes) {

            if (! _.isArray(routes)) {

                return;

            }

            _.each(routes, function (item) {

                var c = _getController(item.controller);

                try {
                
                    instances[item.controller] = instances[item.controller] || new c.controller();

                    if (! _.isEmpty(item.middleware)) {

                        instances[item.controller]['middleware'] = item.middleware;
                    }
                    
                    $router(item.route,
                        _.bind(instances[item.controller]['activate'], instances[item.controller]),
                        _.bind(instances[item.controller][c.method], instances[item.controller]));

                } catch(e) {}

            });

            $router();

        }

        function _getController(c) {

            if (typeof c === 'string') {

                var part = c.split('@');
                var cPart = part[0].split('.');
                var controller = window.Pt || {};

                for (var i = 1; i < cPart.length; i ++) {

                    controller = controller[cPart[i]];

                }

                return {
                    controller: controller,
                    method: part[1]
                };

            }

        }

        function redirect(url) {

            $router(url);

        }

        function navigate(url) {

            $router(url);
            EventBroker.dispatch(EventBroker.events.navigate, url);

        }

        function getContext() {

            return routeContext;

        }

        function setContext(context) {

            routeContext = context;

        }

    }

})(
    window.page
);
/**
 * PrometheusFrontend
 * Created by isda on 13/12/2016.
 */


(function (
    Settings
) {

    'use strict';

    window.prom_template_version = '1583812698276';
    window.prom_debug = ':debug:';


    var tokenKey = {
        AffiliateSite: 'aff_token',
        MemberSite: 'pt_token'

    };

    var Config = {
        datePickerLocale: {
            id: 'datepickerIdLocale',
            ja: 'datepickerJaLocale',
            km: 'datepickerKmLocale',
            ko: 'datepickerKoLocale',
            th: 'datepickerThLocale',
            vi: 'datepickerViLocale',
            'zh-hans': 'datepickerZhLocale'
        },
        tokenKey: tokenKey[Settings.site],
        msSessionKey: 's',
        msSportsSessionKey: 'g',
        funds: {
            bankingDetails:  [ 'regular', 'alipay', 'qq', 'wechat'],
            currency_bankingDetails:{
                'VND': 'momo'
            }
        },

        wallets: {
            currency: {
                wallet_16: 'RMB'
            }
        },

        moduleMap: {
            'funds': 'Funds',
            'profile': 'Profile'
        },

        languages: {
            'en': {
                label: _.trans('global.label_language_en'),
                key: 'en',
                locale: 'en'
            },
            'zh-hans': {
                label: _.trans('global.label_language_zh-hans'),
                key: 'zh-hans',
                locale: 'zh-cn'
            },
            'ko': {
                label: _.trans('global.label_language_ko'),
                key: 'ko',
                locale: 'ko'
            },
            'th': {
                label: _.trans('global.label_language_th'),
                key: 'th',
                locale: 'th'
            },
            'id': {
                label: _.trans('global.label_language_id'),
                key: 'id',
                locale: 'id'
            },
            'ja': {
                label: _.trans('global.label_language_ja'),
                key: 'ja',
                locale: 'ja'
            },
            'vi': {
                label: _.trans('global.label_language_vi'),
                key: 'vi',
                locale: 'vi'
            },
            'km': {
                label: _.trans('global.label_language_km'),
                key: 'km',
                locale: 'km'
            }
        },

        games: {
            slots: {
                listLimit: 21,
                clubs: {
                    ctxm: 'ctxm',
                    ttg: 'ttg',
                    gpi: 'gpi',
                    mgs: 'mgs',
                    png: 'png',
                    pt: 'pt',
                    isoftbet: 'isoftbet',
                    gspot: 'gspot',
                    betsoft: 'betsoft',
                    qtech: 'qtech',
                    uc8: 'uc8',
                    pplay: 'pplay'
                },
                fields: 'categories,clubs,gameId,gameLinks,image,tags,title,exclusionList'
            }
        },

        announcements: {
            cat_id_0: 'all',
            cat_id_1: 'general',
            cat_id_2: 'promotions',
            cat_id_3: 'maintenance',
            cat_id_4: 'payments',
            cat_id_9: 'deposit',
            cat_id_10: 'fund_transfer',
            cat_id_11: 'withdrawal',
            cat_id_12: 'pre_normal',
            cat_id_13: 'pre_vip'
        },

        affiliate: {
            trackLink: ':protocol://:domain/tracker/:affiliateId'
        },

        depositErrorPage: '/error/deposit/',

        urls: {
            assets: '/assets/',
            templates: '/assets/templates/'
        },

        slickOptions: {
            dots: true,
            autoplay: true,
            fade: true,
            cssEase: 'linear',
            pauseOnHover: true,
			pauseOnFocus: false,
            autoplaySpeed: parseInt(Settings.banner_interval, 10)
        },

        walletCurrencies: [
            {
                id: 16,
                currency: 'RMB'
            }
        ],

        depositChannels: {
            ATM: true,
            iBanking: true,
            mBanking: true,
            cBanking: false,
            CDM: false
        },

        browserKeywords:  {
            metasr: 'sogou',
            ucb: 'ucbrowser',
            ubrowser: 'ucbrowser',
            qqb: 'qqbrowser',
            qqbrowser: 'qqbrowser',
            lbbrowser: 'cheetah',
            firefox: 'firefox'
        },

        cacheKeys: {
            httpclient: 'httpclient'
        }
    };

    /**
     * @namespace Pt.Config
     */
    _.extend(Config, Pt.Core.Extend('Config'));

    _.Class('Pt.Config', Config);

})(
    Pt.Settings
);

/**
 * Validation Rules
 * Created by isda on 13/12/2016.
 */

 (function (moment) {

    'use strict';

    var Rules = {

        validation: {

            /**********************
             * LOGIN RULES
             **********************/
            login: {

                username: {
                    presence: {
                        message: "^" + _.trans('errors.username_required')
                    },
                    length: {
                        minimum: 6,
                        maximum: 16,
                        tooShort: "^" + _.trans('errors.username_min'),
                        tooLong: "^" + _.trans('errors.username_max')
                    }
                },

                password: {
                    presence: {
                        message: "^" + _.trans('errors.password_required')
                    },
                    length: {
                        minimum: 6,
                        maximum: 20,
                        tooShort: "^" + _.trans('errors.password_min'),
                        tooLong: "^" + _.trans('errors.password_max')
                    }
                }
            },

            forgotLogin: {

                memberCode: {
                    presence: {
                        message: "^" + _.trans('errors.memberCode_required')
                    }
                },

                email: {
                    presence: {
                        message: "^" + _.trans('errors.email_required')
                    },
                    email: {
                        message: "^" + _.trans('errors.email_invalid')
                    }
                }
            },

            signup: {
                email: {
                    presence: {
                        message: "^" + _.trans('errors.email_required')
                    },
                    email: {
                        message: "^" + _.trans('errors.email_invalid')
                    }
                },

                mobile: {
                    presence: {
                        message: "^" + _.trans('errors.contact_required')
                    },
                    length: {
                        minimum: 6,
                        tooShort: "^" + _.trans('errors.mobile_min'),
                    },
                    numericality: {
                        message: "^" + _.trans('errors.contact_invalid_format')
                    },
                    format: {
                        pattern: /^(?!0+$)[0-9]{2,}$/,
                        message: "^" + _.trans('errors.contact_invalid_format')
                    }
                },

                currencyCode: {
                    presence: {
                        message: "^" + _.trans('errors.currency_required')
                    }
                },

                memberCode: {
                    presence: {
                        message: "^" + _.trans('errors.username_required')
                    },
                    length: {
                        minimum: 6,
                        maximum: 16,
                        tooShort: "^" + _.trans('errors.username_min'),
                        tooLong: "^" + _.trans('errors.username_max')
                    },
                    format: {
                        pattern: "[A-Za-z0-9]+",
                        message: "^" + _.trans('errors.username_format')
                    }
                },

                password: {
                    presence: {
                        message: "^" + _.trans('errors.password_required')
                    },

                    length: {
                        minimum: 6,
                        maximum: 20,
                        tooShort: "^" + _.trans('errors.password_min'),
                        tooLong: "^" + _.trans('errors.password_max')
                    }
                },

                confirmPassword: {
                    presence: {
                        message: "^" + _.trans('errors.password_required')
                    },
                    equality: {
                        attribute: "password",
                        message: "^" + _.trans('errors.password_not_match')
                    }
                },

                dob: {
                    presence: {
                        message: "^" + _.trans('errors.dob_required')
                    },

                    datetime: {
                        dateOnly: true,
                        latest: moment.utc().subtract(18, 'years'),
                        message: "^" + _.trans('errors.age_min')
                    }
                },

                firstName: {
                    format: {
                        pattern: /^[^~@#$%^&*()+={}[\]:;"'<>/|?!\\`//~,×÷€£¥₩¢°•○●□■♤♡◇♧☆▪¤《》¡¿√π¶∆©®™✓]+/,
                        message: "^" + _.trans('errors.invalid_format')
                    },

                    length: {
                        minimum: 1,
                        tooShort: "^" + _.trans('errors.name_required')
                    },

                    notnumeric: {
                        message: "^" + _.trans('errors.name_not_all_numeric')
                    },

                    presence: {
                        message: "^" + _.trans('errors.name_required')
                    }
                },

                acceptTerms: {
                    presence: {
                        message: "^" + _.trans('errors.terms_required')
                    }
                }
            },

            fastRegistration: {
                mobile: {
                    presence: {
                        message: "^" + _.trans('errors.contact_required')
                    },
                    numericality: {
                        message: "^" + _.trans('errors.contact_invalid_format')
                    }
                },

                currencyCode: {
                    presence: {
                        message: "^" + _.trans('errors.currency_required')
                    }
                },

                memberCode: {
                    presence: {
                        message: "^" + _.trans('errors.username_required')
                    },
                    length: {
                        minimum: 6,
                        maximum: 16,
                        tooShort: "^" + _.trans('errors.username_min'),
                        tooLong: "^" + _.trans('errors.username_max')
                    },
                    format: {
                        pattern: "[A-Za-z0-9]+",
                        message: "^" + _.trans('errors.username_format')
                    }
                },

                password: {
                    presence: {
                        message: "^" + _.trans('errors.password_required')
                    },

                    length: {
                        minimum: 6,
                        maximum: 20,
                        tooShort: "^" + _.trans('errors.password_min'),
                        tooLong: "^" + _.trans('errors.password_max')
                    }
                },

                confirmPassword: {
                    presence: {
                        message: "^" + _.trans('errors.password_required')
                    },
                    equality: {
                        attribute: "password",
                        message: "^" + _.trans('errors.password_not_match')
                    }
                },

                acceptTerms: {
                    presence: {
                        message: "^" + _.trans('errors.terms_required')
                    }
                }
            },

            fastRegistrationLastStep: {
                email: {
                    presence: {
                        message: "^" + _.trans('errors.email_required')
                    },
                    email: {
                        message: "^" + _.trans('errors.email_invalid')
                    }
                },
                dob: {
                    presence: {
                        message: "^" + _.trans('errors.dob_required')
                    },

                    datetime: {
                        dateOnly: true,
                        latest: moment.utc().subtract(18, 'years'),
                        message: "^" + _.trans('errors.age_min')
                    }
                },
                name: {
                    length: {
                        minimum: 1,
                        tooShort: "^" + _.trans('errors.name_required')
                    },

                    presence: {
                        message: "^" + _.trans('errors.name_required')
                    },

                    notnumeric: {
                        message: "^" + _.trans('errors.name_not_all_numeric')
                    },

                    format: {
                        pattern:/^[^~@#$%^&*()_+={}[\]:;"'<>/|?!-.,\\`//]+/,
                        message: "^" + _.trans('errors.invalid_format')
                    }
                },

                bankCode: {
                    presence: {
                        message: "^" + _.trans('errors.bankCode_required')
                    }
                },

                bankNameNative: {
                    presence: {
                        message: "^" + _.trans('errors.bankName_required')
                    },
                    length: {
                        maximum: 100,
                        tooLong: "^" + _.trans('errors.max_bankName')
                    }
                },

                bankAccountNumber: {
                    format: {
                        pattern: /^\w+$/,
                        message: "^" + _.trans('errors.invalid_format')
                    },
                    presence: {
                        message: "^" + _.trans('errors.accountNumber_required')
                    },
                    length: {
                        maximum: 50,
                        tooLong: "^" + _.trans('errors.max_accountNumber')
                    }
                },

                bankProvince: {
                    presence: {
                        message: "^" + _.trans('errors.bankProvince_required')
                    }
                },

                bankCity: {
                    presence: {
                        message: "^" + _.trans('errors.bankCity_required')
                    },
                    length: {
                        maximum: 50,
                        tooLong: "^" + _.trans('errors.max_city')
                    }
                },

                bankDistrict: {
                    presence: {
                        message: "^" + _.trans('errors.bankDistrict_required')
                    }
                },

                bankBranch: {
                    format: {
                        //allowed characters - , . :; ' & / . ( )° #
                        pattern:/^[^~@$%^*_+={}[\]"<>|?!\\`]+/,
                        message: "^" + _.trans('errors.invalid_format')
                    },
                    presence: {
                        message: "^" + _.trans('errors.branchName_required')
                    }
                },

                bankAddress: {
                    format: {
                        //allowed characters - , . :; ' & / . ( )° #
                        pattern:/^[^~@$%^*_+={}[\]"<>|?!\\`]+/,
                        message: "^" + _.trans('errors.invalid_format')
                    },
                    presence: {
                        message: "^" + _.trans('errors.bankAddress_required')
                    },
                    length: {
                        maximum: 500,
                        tooLong: "^" + _.trans('errors.max_address')
                    }
                }
            },

            bankDetailRegistration: {
                bankCode: {
                    presence: {
                        message: "^" + _.trans('errors.bankCode_required')
                    }
                },

                bankNameNative: {
                    presence: {
                        message: "^" + _.trans('errors.bankName_required')
                    },
                    length: {
                        maximum: 100,
                        tooLong: "^" + _.trans('errors.max_bankName')
                    }
                },

                bankAccountNumber: {
                    format: {
                        pattern: /^\w+$/,
                        message: "^" + _.trans('errors.invalid_format')
                    },
                    presence: {
                        message: "^" + _.trans('errors.accountNumber_required')
                    },
                    length: {
                        maximum: 50,
                        tooLong: "^" + _.trans('errors.max_accountNumber')
                    }
                },

                bankProvince: {
                    presence: {
                        message: "^" + _.trans('errors.bankProvince_required')
                    }
                },

                bankCity: {
                    presence: {
                        message: "^" + _.trans('errors.bankCity_required')
                    },
                    length: {
                        maximum: 50,
                        tooLong: "^" + _.trans('errors.max_city')
                    }
                },

                bankDistrict: {
                    presence: {
                        message: "^" + _.trans('errors.bankDistrict_required')
                    }
                },

                bankBranch: {
                    format: {
                        //allowed characters - , . :; ' & / . ( )° #
                        pattern:/^[^~@$%^*_+={}[\]"<>|?!\\`]+/,
                        message: "^" + _.trans('errors.invalid_format')
                    },
                    presence: {
                        message: "^" + _.trans('errors.branchName_required')
                    }
                },

                bankAddress: {
                    format: {
                        //allowed characters - , . :; ' & / . ( )° #
                        pattern:/^[^~@$%^*_+={}[\]"<>|?!\\`]+/,
                        message: "^" + _.trans('errors.invalid_format')
                    },
                    presence: {
                        message: "^" + _.trans('errors.bankAddress_required')
                    },
                    length: {
                        maximum: 500,
                        tooLong: "^" + _.trans('errors.max_address')
                    }
                }
			},

            member: {
                gender: {
                    presence: {
                        message: "^" + _.trans('errors.gender_required')
                    }
                },

                securityQuestion: {
                    presence: {
                        message: "^" + _.trans('errors.securityQuestion_required')
                    }
                },

                securityAnswer: {
                    presence: {
                        message: "^" + _.trans('errors.securityAnswer_required')
                    }
                },

                verifyPassword: {
                    presence: {
                        message: "^" + _.trans('errors.password_verify')
                    }
                },

                oddsType: {
                    presence: {
                        message: "^" + _.trans('errors.odds_required')
                    }
                },

                languageCode: {
                    presence: {
                        message: "^" + _.trans('errors.language_required')
                    }
                }
            },

            verification : {
                verificationCode : {
                    presence: {
                        message: "^" + _.trans('errors.verification_code_required')
                    }
                }
            },

            updatePassword: {

                currentPassword: {
                    presence: {
                        message: "^" + _.trans('errors.currentPassword_required')
                    },

                    length: {
                        minimum: 6,
                        maximum: 20,
                        tooShort: "^" + _.trans('errors.currentPassword_min'),
                        tooLong: "^" + _.trans('errors.currentPassword_max')
                    }
                },

                newPassword: {
                    presence: {
                        message: "^" + _.trans('errors.newPassword_required')
                    },

                    length: {
                        minimum: 6,
                        maximum: 20,
                        tooShort: "^" + _.trans('errors.newPassword_min'),
                        tooLong: "^" + _.trans('errors.newPassword_max')
                    }
                },

                confirmPassword: {
                    presence: {
                        message: "^" + _.trans('errors.confirm_password_required')
                    },

                    equality: {
                        attribute: "newPassword",
                        message: "^" + _.trans('errors.password_not_match')
                    }
                }
            },

            deliveryAddress: {
                address: {
                    addressFormat: {
                        message: "^" + _.trans('errors.invalid_format')
                    },
                    presence: {
                        message: "^" + _.trans('errors.address_required')
                    },
                    length: {
                        maximum: 500,
                        tooLong: "^" + _.trans('errors.max_address')
                    }
                },

                city: {
                    addressFormat: {
                        message: "^" + _.trans('errors.invalid_format')
                    },
                    presence: {
                        message: "^" + _.trans('errors.city_required')
                    },
                    length: {
                        maximum: 50,
                        tooLong: "^" + _.trans('errors.max_city')
                    }
                },

                postal: {
                    format: {
                        pattern:/^\d+$/,
                        message: "^" + _.trans('errors.invalid_format')
                    },
                    presence: {
                        message: "^" + _.trans('errors.postal_required')
                    },
                    length: {
                        maximum: 20,
                        tooLong: "^" + _.trans('errors.max_postal')
                    }
                }
            },

            bankDetail: {
                bankCode: {
                    presence: {
                        message: "^" + _.trans('errors.bankCode_required')
                    }
                },

                bankNameNative: {
                    presence: {
                        message: "^" + _.trans('errors.bankName_required')
                    },
                    length: {
                        maximum: 100,
                        tooLong: "^" + _.trans('errors.max_bankName')
                    }
                },

                bankAccountName: {
                    presence: {
                        message: "^" + _.trans('errors.accountName_required')
                    },
                    length: {
                        maximum: 100,
                        tooLong: "^" + _.trans('errors.max_accountName')
                    }
                },

                bankBranch: {
                    presence: {
                        message: "^" + _.trans('errors.branchName_required')
                    },
                    addressFormat: {
                        message: "^" + _.trans('errors.invalid_format')
                    }
                },

                bankAddress: {
                    presence: {
                        message: "^" + _.trans('errors.bankAddress_required')
                    },
                    addressFormat: {
                        message: "^" + _.trans('errors.invalid_format')
                    },
                    length: {
                        maximum: 500,
                        tooLong: "^" + _.trans('errors.max_address')
                    }
                },

                bankAccountNumber: {
                    format: {
                        pattern: /^\w+$/,
                        message: "^" + _.trans('errors.invalid_format')
                    },
                    presence: {
                        message: "^" + _.trans('errors.accountNumber_required')
                    },
                    length: {
                        maximum: 50,
                        tooLong: "^" + _.trans('errors.max_accountNumber')
                    }
                },

                bankProvince: {
                    presence: {
                        message: "^" + _.trans('errors.bankProvince_required')
                    }
                },

                bankCity: {
                    presence: {
                        message: "^" + _.trans('errors.bankCity_required')
                    },
                    length: {
                        maximum: 50,
                        tooLong: "^" + _.trans('errors.max_city')
                    }
                },

                bankDistrict: {
                    presence: {
                        message: "^" + _.trans('errors.bankDistrict_required')
                    }
                }
            },

            bankingDetail: {
                bankCode: {
                    presence: {
                        message: "^" + _.trans('errors.bankCode_required')
                    }
                },

                bankNameNative: {
                    presence: {
                        message: "^" + _.trans('errors.bankName_required')
                    },
                    length: {
                        maximum: 100,
                        tooLong: "^" + _.trans('errors.max_bankName')
                    }
                },
                bankAccountName: {
                    presence: {
                        message: "^" + _.trans('errors.accountName_required')
                    },
                    length: {
                        maximum: 100,
                        tooLong: "^" + _.trans('errors.max_accountName')
                    }
                },

                bankBranch: {
                    presence: {
                        message: "^" + _.trans('errors.branchName_required')
                    },
                    addressFormat: {
                        message: "^" + _.trans('errors.invalid_format')
                    }
                },

                bankAddress: {
                    presence: {
                        message: "^" + _.trans('errors.bankAddress_required')
                    },
                    addressFormat: {
                        message: "^" + _.trans('errors.invalid_format')
                    },
                    length: {
                        maximum: 500,
                        tooLong: "^" + _.trans('errors.max_address')
                    }
                },

                bankAccountNumber: {
                    format: {
                        pattern: /^\w+$/,
                        message: "^" + _.trans('errors.invalid_format')
                    },
                    presence: {
                        message: "^" + _.trans('errors.accountNumber_required')
                    },
                    length: {
                        maximum: 50,
                        tooLong: "^" + _.trans('errors.max_accountNumber')
                    }
                }
            },

            bankDetailIrregular: {
                bankAccountNumber: {
                    format: {
                        pattern: /^\w+$/,
                        message: "^" + _.trans('errors.invalid_format')
                    },
                    presence: {
                        message: "^" + _.trans('errors.accountNumber_required')
                    },
                    length: {
                        maximum: 50,
                        tooLong: "^" + _.trans('errors.max_accountNumber')
                    }
                }
            },

            bankDetailMPay: {
                phoneNumber: {
                    presence: {
                        message: "^" + _.trans('errors.phoneNumber_required')
                    },
                    format: {
                        pattern: /0[0-9]{9}/,
                        message: "^" + _.trans('errors.mPay_phoneNumber_format')
                    }
                }
            },

            promotionClaim: {
                comment: {
                    presence: {
                        message: "^" + _.trans('errors.comment_required')
                    }
                }
            },
            welcomeBonusClaim: {
                comment: {
                    presence: {
                        message: "^" + _.trans('errors.comment_required')
                    }
                }
            },

            selfExclusionSettings : {
                startDate: {
                    presence: {
                        message: "^" + _.trans('errors.validFrom_required')
                    },

                    datetime: {
                        dateOnly: true,
                        message: "^" + _.trans('errors.validFrom_not_date')
                    }
                },

                endDate: {
                    presence: {
                        message: "^" + _.trans('errors.validTo_required')
                    },

                    datetime: {
                        dateOnly: true,
                        message: "^" + _.trans('errors.validTo_not_date')
                    }
                }
            },

            paymentSettings: {
                transType: {
                    presence: {
                        message: "^" + _.trans('errors.transType_required')
                    }
                },
                limitAmount: {
                    presence: {
                        message: "^" + _.trans('errors.limitAmount_required')
                    },

                    numericality: {
                        onlyInteger: true,
                        notInteger: "^" + _.trans('errors.limitAmount_not_int')
                    }
                },

                frequency: {
                    presence: {
                        message: "^" + _.trans('errors.frequency_required')
                    }
                },

                validFrom: {
                    presence: {
                        message: "^" + _.trans('errors.validFrom_required')
                    },

                    datetime: {
                        dateOnly: true,
                        message: "^" + _.trans('errors.validFrom_not_date')
                    }
                },

                validTo: {
                    presence: {
                        message: "^" + _.trans('errors.validTo_required')
                    },

                    datetime: {
                        dateOnly: true,
                        message: "^" + _.trans('errors.validTo_not_date')
                    }
                }
            },

            /******************
             *  Fund Management
             ******************/
            fundTransfer: {
                transferFrom: {
                    presence: {
                        message: "^" + _.trans('errors.transferFrom_required')
                    }
                },
                transferTo: {
                    presence: {
                        message: "^" + _.trans('errors.transferTo_required')
                    }
                },
                transferAmount: {
                    presence: {
                        message: "^" + _.trans('errors.transferAmount_required')
                    },
                    numericality: {
                        greaterThan: 0,
                        notGreaterThan : "^" + _.trans('errors.transferAmount_notGreaterThan'),
                        notValid: "^" + _.trans('errors.transferAmount_amount_invalid')
                    }
                },
                promoCode: {
                    format: {
                        pattern:/^[^~@#$%^&*()_+={}[\]:;"'<>/|?!-.,\\`//]+/,
                        message: "^" + _.trans('errors.invalid_format')
                    }
                }
            },

            freeBetClaim: {
                transferTo: {
                    presence: {
                        message: "^" + _.trans('errors.transferTo_required')
                    }
                },
                claimCode: {
                    format: {
                        pattern:/^[^~@#$%^&*()_+={}[\]:;"'<>/|?!-.,\\`//]+/,
                        message: "^" + _.trans('errors.invalid_format')
                    },
                    presence: {
                        message: "^" + _.trans('errors.freebetCode_required')
                    }
                }
            },

            history: {
                from: {
                    presence: {
                        message: "^" + _.trans('errors.dateFrom_required')
                    },

                    datetime: {
                        earliest: moment.utc().subtract(3, 'months').subtract(1, 'day'),
                        message: "^" + _.trans('errors.date_min')
                    }
                },

                to: {
                    presence: {
                        message: "^" + _.trans('errors.dateTo_required')
                    }
                }
            },

            deposit: {

                basic: {
                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_amount_required')
                        },
                        numericality: {
                            notValid: "^" + _.trans('errors.deposit_amount_invalid')
                        }
                    }
                },

                bank_transfer: {
                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_amount_required')
                        },
                        numericality: {}
                    },

                    bankCode: {
                        presence: {
                            message: "^" + _.trans('errors.bankCode_required')
                        }
                    }
                },

                offline_transfer: {
                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_amount_required')
                        },
                        numericality: {

                            isValid: "^" + _.trans('errors.deposit_amount_invalid')

                        }
                    }
                },

                offline_qr: {
                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_amount_required')
                        },
                        numericality: {}
                    }
                },

                offline: {
                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_amount_required')
                        },
                        numericality: {
                            notValid: "^" + _.trans('errors.deposit_amount_invalid')
                        }
                    },
                    bankAccountId: {
                        presence: {
                            message: "^" + _.trans('errors.bankAccountId_required')
                        }
                    },
                    bankCode: {
                        presence: {
                            message: "^" + _.trans('errors.bankCode_required')
                        }
                    },
                    bankNameNative: {
                        length: {
                            maximum: 100,
                            tooLong: "^" + _.trans('errors.max_bankName')
                        }
                    },
                    bankAccountName: {
                        presence: {
                            message: "^" + _.trans('errors.accountName_required')
                        },
                        format: {
                            pattern: /^[^~@#$%^&*()+={}[\]:;"'<>/|?!\\`//~,×÷€£¥₩¢°•○●□■♤♡◇♧☆▪¤《》¡¿√π¶∆©®™✓]+/,
                            message: "^" + _.trans('errors.invalid_format')
                        },
                        length: {
                            maximum: 100,
                            tooLong: "^" + _.trans('errors.max_accountName')
                        }
                    },
                    bankAccountNumber: {
                        format: {
                            pattern: /^\w+$/,
                            message: "^" + _.trans('errors.invalid_format')
                        },
                        presence: {
                            message: "^" + _.trans('errors.accountNumber_required')
                        },
                        length: {
                            maximum: 50,
                            tooLong: "^" + _.trans('errors.max_accountNumber')
                        }
                    },
                    // bankTransferDate: {
                    //     presence: {
                    //         message: "^" + _.trans('errors.depositDate_required')
                    //     }
                    // },
                    depositDate : {
                        presence : {
                            message: "^" + _.trans('errors.depositDate_required')
                        }
                    },
                    depositTime : {
                        presence : {
                            message: "^" + _.trans('errors.depositTime_required')
                        }
                    },
                    channel: {
                        presence: {
                            message: "^" + _.trans('errors.channel_required')
                        }
                    },
                    bankReference: {
                        format: {
                            pattern:/^[^~@#$%^&*()_+={}[\]:;"'<>/|?!-.,\\`//]+/,
                            message: "^" + _.trans('errors.invalid_format')
                        }
                    },
                    depositFile: {
                        depositImage: {
                            message: "^" + _.trans('errors.invalid_deposit_image_format')
                        },
                        depositFileSize: {
                            message: "^" + _.trans('errors.invalid_deposit_file_size')
                        }
                    }
                },

                daddy_pay_qr: {
                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_amount_required')
                        },
                        numericality: {}
                    },

                    alipayNickname: {
                        presence: {
                            message: "^" + _.trans('errors.alipayNickname_required')
                        }
                    },

                    alipayAccount: {
                        presence: {
                            message: "^" + _.trans('errors.alipayAccount_required')
                        }
                    }
                },

                yeepay_card: {
                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_amount_required')
                        },
                        numericality: {}
                    },
                    cardType: {
                        presence: {
                            message: "^" + _.trans('errors.cardType_required')
                        }
                    },
                    cardCount: {
                        presence: {
                            message: "^" + _.trans('errors.cardCount_required')
                        },
                        numericality: {
                            lessThanOrEqualTo: 5,
                            greaterThanOrEqualTo: 1
                        }
                    }
                },

                yeepay_card_validation_template: {
                    cardId: {
                        presence: {
                            message: "^" + _.trans('errors.cardId_required')
                        }
                    },
                    cardValue: {
                        presence: {
                            message: "^" + _.trans('errors.cardValue_required')
                        }
                    },
                    cardPassword: {
                        presence: {
                            message: "^" + _.trans('errors.cardPassword_required')
                        }
                    }
                },

                sda_pay_alipay: {
                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_amount_required')
                        },
                        numericality: {}

                    }
                },

                credit_card: {

                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_amount_required')
                        },
                        numericality: {}
                    },
                    bankAccountName: {
                        presence: {
                            message: "^" + _.trans('errors.card_holder_name_required')
                        },
                        length: {
                            maximum: 100,
                            tooLong: "^" + _.trans('errors.max_accountName')
                        }
                    },

                    bankName: {
                        presence: {
                            message: "^" + _.trans('errors.bankName_required')
                        }
                    },

                    bankAccountNumber: {
                        presence: {
                            message: "^" + _.trans('errors.card_number_required')
                        },
                        format: {
                            pattern: /^\w+$/,
                            message: "^" + _.trans('errors.card_number_invalid')
                        },
                        numericality: {},
                        length: {
                            minimum: 16,
                            maximum: 16,
                            tooShort: "^" + _.trans('errors.creditcard_number_min'),
                            tooLong: "^" + _.trans('errors.creditcard_number_max')
                        }
                    },

                    expiryMonth: {
                        presence: {
                            message: "^" + _.trans('errors.card_expiration_month_required')
                        },

                        creditCardExpiry: {
                            message: "^" + _.trans('errors.card_expiration_min_year')
                        }
                    },

                    expiryYear: {
                        presence: {
                            message: "^" + _.trans('errors.card_expiration_year_required')
                        },
                        creditCardExpiry: {
                            message: "^" + _.trans('errors.card_expiration_min_year')
                        }

                    },

                    ccv: {
                        presence: {
                            message: "^" + _.trans('errors.card_ccv_number_required')
                        },
                        numericality: {},
                        length: {
                            minimum: 3,
                            maximum: 3,
                            tooShort: "^" + _.trans('errors.creditcard_ccv_min'),
                            tooLong: "^" + _.trans('errors.creditcard_ccv_max')
                        }
                    }
                },

                neteller: {
                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_amount_required')
                        },
                        numericality: {}
                    },
                    accountId: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_account_id_required')
                        }
                    },
                    secureId: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_secure_id_required')
                        }
                    }
                },

                transfer_alipay: {
                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_amount_required')
                        },
                        numericality: {
                            notValid: "^" + _.trans('errors.deposit_amount_invalid')
                        }
                    }
                },

                transfer_unionpay: {

                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_amount_required')
                        },
                        numericality: {}
                    },
                    memberBankAccountId: {

                        presence: {
                            message: "^" + _.trans('errors.memberBankAccountId_required')
                        }
                    }
                },

                bankingdetails: {

                    bankAccountName: {
                        presence: {
                            message: "^" + _.trans('errors.accountName_required')
                        },
                        length: {
                            maximum: 100,
                            tooLong: "^" + _.trans('errors.max_accountName')
                        }
                    },
                    bankAccountNumber: {
                        format: {
                            pattern: /^\w+$/,
                            message: "^" + _.trans('errors.invalid_format')
                        },
                        presence: {
                            message: "^" + _.trans('errors.accountNumber_required')
                        },
                        length: {
                            maximum: 50,
                            tooLong: "^" + _.trans('errors.max_accountNumber')
                        }
                    },
                    bankBranch: {
                        presence: {
                            message: "^" + _.trans('errors.bankdistrict_required')
                        },
                        addressFormat: {
                            message: "^" + _.trans('errors.invalid_format')
                        }
                    }
                },

                scratch_card: {
                    telcoCode: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_telco_code_required')
                        }
                    },
                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_amount_required')
                        },
                        numericality: {}
                    },
                    pin: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_card_pin_required')
                        }
                    },
                    serial: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_card_serial_required')
                        }
                    }
                },

                mpay: {
                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.deposit_amount_required')
                        },
                        numericality: {}
                    }
                }

            },

            withdrawal: {
                offline: {
                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.withdrawal_amount_required')
                        },
                        numericality: {
                            notValid: "^" + _.trans('errors.withdrawal_amount_invalid')
                        }
                    },
                    bankCode: {
                        presence: {
                            message: "^" + _.trans('errors.bankCode_required')
                        }
                    },
                    bankNameNative: {
                        length: {
                            maximum: 100,
                            tooLong: "^" + _.trans('errors.max_bankName')
                        }
                    },
                    bankBranch: {
                        presence: {
                            message: "^" + _.trans('errors.bankBranch_required')
                        },
                        addressFormat: {
                            message: "^" + _.trans('errors.invalid_format')
                        }
                    },
                    bankAddress: {
                        presence: {
                            message: "^" + _.trans('errors.bankAddress_required')
                        },
                        addressFormat: {
                            message: "^" + _.trans('errors.invalid_format')
                        },
                        length: {
                            maximum: 500,
                            tooLong: "^" + _.trans('errors.max_address')
                        }
                    },
                    bankAccountName: {
                        presence: {
                            message: "^" + _.trans('errors.accountName_required')
                        },
                        length: {
                            maximum: 100,
                            tooLong: "^" + _.trans('errors.max_accountName')
                        }
                    },
                    bankAccountNumber: {
                        format: {
                            pattern: /^\w+$/,
                            message: "^" + _.trans('errors.invalid_format')
                        },
                        presence: {
                            message: "^" + _.trans('errors.accountNumber_required')
                        },
                        length: {
                            maximum: 50,
                            tooLong: "^" + _.trans('errors.max_accountNumber')
                        }
                    }
                },

                netteller: {
                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.withdrawal_amount_required')
                        },
                        numericality: {}
                    },
                    accountId: {
                        presence: {
                            message: "^" + _.trans('errors.withdrawal_account_id_required')
                        }
                    },
                    secureId: {
                        presence: {
                            message: "^" + _.trans('errors.withdrawal_secure_id_required')
                        }
                    }
                },

                credit_card: {
                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.withdrawal_amount_required')
                        },
                        numericality: {}
                    },
                    bankAccountName: {
                        presence: {
                            message: "^" + _.trans('errors.card_holder_name_required')
                        },
                        length: {
                            maximum: 100,
                            tooLong: "^" + _.trans('errors.max_accountName')
                        }
                    },

                    bankName: {
                        presence: {
                            message: "^" + _.trans('errors.bankName_required')
                        }
                    },

                    bankAccountNumber: {
                        presence: {
                            message: "^" + _.trans('errors.card_number_required')
                        },
                        format: {
                            pattern: /^\w+$/,
                            message: "^" + _.trans('errors.card_number_invalid')
                        },
                        numericality: {},
                        length: {
                            minimum: 16,
                            maximum: 16,
                            tooShort: "^" + _.trans('errors.creditcard_number_min'),
                            tooLong: "^" + _.trans('errors.creditcard_number_max')
                        }
                    },

                    expiryMonth: {
                        presence: {
                            message: "^" + _.trans('errors.card_expiration_month_required')
                        },

                        creditCardExpiry: {
                            message: "^" + _.trans('errors.card_expiration_min_year')
                        }
                    },

                    expiryYear: {
                        presence: {
                            message: "^" + _.trans('errors.card_expiration_year_required')
                        },
                        creditCardExpiry: {
                            message: "^" + _.trans('errors.card_expiration_min_year')
                        }

                    },

                    ccv: {
                        presence: {
                            message: "^" + _.trans('errors.card_ccv_number_required')
                        },
                        numericality: {},
                        length: {
                            minimum: 3,
                            maximum: 3,
                            tooShort: "^" + _.trans('errors.creditcard_ccv_min'),
                            tooLong: "^" + _.trans('errors.creditcard_ccv_max')
                        }
                    }
                },
                scratch_card:{

                    telcoCode: {
                        presence: {
                            message: "^" + _.trans('errors.withdrawal_telco_code_required')
                        }
                    },
                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.withdrawal_amount_required')
                        },
                        numericality: {
                            notValid: "^" + _.trans('errors.amount_is_invalid')
                        }
                    },
                    quantity: {
                        presence: {
                            message: "^" + _.trans('errors.withdrawal_quantity_required')
                        }
                    }

                },
                gamecard: {
                    telcoCode: {
                        presence: {
                            message: "^" + _.trans('errors.withdrawal_telco_code_required')
                        }
                    },
                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.withdrawal_amount_required')
                        },
                        numericality: {
                            notValid: "^" + _.trans('errors.amount_is_invalid')
                        }
                    },
                    quantity: {
                        presence: {
                            message: "^" + _.trans('errors.withdrawal_quantity_required')
                        }
                    }
                }
            },

            affiliate: {
                signup: {
                    fullName: {
                        format: {
                            pattern: /^[^~@#$%^&*()+={}[\]:;"'<>/|?!\\`//~,×÷€£¥₩¢°•○●□■♤♡◇♧☆▪¤《》¡¿√π¶∆©®™✓]+/,
                            message: "^" + _.trans('errors.invalid_format')
                        },
                        presence: {
                            message: "^" + _.trans('errors.name_required')
                        }
                    },
                    email: {
                        presence: {
                            message: "^" + _.trans('errors.email_required')
                        },
                        email: {
                            message: "^" + _.trans('errors.email_invalid')
                        }
                    },

                    dateOfBirth: {
                        presence: {
                            message: "^" + _.trans('errors.dob_required')
                        },

                        datetime: {
                            dateOnly: true,
                            latest: moment.utc().subtract(18, 'years'),
                            message: "^" + _.trans('errors.age_min')
                        }
                    },
                    username: {
                        presence: {
                            message: "^" + _.trans('errors.username_required')
                        },
                        format: {
                            pattern: "[A-Za-z0-9]+",
                            message: "^" + _.trans('errors.username_format')
                        },
                        length: {
                            minimum: 6,
                            maximum: 16,
                            tooShort: "^" + _.trans('errors.username_min'),
                            tooLong: "^" + _.trans('errors.username_max')
                        }
                    },

                    password: {
                        presence: {
                            message: "^" + _.trans('errors.password_required')
                        },

                        length: {
                            minimum: 6,
                            maximum: 20,
                            tooShort: "^" + _.trans('errors.password_min'),
                            tooLong: "^" + _.trans('errors.password_max')
                        }
                    },

                    confirmPassword: {
                        presence: {
                            message: "^" + _.trans('errors.password_required')
                        },
                        equality: {
                            attribute: "password",
                            message: "^" + _.trans('errors.password_not_match')
                        }
                    },

                    mobileNumber: {
                        presence: {
                            message: "^" + _.trans('errors.contact_required')
                        },
                        numericality: {
                            message: "^" + _.trans('errors.contact_invalid_format')
                        },
                        length: {
                            minimum: 6,
                            maximum: 12,
                            tooShort: "^" + _.trans('errors.contact_min_max'),
                            tooLong: "^" + _.trans('errors.contact_min_max')
                        }
                    },

                    country: {
                        presence: {
                            message: "^" + _.trans('errors.country_required')
                        }
                    },

                    languageCode: {
                        presence: {
                            message: "^" + _.trans('errors.language_required')
                        }
                    },

                    currency: {
                        presence: {
                            message: "^" + _.trans('errors.currency_required')
                        }
                    },

                    commissionType: {
                        presence: {
                            message: "^" + _.trans('errors.commission_type_required')
                        }
                    },

                    acceptTerms: {
                        presence: {
                            message: "^" + _.trans('errors.terms_required')
                        }
                    },

                    affiliateUrl: {
                        url: {
                            message: "^" + _.trans('errors.website_url_invalid')
                        }
                    },

                    affiliateUrl2: {
                        url: {
                            message: "^" + _.trans('errors.website_url_invalid')
                        }
                    },

                    affiliateUrl3: {
                        url: {
                            message: "^" + _.trans('errors.website_url_invalid')
                        }
                    },

                    postal: {
                        numericality: {
                            message: "^" + _.trans('errors.postal_invalid_format')
                        }
                    }
                },

                creative: {

                    bannerSizes: {
                        presence: {
                            message: "^" + _.trans('errors.creative_banner_required')
                        }
                    },

                    creativeGroupId: {
                        presence: {
                            message: "^" + _.trans('errors.creative_group_id_required')
                        }
                    },

                    languageCode: {
                        presence: {
                            message: "^" + _.trans('errors.creative_language_required')
                        }
                    },

                    trackingNames: {
                        presence: {
                            message: "^" + _.trans('errors.creative_track_names_required')
                        }
                    },

                    creativeType: {
                        presence: {
                            message: "^" + _.trans('errors.creative_type_required')
                        }
                    }

                },

                trackNames: {

                    trackingName: {
                        presence: {
                            message: "^" + _.trans('errors.creative_track_names_required')
                        }
                    }
                },

                account: {
                    mobileNumber: {
                        presence: {
                            message: "^" + _.trans('errors.contact_required')
                        },
                        numericality: {
                            message: "^" + _.trans('errors.contact_invalid_format')
                        }
                    },
                    dateOfBirth: {
                        presence: {
                            message: "^" + _.trans('errors.dob_required')
                        },

                        datetime: {
                            dateOnly: true,
                            latest: moment.utc().subtract(18, 'years'),
                            message: "^" + _.trans('errors.age_min')
                        }
                    },
                    country: {
                        presence: {
                            message: "^" + _.trans('errors.country_required')
                        }
                    },
                    address: {
                        presence: {
                            message: "^" + _.trans('errors.address_required')
                        },
                        addressFormat: {
                            message: "^" + _.trans('errors.invalid_format')
                        },
                        length: {
                            maximum: 500,
                            tooLong: "^" + _.trans('errors.max_address')
                        }
                    },
                    city: {
                        addressFormat: {
                            message: "^" + _.trans('errors.invalid_format')
                        }
                    },
                    postal: {
                        numericality: {
                            message: "^" + _.trans('errors.postal_invalid_format')
                        }
                    },
                    securityQuestion: {
                        presence: {
                            message: "^" + _.trans('errors.securityQuestion_required')
                        }
                    },
                    languageCode: {
                        presence: {
                            message: "^" + _.trans('errors.language_required')
                        }
                    },
                    currency: {
                        presence: {
                            message: "^" + _.trans('errors.currency_required')
                        }
                    },
                    securityAnswer: {
                        format: {
                            pattern: /^[^~@#$%^&*()_+={}[\]:;"'<>/|?!-.,\\`//]+/,
                            message: "^" + _.trans('errors.invalid_format')
                        },
                        presence: {
                            message: "^" + _.trans('errors.securityAnswer_required')
                        }
                    },
                    bankAccountName: {
                        presence: {
                            message: "^" + _.trans('errors.accountName_required')
                        },
                        length: {
                            maximum: 50,
                            tooLong: "^" + _.trans('errors.max_accountName')
                        }
                    },
                    bankName: {
                        format: {
                            pattern: /^[^~@#$%^&*()_+={}[\]:;"'<>/|?!-.,\\`//]+/,
                            message: "^" + _.trans('errors.invalid_format')
                        },
                        presence: {
                            message: "^" + _.trans('errors.bankName_required')
                        },
                        length: {
                            maximum: 50,
                            tooLong: "^" + _.trans('errors.max_bankName')
                        }
                    },
                    bankAddress: {
                        presence: {
                            message: "^" + _.trans('errors.bankAddress_required')
                        },
                        addressFormat: {
                            message: "^" + _.trans('errors.invalid_format')
                        },
                        length: {
                            maximum: 50,
                            tooLong: "^" + _.trans('errors.max_address')
                        }
                    },
                    bankAccountNumber: {
                        format: {
                            pattern: /^\w+$/,
                            message: "^" + _.trans('errors.invalid_format')
                        },
                        presence: {
                            message: "^" + _.trans('errors.accountNumber_required')
                        },
                        length: {
                            maximum: 50,
                            tooLong: "^" + _.trans('errors.max_accountNumber')
                        }
                    },
                    swiftCode: {
                        format: {
                            pattern: /^[^~@#$%^&*()_+={}[\]:;"'<>/|?!-.,\\`//]+/,
                            message: "^" + _.trans('errors.invalid_format')
                        },
                        length: {
                            maximum: 50,
                            tooLong: "^" + _.trans('errors.max_swiftCode')
                        }
                    }
                },

                changePassword: {
                    oldPassword: {
                        presence: {
                            message: "^" + _.trans('errors.currentPassword_required')
                        },

                        length: {
                            minimum: 6,
                            maximum: 20,
                            tooShort: "^" + _.trans('errors.password_min'),
                            tooLong: "^" + _.trans('errors.password_max')
                        }
                    },
                    newPassword: {
                        presence: {
                            message: "^" + _.trans('errors.newPassword_required')
                        },

                        length: {
                            minimum: 6,
                            maximum: 20,
                            tooShort: "^" + _.trans('errors.password_min'),
                            tooLong: "^" + _.trans('errors.password_max')
                        }
                    },

                    confirmPassword: {
                        presence: {
                            message: "^" + _.trans('errors.confirm_password_required')
                        },
                        equality: {
                            attribute: "newPassword",
                            message: "^" + _.trans('errors.password_not_match')
                        }
                    }
                },

                subAffiliate: {

                    emails_1: {
                        email: {
                            message: "^" + _.trans('errors.email_invalid')
                        }
                    },
                    emails_2: {
                        email: {
                            message: "^" + _.trans('errors.email_invalid')
                        }
                    },
                    emails_3: {
                        email: {
                            message: "^" + _.trans('errors.email_invalid')
                        }
                    },
                    emails_4: {
                        email: {
                            message: "^" + _.trans('errors.email_invalid')
                        }
                    },
                    emails_5: {
                        email: {
                            message: "^" + _.trans('errors.email_invalid')
                        }
                    },
                    emails_6: {
                        email: {
                            message: "^" + _.trans('errors.email_invalid')
                        }
                    }
                },

                trackingStatistics: {
                    startDate:{
                        presence: {
                            message: "^" + _.trans('errors.dateFrom_required')
                        },
                    },
                    endDate:{
                        presence: {
                            message: "^" + _.trans('errors.dateTo_required')
                        },
                    },
                },

                downlineSearch: {
                    regDateFrom: {
                        presence: {
                            message: "^" + _.trans('errors.dateFrom_required')
                        }
                    },
                    regDateTo: {
                        presence: {
                            message: "^" + _.trans('errors.dateTo_required')
                        }
                    },
                    type: {
                        presence: {
                            message: "^" + _.trans('errors.type_required')
                        }
                    },
                    user: {

                    }
                },

                downlineHistory: {
                    dateFrom: {
                        presence: {
                            message: "^" + _.trans('errors.dateFrom_required')
                        }
                    },
                    dateTo: {
                        presence: {
                            message: "^" + _.trans('errors.dateTo_required')
                        }
                    }
                },

                topup: {
                    amount: {
                        presence: {
                            message: "^" + _.trans('errors.amount_required')
                        },
                        numericality: {
                            lessThanOrEqualTo: 0,
                            notLessThanOrEqualTo : "^" + _.trans('errors.topUpAmount_insufficient'),
                            notValid: "^" + _.trans('errors.generic_amount_invalid')
                        },
                        format: {
                            pattern: /^\s*(?:\d+|\d*\.\d{1,2})?\s*$/,
                            message: "^" + _.trans('errors.generic_amount_invalid')
                        }
                    }
                },

                topupHistory: {
                    startDate: {
                        presence: {
                            message: "^" + _.trans('errors.dateFrom_required')
                        }
                    },
                    endDate: {
                        presence: {
                            message: "^" + _.trans('errors.dateTo_required')
                        }
                    },
                    status: {
                        presence: {
                            message: "^" + _.trans('errors.status_required')
                        }
                    },
                    method: {
                        presence: {
                            message: "^" + _.trans('errors.method_required')
                        }
                    },
                    type: {
                        presence: {
                            message: "^" + _.trans('errors.type_required')
                        }
                    }
                },

                fundsHistory: {
                    startDate: {
                        presence: {
                            message: "^" + _.trans('errors.dateFrom_required')
                        }
                    },
                    endDate: {
                        presence: {
                            message: "^" + _.trans('errors.dateTo_required')
                        }
                    },
                    paymentStatus: {
                        presence: {
                            message: "^" + _.trans('errors.paymentStatus_required')
                        }
                    },
                    paymentType: {
                        presence: {
                            message: "^" + _.trans('errors.paymentType_required')
                        }
                    }
                },

                deposit: {
                    offline: {
                        amount: {
                            presence: {
                                message: "^" + _.trans('errors.deposit_amount_required')
                            },
                            format: {
                                pattern: /^\s*(?:\d+|\d*\.\d{1,2})?\s*$/,
                                message: "^" + _.trans('errors.generic_amount_invalid')
                            },
                            numericality: {
                                notValid: "^" + _.trans('errors.deposit_amount_invalid')
                            }
                        },
                        bankAccountId: {
                            presence: {
                                message: "^" + _.trans('errors.bankAccountId_required')
                            }
                        },
                        bankCode: {
                            presence: {
                                message: "^" + _.trans('errors.bankCode_required')
                            }
                        },
                        bankAccountName: {
                            format: {
                                pattern: /^[^~@#$%^&*()+={}[\]:;"'<>/|?!\\`//~,×÷€£¥₩¢°•○●□■♤♡◇♧☆▪¤《》¡¿√π¶∆©®™✓]+/,
                                message: "^" + _.trans('errors.invalid_format')
                            },
                            presence: {
                                message: "^" + _.trans('errors.accountName_required')
                            },
                            length: {
                                maximum: 100,
                                tooLong: "^" + _.trans('errors.max_accountName')
                            }
                        },
                        bankAccountNumber: {
                            format: {
                                pattern: /^\w+$/,
                                message: "^" + _.trans('errors.invalid_format')
                            },
                            presence: {
                                message: "^" + _.trans('errors.accountNumber_required')
                            },
                            length: {
                                maximum: 50,
                                tooLong: "^" + _.trans('errors.max_accountNumber')
                            }
                        },
                        depositDate : {
                            presence : {
                                message: "^" + _.trans('errors.depositDate_required')
                            }
                        },
                        depositTime : {
                            presence : {
                                message: "^" + _.trans('errors.depositTime_required')
                            }
                        },
                        channel: {
                            presence: {
                                message: "^" + _.trans('errors.channel_required')
                            }
                        },
                        depositFile: {
                            imageType: {
                                message: "^" + _.trans('errors.invalid_deposit_image_format')
                            },
                            imageSize: {
                                maximum: 5242880,
                                message: "^" + _.trans('errors.invalid_deposit_file_size')
                            }
                        }
                    },

                    bank_transfer: {
                        amount: {
                            presence: {
                                message: "^" + _.trans('errors.deposit_amount_required')
                            },
                            numericality: {
                                notValid: "^" + _.trans('errors.not_a_number')
                            },
                            format: {
                                pattern: /^\s*(?:\d+|\d*\.\d{1,2})?\s*$/,
                                message: "^" + _.trans('errors.generic_amount_invalid')
                            }
                        },
                        bankCode: {
                            presence: {
                                message: "^" + _.trans('errors.bankCode_required')
                            }
                        }
                    }
                },

                paymentType: {
                    paymentType: {
                        presence: {
                            message: "^" + _.trans('errors.payment_type_required')
                        }
                    },
                    description: {
                        paymentTypeDescription: {
                            message: "^" + _.trans('errors.payment_type_description_required')
                        }
                    },
                    attachment: {
                        paymentTypeAttachment: {
                            message: "^" + _.trans('errors.payment_type_attachment_required')
                        },
                        imageType: {
                            message: "^" + _.trans('errors.invalid_deposit_image_format')
                        },
                        imageSize: {
                            maximum: 5242880,
                            message: "^" + _.trans('errors.invalid_deposit_file_size')
                        }
                    }
                }
            },

            grabFriendForm: {

                friendEmail1: {

                    email: {
                        message: "^" + _.trans('errors.email_invalid')
                    },
                    emails: {
                        message: "^" + _.trans('errors.email_duplicate')
                    }

                },
                friendEmail2: {

                    email: {
                        message: "^" + _.trans('errors.email_invalid')
                    },
                    emails: {
                        message: "^" + _.trans('errors.email_duplicate')
                    }
                },
                friendEmail3: {

                    email: {
                        message: "^" + _.trans('errors.email_invalid')
                    },
                    emails: {
                        message: "^" + _.trans('errors.email_duplicate')
                    }
                },
                friendEmail4: {

                    email: {
                        message: "^" + _.trans('errors.email_invalid')
                    },
                    emails: {
                        message: "^" + _.trans('errors.email_duplicate')
                    }
                },
                friendEmail5: {

                    email: {
                        message: "^" + _.trans('errors.email_invalid')
                    },
                    emails: {
                        message: "^" + _.trans('errors.email_duplicate')
                    }
                }

            },

            idnPoker: {
                loginId: {
                    presence: {
                        message: "^" + _.trans('errors.username_required')
                    },
                    format: {
                        pattern: "[A-Za-z0-9]+",
                        message: "^" + _.trans('errors.username_format')
                    },
                    length: {
                        minimum : 3,
                        maximum : 25,
                        tooShort: "^" + _.trans('errors.username_min'),
                        tooLong: "^" + _.trans('errors.username_max')
                    }
                },
                password: {
                    presence: {
                        message: "^" + _.trans('errors.password_required')
                    },
                    length: {
                        minimum: 5,
                        maximum: 20,
                        tooShort: "^" + _.trans('errors.password_min'),
                        tooLong: "^" + _.trans('errors.password_max')
                    },
                    idnPokerPassword: {
                        message: "^" + _.trans('errors.invalid_format')
                    }
                }
            }
        },

        provider: {
            // args = [min, max, field]
            length: function (args) {

                return {
                    minimum: _.toInt(args[0]),
                    maximum: _.toInt(args[1]),
                    tooShort: "^" + _.trans( 'errors.min_' + args[2] ),
                    tooLong: "^" + _.trans( 'errors.max_' + args[2] )
                }

            }

        }
    };

    /**
     * @namespace Pt.Rules
     */
     _.Class('Pt.Rules', Rules);

 })(
 moment
 );


window.promJsSdk={version:"v3.0.190"},window.EventBroker=new function(){var i={},s=i.hasOwnProperty;return{events:{slidebar:{close:"onClose"},routes:{changed:"onRouteChanged"},announcements:{ready:"onAnnouncementReady"},funds:{balance:{ready:"onBalanceReady"},transfer:{walletSelect:"onWalletSelect",bonusCodeSelect:"onBonusCodeSelect",bonusCodeFetchStart:"onBonusCodeFetchStart",bonusCodeFetchEnd:"onBonusCodeFetchEnd",complete:"onFundTransferComplete"},freebet:{success:"onFreebetSuccess"}},privateMessage:{read:"onPrivateMessageRead",refresh:"onPrivateMessageRefresh"},requestTimeout:"requestTimeout",navigate:"onNavigate",memberUnauthorized:"memberUnauthorized",domChanged:"onDomChanged",games:{launchRealPlay:"launchRealPlay"}},subscribe:function(e,t,n){s.call(i,e)||(i[e]=[]),"string"==typeof t&&(t=_.bind(n[t],n));var r=i[e].push(t)-1;return{remove:function(){delete i[e][r]}}},dispatch:function(e,t){s.call(i,e)&&i[e].forEach(function(e){e(void 0!==t?t:{})})}}},function(){"use strict";function e(){}_.Class("Pt.Contracts.AbstractModel",e),e.prototype={get:function(e){var t="get"+this._ucFirst(e);return t in this?this[t]():this[e]},set:function(e,t){var n="set"+this._ucFirst(e);return e in this&&(n in this?this[n](t):this[e]=t),this},_ucFirst:function(e){return e.charAt(0).toUpperCase()+e.slice(1)}}}(),function(e,t){"use strict";function n(){this.categories=null,this.club=null,this.clubs=null,this.gameId=null,this.gameLinks=null,this.image=null,this.tags=null,this.title=null,this.isFavorite=!1,this.exclusionList=!1}e.Class("Pt.Contracts.Games",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.items=[],this.pagination=0}e.Class("Pt.Contracts.CmsCollection",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(r,e){"use strict";r.Class("Pt.Contracts.RebateProduct",t);function t(){return this.category=null,this.claimCode=null,this.claimedRebateAmount=null,this.isClaimable=null,this.minimumClaimableAmount=null,this.pendingRebateAmount=null,this.productCode=null,this.rebateAmount=null,this.rebatePercentage=null,this.remainingRebateAmount=null,this.totalEligibleBet=null,this.promotionCode=null,this.canRefresh=null,this}function n(e){return r.isNull(this[e])?r.trans("rebates.empty_content"):r.toCurrency(this[e])}r.extend(t.prototype,e.prototype,{getName:function(){return r.trans("games."+this.get("productCode"))},getClaimedRebateAmount:function(){return n.call(this,"claimedRebateAmount")},getPendingRebateAmount:function(){return n.call(this,"pendingRebateAmount")},getMinimumClaimableAmount:function(){return n.call(this,"minimumClaimableAmount")},getRebateAmount:function(){return n.call(this,"rebateAmount")},getTotalEligibleBet:function(){return n.call(this,"totalEligibleBet")},getRebatePercentage:function(){return r.isNull(this.rebatePercentage)?r.trans("rebates.empty_content"):this.rebatePercentage+" %"},get:function(e){var t="get"+this._ucFirst(e);if(t in this){var n=this[t]();return r.isNull(n)?r.trans("rebates.empty_content"):n}return r.isNull(this[e])?r.trans("rebates.empty_content"):this[e]}})}(_,Pt.Contracts.AbstractModel),function(c,d,e){"use strict";function t(a){var t=["live_casino","lottery","slots","sportsbook"],o={},u={},l="sportsbook_promotion_codes";return c.isFalsy(a.products),c.each(a.products,function(e,s){if(c.isFalsy(e)||t.indexOf(s)<0)return!1;o[s]=[],c.each(e,function(e){if(c.isFalsy(e))return!1;var t={productCode:e,claimCode:e.replace("_"," ")};if("sportsbook"===s){var n=e+"_promotion_prefix";if(c.has(a,l)&&c.has(a.sportsbook_promotion_codes,n)){var r=moment(new Date),i=a.sportsbook_promotion_codes[n]||"";i+=r.isoWeek(),i+=r.year().toString().slice(2),t.promotionCode=i}}o[s].push(c.extendOnly(new d,t))})}),c.each(a.daily_rebate_products,function(e,s){if(c.isFalsy(e)||t.indexOf(s)<0)return!1;u[s]=[],c.each(e,function(e){if(c.isFalsy(e))return!1;var t={productCode:e,claimCode:e.replace("_"," ")};if("sportsbook"===s){var n=e+"_promotion_prefix";if(c.has(a,l)&&c.has(a.sportsbook_promotion_codes,n)){var r=moment(new Date),i=a.sportsbook_promotion_codes[n]||"";i+=r.isoWeek(),i+=r.year().toString().slice(2),t.promotionCode=i}}u[s].push(c.extendOnly(new d,t))})}),this.startDate=a.start_date||"",this.products=o,this.daily_rebate_products=u,this}c.Class("Pt.Contracts.RebateSettings",t),c.extend(t.prototype,e.prototype,{getStartDate:function(){return this.startDate}})}(_,Pt.Contracts.RebateProduct,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.code=null,this.message=null,this.source=null}e.Class("Pt.Contracts.Error",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(a,e){"use strict";function t(){this.PartialReg=null,this.address=null,this.city=null,this.countryCode=null,this.countryName=null,this.currencyCode=null,this.dob=null,this.email=null,this.firstName=null,this.gender=null,this.languageCode=null,this.lastName=null,this.memberCode=null,this.mobile=null,this.oddsType=null,this.postal=null,this.securityAnswer=null,this.securityQuestion=null}a.Class("Pt.Contracts.Member",t),a.extend(t.prototype,e.prototype,{getFullName:function(){return this.lastName?this.lastName+" "+this.firstName:this.firstName},getMaskedEmail:function(){if(!this.email)return this.email;var e=this.email.split("@")[0],t=2===e.length?2:Math.ceil(e.length/2),n=Array(t+1).join("*"),r=e.length-t,i=Math.ceil(r/2),s=e.length-i-t;return a.maskString(e,i,s,n)+"@"+this.email.split("@")[1]},getMaskedMobile:function(){if(!this.mobile)return this.mobile;var e=this.mobile.split("-")[1],t=Math.ceil(e.length/2),n=Array(t+1).join("*"),r=e.length-t;return this.mobile.split("-")[0]+"-"+a.maskString(e,0,r,n)}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.category_id=null,this.id=null,this.message=null,this.start_date=null}e.Class("Pt.Contracts.Announcements",n),e.extend(n.prototype,t.prototype,{compileMessage:function(){this.message=e.unescape(this.message)}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.id=null,this.name=null,this.translation=null}e.Class("Pt.Contracts.AnnouncementCategories",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.AnnouncementDetails=null,this.announcementCatId=null,this.announcementCatName=null,this.announcementId=null}e.Class("Pt.Contracts.CashierAnnouncement",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.Row=null,this.RowDesc=null,this.Sender=null,this.SenderDate=null,this.messageId=null,this.messageText=null,this.flagImportant="false",this.status=null,this.subjectId=null,this.subjectText=null,this.replies=null,this.parentMessageId=null}e.Class("Pt.Contracts.PrivateMessage",n),e.extend(n.prototype,t.prototype,{getFlagImportant:function(){return e.booleanString(this.flagImportant)}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.createdBy=null,this.createdDate=null,this.languageCode=null,this.sequence=null,this.status=null,this.subjectGrouping=null,this.subjectId=null,this.subjectText=null,this.subjectType=null}e.Class("Pt.Contracts.PrivateMessageSubject",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.currencyCode=null,this.limitDaily=null,this.maxWithdrawal=null,this.methodId=null,this.methodName=null,this.minWithdrawal=null,this.paymentMode=null,this.totalAllowed=null}e.Class("Pt.Contracts.WithdrawalMethod",n),e.extend(n.prototype,t.prototype,{getMinimumAmount:function(){return+this.minWithdrawal},getMaximumAmount:function(){return+this.maxWithdrawal},isDailyUnlimited:function(){return 0==+this.limitDaily}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.bankCode=null,this.bankName=null,this.bankNameNative=null}e.Class("Pt.Contracts.Bank",n),e.extend(n.prototype,t.prototype,{getValue:function(){return this.bankCode},getLabel:function(){return this.bankNameNative}})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.bankAccountName=null,this.bankAccountNumber=null,this.bankAddress=null,this.bankBranch=null,this.bankCode=null,this.bankName=null,this.bankNameNative=null,this.memberBankAccountId=null,this.memberCode=null,this.operatorId=null,this.preferred=null,this.supported=!1}e.Class("Pt.Contracts.BankDetail",n),e.extend(n.prototype,t.prototype,{bankSupported:function(){return this.supported=!0,this},isBankSupported:function(){return this.supported},isPreferred:function(){return"true"===this.preferred},hasBeenSet:function(){return null!==this.bankCode},bankHasBeenDeactivated:function(){return this.hasBeenSet()&&!this.isBankSupported()}})}(_,Pt.Contracts.AbstractModel),function(n,e){"use strict";function t(){this.accountId=null,this.accountName=null,this.accountNumber=null,this.image=null,this.bankCode=null,this.bankBranch=null,this.bankNameNative=null,this.bankDowntimeId=null,this.dateFrom=null,this.dateTo=null,this.descriptionExternal=null,this.showBankInfo=null}n.Class("Pt.Contracts.SystemBankAccount",t),n.extend(t.prototype,e.prototype,{shouldShowBankInfo:function(){return this.showBankInfo},isCurrentlyDown:function(){if(null===this.bankDowntimeId||""===this.bankDowntimeId)return!1;var e=moment(this.dateFrom,"YYYY-MM-DDTHH:mm:ss"),t=moment(this.dateTo,"YYYY-MM-DDTHH:mm:ss"),n=moment(new Date).format("YYYY-MM-DDTHH:mm:ss");return n=moment(n,"YYYY-MM-DDTHH:mm:ss"),null!==this.dateFrom&&null===this.dateTo?e<=n:n.isBetween(e,t)},downDownTooltip:function(){var e="-";if(null!==this.dateFrom&&""!==this.dateFrom)e=moment(this.dateFrom).format("MM/DD/YYYY HH:mm:ss");var t="-";if(null!==this.dateTo&&""!==this.dateTo)t=moment(this.dateTo).format("MM/DD/YYYY HH:mm:ss");return'<div class="systembank-account-tootltip"><span cass="systembankaccount-tooltip-main-label">'+n.trans("funds.label_downtime")+"</span><br />"+n.trans("funds.label_downtime_from")+" "+e+"<br />"+n.trans("funds.label_downtime_to")+" "+t+"</div>"},getMaskedAccountNumber:function(){return this.accountNumber.substring(0,11)+"****"+this.accountNumber.substring(this.accountNumber.length-4)}})}(_,Pt.Contracts.AbstractModel),function(i,e){function t(){var e;this.id=null,this.methodCode=null,this.mode=null,this.currencyCode=null,this.dailyLimit=null,this.maximumAmount=null,this.minimumAmount=null,this.totalAllowed=null,this.launcherUrl=null,this.processType=null,this.supportedBanks=[],this.customFields={},this.bankingType=null,this.processingFeeSupported=["alipay","wechat","selection","none"],this.fee={a:(e=parseFloat(Math.random().toFixed(2)),.49<e&&(e=parseFloat((e/2).toFixed(2))),e),b:parseFloat(Math.random().toFixed(2)),c:parseFloat(Math.random().toFixed(2))},this.formFields=[]}i.Class("Pt.Contracts.DepositMethod",t),i.extend(t.prototype,e.prototype,{getMinimumAmount:function(){return+this.minimumAmount},getMaximumAmount:function(){return+this.maximumAmount},isDailyUnlimited:function(){return 0===this.dailyLimit},isBankTransfer:function(){return"bank_transfer"===this.processType},getCustomFields:function(e){return i.has(this.customFields,e)?this.customFields[e]:this.customFields},isExternalLink:function(){return"external"===this.processType},getCustomFieldsByKey:function(e){return i.has(this.customFields,e)?this.customFields[e]:null},isExcluded:function(){if(this.isExternalLink()){var e=this.getCustomFieldsByKey("custom_deposit_link").platform||["web"];return-1===i.indexOf(e,"web")}return!1},getProcessingFee:function(){var e=this.getCustomFields("processing_fee");return i.booleanString(e)},hasProcessingFee:function(){return this.getProcessingFee()},getProcessingFeeMessage:function(){return i.str_replace_key({":method":this.getMethodName(),":member":Pt.Settings.member.code},i.trans("funds.processing_fee_message"))},isProcessingFeeSupported:function(){return-1<i.indexOf(this.processingFeeSupported,this.bankingType)},getActualAmount:function(e){var t=0;return t=(e=+e)<22?e+this.fee.a:22<e&&e<101?e+this.fee.b:e-this.fee.c,Number.isInteger(t)?this.getActualAmount(t):parseFloat(t).toFixed(2)},getMethodName:function(){return i.trans("transaction_methods.method_"+this.get("id"))},hasFormFields:function(){return!i.isEmpty(this.formFields)},isAmountReadOnly:function(){var e=this.getCustomFieldsByKey("read-only_amount");return i.booleanString(e)},getAmountSelectors:function(){var e=this.getCustomFieldsByKey("amount_selections");return i.size(e)?e:i.isNull(e)?void 0:["50","100","300","500","1000"]},getPurchaseEntryLink:function(){return this.getCustomFieldsByKey("purchase_entry_point_link")},getNonZeroAmount:function(e){e=Math.floor(e);var t=this.getCustomFieldsByKey("non-zero_amount_range");t=(t=t||"1-5").split("-");var n=[];if(e%10!=0)return e;if(!i.isArray(t)||i.size(t)<2)return e;for(var r=+t[0];i.size(n)<+t[1];)n.push(r),r++;return e+i.sample(n)},getNoDecimalAmount:function(t){try{return-1<(t+="").indexOf(".")?(t=t.split(".")[0],t*=1):Math.floor(t)}catch(e){return t}},isConvertibleToNearestHundreds:function(){try{return-1<this.getCustomFieldsByKey("nearest_hundreds_amount").platform.indexOf("mobile")}catch(e){return!1}}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.fieldName=null,this.inputType=null,this.selections=null,this.validationRules=null,this.encryptionType="private"}e.Class("Pt.Contracts.FormFields",n),n.prototype=e.extend(t.prototype,{getLabel:function(){return e.trans("funds."+this.fieldName.toLowerCase())},hasValidations:function(){return!e.isEmpty(this.validationRules)},isRequired:function(){return-1<e.indexOf(this.validationRules,"presence")},isEncryptPrivate:function(){return"private"===this.encryptionType},isEncryptBasic:function(){return!this.isEncryptPrivate()}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.invId=null,this.methodCode=null,this.methodid=null,this.paymentMethod=null,this.paymentType=null,this.requestAmount=null,this.requestDate=null,this.source=null,this.status=null,this.transAmount=null,this.statusCode=null}e.Class("Pt.Contracts.DepositWithdrawalHistory",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.categoryCode=null,this.dateRequested=null,this.message=null,this.productCode=null,this.requestedAmount=null,this.status=null,this.statusCode=null,this.transactionId=null,this.transactionType=null,this.transferredAmount=null}e.Class("Pt.Contracts.AdjustmentsHistory",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.amount=null,this.currency=null,this.dateTime=null,this.status=null,this.statusCode=null,this.transactionId=null,this.totalBonus=0,this.totalInvitees=0,this.totalRegistered=0,this.totalSuccessful=0}e.Class("Pt.Contracts.ReferralBonusHistory",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.createdBy=null,this.createdDateTime=null,this.currencyAmount=null,this.memberCode=null,this.transferAmount=null,this.transferFromWalletId=null,this.transferId=null,this.transferStatus=null,this.transferStatusText=null,this.transferToWalletId=null,this.status=null,this.statusCode=null}e.Class("Pt.Contracts.FundTransferHistory",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.createdBy=null,this.createdDateTime=null,this.currencyAmount=null,this.memberCode=null,this.transferAmount=null,this.transferFromWalletId=null,this.transferId=null,this.transferStatus=null,this.transferStatusText=null,this.transferToWalletId=null,this.status=null,this.statusCode=null}e.Class("Pt.Contracts.PromotionHistory",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.comment=null,this.memberId=null,this.memberPromoRegId=null,this.operatorId=null,this.subjectCode=null,this.submissionDate=null,this.submissionOnBehalf=null}e.Class("Pt.Contracts.PromotionClaimsHistory",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.code=null,this.name=null}e.Class("Pt.Contracts.BankingOption",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.name=null,this.shouldDisplay=!0,this.defaultValue=null}e.Class("Pt.Contracts.OfflineDepositField",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e){"use strict";function t(){this.bankAccountName=null,this.bankAccountNumber=null,this.bankCode=null,this.bankNameNative=null,this.requestAmount=null}_.Class("Pt.Contracts.DepositPreferredBank",t),_.extend(t.prototype,e.prototype,{getRequestAmount:function(){return+this.requestAmount},hasBeenSet:function(){return!_.isEmpty(this.bankCode)}})}(Pt.Contracts.AbstractModel),function(t,e){"use strict";function n(){this.code=null,this.denominations=[]}t.Class("Pt.Contracts.CardType",n),t.extend(n.prototype,e.prototype,{setDenominations:function(e){var n=t.isArray(e)?e:[e];return t.each(n,function(e,t){n[t]=+e}),this.denominations=n,this}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.category=null,this.claimCode=null,this.claimedRebateAmount=null,this.isClaimable=null,this.minimumClaimableAmount=null,this.pendingRebateAmount=null,this.productCode=null,this.productName=null,this.rebateAmount=null,this.rebatePercentage=null,this.remainingRebateAmount=null,this.totalEligibleBet=null}e.Class("Pt.Contracts.RebateDetail",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.rebateCode=null,this.claimable=null}e.Class("Pt.Contracts.PromoCode",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.id=null,this.hashId=null,this.title=null,this.summary=null,this.body=null,this.promoName=null,this.cardImage=null,this.bannerImage=null,this.promoCode=null,this.endDate=null}e.Class("Pt.Contracts.Promotion",n),e.extend(n.prototype,t.prototype,{getBannerImage:function(){return e.isEmpty(this.bannerImage)?"/assets/images/no-image.gif":(this.bannerImage[0],this.bannerImage)},getCardImage:function(){return e.isEmpty(this.cardImage)?"/assets/images/no-image.gif":(this.cardImage[0],this.cardImage)},hasPromoCode:function(){return!!this.promoCode},getPromoDuration:function(){var e=moment(new Date(this.endDate)),t=moment(new Date);return moment.duration(e.diff(t))}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.bonusAmount=null,this.categoryDescription=null,this.categoryId=null,this.code=null,this.productCode=null,this.rollOverAmount=null,this.title=null,this.walletId=null,this.promoType=null}e.Class("Pt.Contracts.BonusCode",n),e.extend(n.prototype,t.prototype,{hasRollOver:function(){return-1!==this.rollOverAmount}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.gameId=null,this.productCode=null,this.lastUpdated=null}e.Class("Pt.Contracts.SlotGame",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.id=null,this.balance=null,this.currency=null,this.name=null,this.status=null}e.Class("Pt.Contracts.Wallet",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.code=null,this.message=null,this.rolloverAmount=null}e.Class("Pt.Contracts.PromoCodeStatus",n),e.extend(n.prototype,t.prototype,{setCode:function(e){this.code=parseInt(e,10)}})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.bankAccountId=null,this.bankAccountName=null,this.bankAccountNumber=null,this.bankAddress=null,this.bankAddressId=null,this.bankBranch=null,this.bankCode=null,this.bankName=null,this.bankNameNative=null,this.isPreferred=!1,this.state=null}e.Class("Pt.Contracts.BankingDetails",n),e.extend(n.prototype,t.prototype,{isActive:function(){return"Active"===this.state},isRegular:function(){return"regular"===this.type},getDisplayName:function(){if(this.isRegular())return this.bankNameNative+" - ******"+this.bankAccountNumber.substring(this.bankAccountNumber.length-4);var e=this.bankAccountNumber.indexOf("@");return-1<e?this.bankAccountNumber.substring(0,e).length<10?this.bankAccountNumber.substring(0,1)+"**"+this.bankAccountNumber.substring(e-1):this.bankAccountNumber.substring(0,3)+"***"+this.bankAccountNumber.substring(e-4):this.bankAccountNumber.length<10?this.bankAccountNumber.substring(0,1)+"**"+this.bankAccountNumber.substring(this.bankAccountNumber.length-1):this.bankAccountNumber.substring(0,3)+"***"+this.bankAccountNumber.substring(this.bankAccountNumber.length-4)},getDisplayNumber:function(){if(this.isRegular())return"******"+this.bankAccountNumber.substring(this.bankAccountNumber.length-4)},shouldShow:function(e){return"THB"===e||"THB"!==e&&this.isActive()},shouldShowPreferredButton:function(){return this.isRegular()&&this.isActive()}})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.type="regular"}e.Class("Pt.Contracts.RegularBank",n),e.extend(n.prototype,t,{})}(_,new Pt.Contracts.BankingDetails),function(e,t){function n(){this.type="alipay"}e.Class("Pt.Contracts.AlipayBank",n),e.extend(n.prototype,t,{})}(_,new Pt.Contracts.BankingDetails),function(e,t){function n(){this.type="qq"}e.Class("Pt.Contracts.QqBank",n),e.extend(n.prototype,t,{})}(_,new Pt.Contracts.BankingDetails),function(e,t){function n(){this.type="regular"}e.Class("Pt.Contracts.RegularBank",n),e.extend(n.prototype,t,{})}(_,new Pt.Contracts.BankingDetails),function(e,t){function n(){this.type="wechat"}e.Class("Pt.Contracts.WechatBank",n),e.extend(n.prototype,t,{})}(_,new Pt.Contracts.BankingDetails),function(e,t){function n(){this.type="momo"}e.Class("Pt.Contracts.MomoBank",n),e.extend(n.prototype,t,{})}(_,new Pt.Contracts.BankingDetails),function(e,t){function n(){this.accounts=[],this.type=null,this.consumed=0,this.limit=0,this.allowed=0,this.active=0}e.Class("Pt.Contracts.BankingList",n),e.extend(n.prototype,t.prototype,{getAccounts:function(){return this.accounts},getType:function(){return this.type},canAdd:function(){return 0<this.allowed},canDelete:function(){return!this.isMPay()},remainingLabel:function(){return this.isMPay()?0===this.allowed?e.trans("profile.label_mpay_contact_cs"):this.allowed==this.limit?e.str_replace_key({__count__:this.allowed},e.trans("profile.label_mpay_none_consumed")):e.str_replace_key({__count__:this.allowed},e.trans("profile.label_mpay_has_consumed")):e.str_replace_key({__count__:this.allowed},0===this.consumed?e.trans("profile.label_max_banks"):e.trans("profile.label_add_more_bank"))},isRegular:function(){return"regular"===this.getType()},isMPay:function(){return"momo"===this.getType()},canEdit:function(){return this.isRegular()},shouldShowBankingType:function(e){return this.isRegular()||!this.isRegular()&&"RMB"===e||this.isMPay()&&"VND"===e},hasActive:function(){return 0<this.active}})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.id=null,this.nativeName=null,this.name=null,this.getCities=function(){}}e.Class("Pt.Contracts.BankingProvince",n),e.extend(n.prototype,t.prototype,{getLabel:function(){return this.nativeName},getValue:function(){return this.id}})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.id=null,this.nativeName=null,this.name=null,this.provinceId=null,this.getDistricts=function(){}}e.Class("Pt.Contracts.BankingCity",n),e.extend(n.prototype,t.prototype,{getLabel:function(){return this.nativeName},getValue:function(){return this.id}})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.id=null,this.nativeName=null,this.name=null,this.cityId=null}e.Class("Pt.Contracts.BankingDistrict",n),e.extend(n.prototype,t.prototype,{getLabel:function(){return this.nativeName},getValue:function(){return this.id}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.sessionId=null,this.token=null,this.resetPassword=null,this.shouldVerify=null}e.Class("Pt.Contracts.SignIn",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.code=null,this.message=null,this.data=null}e.Class("Pt.Contracts.ForgotPassword",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.wallet_id=null,this.amount=null,this.currency=null}e.Class("Pt.Contracts.Balance",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.id=null,this.nativeName=null,this.name=null,this.getCities=function(){}}e.Class("Pt.Contracts.BankingProvince",n),e.extend(n.prototype,t.prototype,{getLabel:function(){return this.nativeName},getValue:function(){return this.id}})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.id=null,this.nativeName=null,this.name=null,this.provinceId=null,this.getDistricts=function(){}}e.Class("Pt.Contracts.BankingCity",n),e.extend(n.prototype,t.prototype,{getLabel:function(){return this.nativeName},getValue:function(){return this.id}})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.id=null,this.nativeName=null,this.name=null,this.cityId=null}e.Class("Pt.Contracts.BankingDistrict",n),e.extend(n.prototype,t.prototype,{getLabel:function(){return this.nativeName},getValue:function(){return this.id}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.CurrencyCode=null,this.claimed=null,this.memberCode=null,this.operatorId=null,this.verificationBonusAmount=null}e.Class("Pt.Contracts.MemberProfile",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.statusCode=null,this.statusText=null,this.code=null,this.data=null,this.message=null}e.Class("Pt.Contracts.Generic",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.dateTime=null,this.rolloverAmount=null,this.statusCode=null,this.statusText=null,this.totalStakeAmount=null,this.transferAmount=null,this.transferAmountAllowed=null,this.transferFromBalanceAfter=null,this.transferFromBalanceBefore=null,this.transferId=null,this.transferStatus=null,this.transferToBalanceAfter=null,this.transferToBalanceBefore=null}e.Class("Pt.Contracts.FundTransfer",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.sessionId=null,this.token=null,this.resetPassword=null,this.shouldVerify=null}e.Class("Pt.Contracts.SignUp",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t,n){"use strict";function r(){this.transType=null,this.frequency=null,this.limitAmount=null,this.validFrom=null,this.validTo=null}e.Class("Pt.Contracts.TransactionLimit",r),e.extend(r.prototype,n.prototype,{getValidFrom:function(e){return e=e||"YYYY-MM-DD",t(this.validFrom).format(e)},getValidTo:function(e){return e=e||"YYYY-MM-DD",t(this.validTo).format(e)}})}(_,moment,Pt.Contracts.AbstractModel),function(e){"use strict";function t(){this.bankAccountName=null,this.bankAccountNumber=null,this.bankCode=null,this.bankNameNative=null,this.requestAmount=null}_.Class("Pt.Contracts.DepositPreferredBank",t),_.extend(t.prototype,e.prototype,{getRequestAmount:function(){return+this.requestAmount},hasBeenSet:function(){return!_.isEmpty(this.bankCode)}})}(Pt.Contracts.AbstractModel),function(e){"use strict";function t(){this.bankAccountName=null,this.bankAccountNumber=null,this.bankAddress=null,this.bankBranch=null,this.bankCode=null,this.bankName=null,this.memberBankAccountWdlId=null,this.memberCode=null,this.memberMobile=null,this.operatorId=null,this.preferred=null}_.Class("Pt.Contracts.WithdrawalPreferredBank",t),_.extend(t.prototype,e.prototype,{getRequestAmount:function(){return+this.requestAmount},hasBeenSet:function(){return null!==this.bankCode}})}(Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.invId=null,this.payMethodDescription=null,this.payMethodId=null,this.requestAmount=null,this.requestDate=null,this.status=null}e.Class("Pt.Contracts.WithdrawalTransaction",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.claimed=null,this.promoCode=null}e.Class("Pt.Contracts.PromoClaim",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.accountName=null,this.accountNumber=null,this.amount=null,this.bankCode=null,this.bankName=null,this.transactionId=null,this.status=null}e.Class("Pt.Contracts.AlipayTransferTransaction",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.dateTime=null,this.rolloverAmount=null,this.statusCode=null,this.statusText=null,this.totalStakeAmount=null,this.transferAmount=null,this.transferAmountAllowed=null,this.transferFromBalanceAfter=null,this.transferFromBalanceBefore=null,this.transferId=null,this.transferStatus=null,this.transferToBalanceAfter=null,this.transferToBalanceBefore=null}e.Class("Pt.Contracts.FundTransfer",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(n,e){function t(){this.denominations=[]}n.Class("Pt.Contracts.ScratchCardDenominations",t),n.extend(t.prototype,e.prototype,{getTelcos:function(e){var t=n.map(this.denominations,function(e){return e||{}});return e||0===e?t[e]:t},getTelcoAmounts:function(t){return n.find(this.denominations,function(e){return e.vendorCode===t}).amounts||[]},isMultipleTelcos:function(){return 1<this.getTelcos().length},hasMultipleTelcoAmounts:function(e){return 1<n.size(this.getTelcoAmounts(e))}})}(_,Pt.Contracts.AbstractModel),function(t,e){"use strict";function n(){this.bankDetailCompleted=!1,this.bankDetailCompletedAmount=0,this.bankDetailCompletedClaimedAmount=0,this.emailVerified=0,this.emailVerifiedAmount=0,this.emailVerifiedClaimedAmount=0,this.phoneVerified=!1,this.phoneVerifiedAmount=0,this.phoneVerifiedClaimedAmount=0,this.profileCompleted=!1,this.profileCompletedAmount=0,this.profileCompletedClaimedAmount=0,this.claimed=!1,this.minimumWithdrawal=0,this.minimumDeposit=0}t.Class("Pt.Contracts.SafetyRating",n),t.extend(n.prototype,e.prototype,{getProfileCompleteness:function(){var e=[],t={level:0,label:"needs_validation"};switch(this.bankDetailCompleted&&e.push("true"),this.emailVerified&&e.push("true"),this.phoneVerified&&e.push("true"),this.profileCompleted&&e.push("true"),e.length){case 1:t.level="25",t.label="partially_validated";break;case 2:t.level="50",t.label="partially_validated";break;case 3:t.level="75",t.label="normal";break;case 4:t.level="100",t.label="fully_validated";break;default:t.level="0",t.label="needs_validation"}return t},isBankDetailsVerified:function(){return this.bankDetailCompleted},isProfileVerified:function(){return this.profileCompleted},isEmailVerified:function(){return this.emailVerified},isSmsVerified:function(){return this.phoneVerified},getMinimumWithdrawal:function(){return t.toCurrency(this.minimumWithdrawal,2)},getTotalClaimableAmount:function(){var e=parseInt(this.phoneVerifiedAmount,10)+parseInt(this.emailVerifiedAmount,10)+parseInt(this.profileCompletedAmount,10)+parseInt(this.bankDetailCompletedAmount,10);return t.toCurrency(e,2)},getMinimumDeposit:function(){return t.toCurrency(this.minimumDeposit,2)}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.memberCode=null,this.claimCode=null,this.hasClaimed=null,this.walletId=null,this.startDate=null,this.endDate=null,this.amount=null}e.Class("Pt.Contracts.CustomPromotion",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(i,e){"use strict";function t(){this.name="",this.description="",this.startDate=moment().format("YYYY-MM-DD HH:mm:ss"),this.endDate=moment().format("YYYY-MM-DD HH:mm:ss"),this.leaderboard=[]}i.Class("Pt.Contracts.Leaderboard",t),i.extend(t.prototype,e.prototype,{getLeaderboardList:function(e,t){var r=this.leaderboard;if(r.length){var a=(e=e||{by:"rank",order:"asc"}).by.split("|"),o=e.order.split("|");(function(e,t){var n=!0;e.length!=t.length&&(n=!1);return i.each(e,function(e){i.isUndefined(r[0][e])&&(n=!1)}),n})(a,o)&&(r=r.sort(function(e,t){return function e(t,n,r){r=r||0;if(r<a.length){var i=o[r],s=a[r];return t[s]===n[s]?e(t,n,r+1):"asc"===i?t[s]-n[s]:n[s]-t[s]}return!0}(e,t)})),r=r.slice(0,t||30)}return r}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.loginId=null,this.password=null}e.Class("Pt.Contracts.IDNPokerAccount",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.category=null,this.date=null,this.id=null,this.name=null,this.points=null,this.remarks=null,this.status=null}e.Class("Pt.Contracts.SpinwheelRedemption",n),e.extend(n.prototype,n.prototype,{constructor:n,getStatusText:function(){return this.status},getStatusCode:function(){return-1!==["Successful","สำเร็จ","成功"].indexOf(this.status)?"success":"pending"}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.actualBalance=0,this.adjustedPoints=0,this.cartPoints=0,this.expiredPoints=0,this.pointsBalance=0,this.totalEarnings=0,this.totalRedemptions=0,this.totalStake=0}e.Class("Pt.Contracts.Rewards",n),e.extend(n.prototype,t.prototype,{getPointsBalance:function(){return e.toCurrencyTruncate(this.pointsBalance)}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.currency=null,this.details=null,this.duration=null,this.maximum=null,this.minimum=null,this.name=null,this.transaction_type=null,this.className=null,this.redirectTo=null}e.Class("Pt.Contracts.Cms.BankingOption",n),e.extend(n.prototype,t.prototype,{getClassName:function(){return this.className},getMin:function(){return e.trans("funds.label_banking_options_"+this.currency)+" "+this.minimum},getMax:function(){return e.trans("funds.label_banking_options_"+this.currency)+" "+this.maximum}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.items=[],this.pagination=0}e.Class("Pt.Contracts.CmsCollection",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.categories=null,this.club=null,this.clubs=null,this.gameId=null,this.gameLinks=null,this.image=null,this.tags=null,this.title=null,this.isFavorite=!1,this.exclusionList=!1}e.Class("Pt.Contracts.Games",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(r,e){"use strict";r.Class("Pt.Contracts.RebateProduct",t);function t(){return this.category=null,this.claimCode=null,this.claimedRebateAmount=null,this.isClaimable=null,this.minimumClaimableAmount=null,this.pendingRebateAmount=null,this.productCode=null,this.rebateAmount=null,this.rebatePercentage=null,this.remainingRebateAmount=null,this.totalEligibleBet=null,this.promotionCode=null,this.canRefresh=null,this}function n(e){return r.isNull(this[e])?r.trans("rebates.empty_content"):r.toCurrency(this[e])}r.extend(t.prototype,e.prototype,{getName:function(){return r.trans("games."+this.get("productCode"))},getClaimedRebateAmount:function(){return n.call(this,"claimedRebateAmount")},getPendingRebateAmount:function(){return n.call(this,"pendingRebateAmount")},getMinimumClaimableAmount:function(){return n.call(this,"minimumClaimableAmount")},getRebateAmount:function(){return n.call(this,"rebateAmount")},getTotalEligibleBet:function(){return n.call(this,"totalEligibleBet")},getRebatePercentage:function(){return r.isNull(this.rebatePercentage)?r.trans("rebates.empty_content"):this.rebatePercentage+" %"},get:function(e){var t="get"+this._ucFirst(e);if(t in this){var n=this[t]();return r.isNull(n)?r.trans("rebates.empty_content"):n}return r.isNull(this[e])?r.trans("rebates.empty_content"):this[e]}})}(_,Pt.Contracts.AbstractModel),function(c,d,e){"use strict";function t(a){var t=["live_casino","lottery","slots","sportsbook"],o={},u={},l="sportsbook_promotion_codes";return c.isFalsy(a.products),c.each(a.products,function(e,s){if(c.isFalsy(e)||t.indexOf(s)<0)return!1;o[s]=[],c.each(e,function(e){if(c.isFalsy(e))return!1;var t={productCode:e,claimCode:e.replace("_"," ")};if("sportsbook"===s){var n=e+"_promotion_prefix";if(c.has(a,l)&&c.has(a.sportsbook_promotion_codes,n)){var r=moment(new Date),i=a.sportsbook_promotion_codes[n]||"";i+=r.isoWeek(),i+=r.year().toString().slice(2),t.promotionCode=i}}o[s].push(c.extendOnly(new d,t))})}),c.each(a.daily_rebate_products,function(e,s){if(c.isFalsy(e)||t.indexOf(s)<0)return!1;u[s]=[],c.each(e,function(e){if(c.isFalsy(e))return!1;var t={productCode:e,claimCode:e.replace("_"," ")};if("sportsbook"===s){var n=e+"_promotion_prefix";if(c.has(a,l)&&c.has(a.sportsbook_promotion_codes,n)){var r=moment(new Date),i=a.sportsbook_promotion_codes[n]||"";i+=r.isoWeek(),i+=r.year().toString().slice(2),t.promotionCode=i}}u[s].push(c.extendOnly(new d,t))})}),this.startDate=a.start_date||"",this.products=o,this.daily_rebate_products=u,this}c.Class("Pt.Contracts.RebateSettings",t),c.extend(t.prototype,e.prototype,{getStartDate:function(){return this.startDate}})}(_,Pt.Contracts.RebateProduct,Pt.Contracts.AbstractModel),function(t,e){"use strict";function n(){this.games=[],this.data=null}t.Class("Pt.Contracts.TopPlayedGames",n),t.extend(n.prototype,e.prototype,{getById:function(e){return t.findWhere(this.games.items,{gameId:e})}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.announcementId=null,this.announcementDetails=null,this.effectiveDate=null,this.effectiveDateEnd=null}e.Class("Pt.Contracts.AffiliateAnnouncements",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.groups=null,this.languages=null,this.trackingNames=null}e.Class("Pt.Contracts.CreativeTrackers",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.affiliateurl=null,this.affiliatememberurlid=null}e.Class("Pt.Contracts.AffiliateWebsite",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(t,e){"use strict";function n(){this.expenses=null,this.user=null,this.settlementId=null,this.previousNegativeNetRevenue=null,this.grossCommission=null,this.subAffiliateCommission=null,this.previousCommission=null,this.commission=null,this.adjustment=null,this.negativeNetRevenue=null,this.commissionRollOverNextMonth=null,this.activeMember=null,this.settlements=[],this.paymentFee=null,this.reward=null,this.royalty=null,this.bonus=null,this.rebate=null,this.netTurnOver=null,this.grossRevenue=null,this.rakesAmount=null,this.firstTimeDeposits=null,this.signUps=null}function r(e){return t.isNull(this[e])||0===this[e]?t.trans("affiliate.reports_zero_value"):t.toCurrencyTruncate(this[e])}t.Class("Pt.Contracts.CommissionReport",n),t.extend(n.prototype,e.prototype,{getExpenses:function(){return r.call(this,"expenses")},getPreviousNegativeNetRevenue:function(){return r.call(this,"previousNegativeNetRevenue")},getGrossCommission:function(){return r.call(this,"grossCommission")},getSubAffiliateCommission:function(){return r.call(this,"subAffiliateCommission")},getPreviousCommission:function(){return r.call(this,"previousCommission")},getCommission:function(){return r.call(this,"commission")},getAdjustment:function(){return r.call(this,"adjustment")},getNegativeNetRevenue:function(){return r.call(this,"negativeNetRevenue")},getCommissionRollOverNextMonth:function(){return r.call(this,"commissionRollOverNextMonth")},getNetTurnOver:function(){return r.call(this,"netTurnOver")},getGrossRevenue:function(){return r.call(this,"grossRevenue")},getPaymentFee:function(){return r.call(this,"paymentFee")},getRebatePromotion:function(){var e=this.bonus+this.rebate;return t.isNull(e)||0===e?t.trans("affiliate.reports_zero_value"):t.toCurrency(e)},getRoyalty:function(){return r.call(this,"royalty")},getSettlements:function(){return this.settlements},getRakesAmount:function(){return r.call(this,"rakesAmount")},getSignUps:function(){return this.signUps},getFirstTimeDeposits:function(){return this.firstTimeDeposits}})}(_,Pt.Contracts.AbstractModel),function(t,e){"use strict";function n(){this.totalStakeAmount=null,this.totalWinLoseAmount=null,this.productKey=null,this.productName=null,this.settlementId=null,this.stakeAmount=null,this.winloseAmount=null,this.rakesAmount=null}function r(e){return t.isNull(this[e])||0===this[e]?t.trans("affiliate.reports_zero_value"):t.toCurrency(this[e])}t.Class("Pt.Contracts.CommissionSettlement",n),t.extend(n.prototype,e.prototype,{getTotalStakeAmount:function(){return r.call(this,"totalStakeAmount")},getTotalWinLoseAmount:function(){return r.call(this,"totalWinLoseAmount")},getStakeAmount:function(){return r.call(this,"stakeAmount")},getWinloseAmount:function(){return r.call(this,"winloseAmount")},getRakesAmount:function(){return r.call(this,"rakesAmount")}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.dateOfBirth=null,this.address=null,this.affiliateId=null,this.username=null,this.isFundingAllowed=null,this.city=null,this.commissionType=null,this.messenger=null,this.countryCode=null,this.currencyCode=null,this.languageCode=null,this.email=null,this.fullName=null,this.loginAttempts=null,this.mobileNumber=null,this.operatorCode=null,this.operatorId=null,this.payout=null,this.postal=null,this.websites=null,this.securityAnswer=null,this.redirectionPage=null,this.accountName=null,this.accountNumber=null,this.bankAddress=null,this.bankBranch=null,this.bankName=null,this.bankSwiftCode=null,this.securityQuestion=null}e.Class("Pt.Contracts.Affiliate.Member",n),e.extend(n.prototype,t.prototype,{getDateOfBirth:function(){return this.dateOfBirth.format("YYYY-MM-DD")},getMobileNumber:function(){return this.mobileNumber.split("-")[1]||this.mobileNumber},getMobileNumberCode:function(){return this.mobileNumber.split("-")[0]||this.mobileNumber}})}(_,Pt.Contracts.AbstractModel),function(r,e){"use strict";function t(){this.createDate=null,this.currencyCode=null,this.memberCode=null,this.memberStatus=null,this.signUpIp=null,this.signUpSiteUrl=null,this.dateTransaction=null,this.formats={dateFormat:"YYYY/MM/DD",timeFormat:"hh:mm:ss A"}}r.Class("Pt.Contracts.MemberProfileSummary",t),r.extend(t.prototype,e.prototype,{formatReportDateTime:function(e,t){var n=this.formats;return"object"==typeof t&&(n=r.extend(n,t)),'<span class="report-data-date">'+e.format(n.dateFormat)+"</span>"+" "+('<span class="report-data-time">'+e.format(n.timeFormat)+"</span>")},getCreateDate:function(e){return!r.isNull(this.createDate)&&r.isFunction(this.createDate.format)?this.formatReportDateTime(this.createDate,e):this.this.formatReportDateTime(moment(new Date),e)},getMemberCode:function(){return r.maskString(this.memberCode,3,2,r.trans("affiliate.reports_username_mask"))},getDateTransaction:function(e){if(this.dateTransaction){var t=moment(this.dateTransaction);return!r.isNull(t)&&r.isFunction(t.format)?this.formatReportDateTime(t,e):this.formatReportDateTime(moment(new Date),e)}return""}})}(_,Pt.Contracts.AbstractModel),function(t,e){"use strict";function n(){this.bonusAmount=null,this.bonusAmountInUSD=null,this.depositAmount=null,this.depositAmountInUSD=null,this.memberCode=null,this.memberId=null,this.otherFeeAmount=null,this.otherFeeAmountInUSD=null,this.paymentFeeAmount=null,this.paymentFeeAmountInUSD=null,this.rebateAmount=null,this.rebateAmountInUSD=null,this.withdrawalAmount=null,this.withdrawalAmountInUSD=null,this.currency=null}function r(e){return t.isNull(this[e])||0===this[e]?t.trans("affiliate.reports_payment_zero_value"):t.toCurrencyTruncate(this[e])}t.Class("Pt.Contracts.PaymentReport",n),t.extend(n.prototype,e.prototype,{getBonusAmount:function(){return r.call(this,"bonusAmount")},getBonusAmountInUSD:function(){return r.call(this,"bonusAmountInUSD")},getDepositAmount:function(){return r.call(this,"depositAmount")},getDepositAmountInUSD:function(){return r.call(this,"depositAmountInUSD")},getOtherFeeAmount:function(){return r.call(this,"otherFeeAmount")},getOtherFeeAmountInUSD:function(){return r.call(this,"otherFeeAmountInUSD")},getPaymentFeeAmount:function(){return r.call(this,"paymentFeeAmount")},getPaymentFeeAmountInUSD:function(){return r.call(this,"paymentFeeAmountInUSD")},getRebateAmount:function(){return r.call(this,"rebateAmount")},getRebateAmountInUSD:function(){return r.call(this,"rebateAmountInUSD")},getWithdrawalAmount:function(){return r.call(this,"withdrawalAmount")},getWithdrawalAmountInUSD:function(){return r.call(this,"withdrawalAmountInUSD")},getMemberCode:function(){return t.maskString(this.memberCode,3,2,t.trans("affiliate.reports_username_mask"))}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.activeMember=null,this.products=null,this.totalCompanyWinLossAmount=null,this.totalRakesAmount=null,this.totalTurnoverAmount=null}e.Class("Pt.Contracts.ProductOverview",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(t,e){"use strict";function n(){this.baseStakeAmount=null,this.baseWinLoseAmount=null,this.clickAble=null,this.productCode=null,this.productGroup=null,this.productName=null,this.stakeAmount=null,this.winLoseAmount=null,this.currencyCode=null}function r(e){return t.isNull(this[e])||0===this[e]?t.trans("affiliate.reports_win_loss_zero_value"):t.toCurrencyTruncate(this[e])}t.Class("Pt.Contracts.ProductReport",n),t.extend(n.prototype,e.prototype,{getProductName:function(){return t.trans("games."+this.productCode)},getBaseStakeAmount:function(){return r.call(this,"baseStakeAmount")},getBaseWinLoseAmount:function(){return r.call(this,"baseWinLoseAmount")},getStakeAmount:function(){return r.call(this,"stakeAmount")},getWinLoseAmount:function(){return r.call(this,"winLoseAmount")}})}(_,Pt.Contracts.AbstractModel),function(t,e){"use strict";function n(){this.productCode=null,this.rakesAmount=null,this.stakeAmount=null,this.activePlayer=null,this.winLossAmount=null}function r(e){return t.isNull(this[e])||0===this[e]?t.trans("affiliate.reports_payment_zero_value"):t.toCurrencyTruncate(this[e])}t.Class("Pt.Contracts.ProductSummary",n),t.extend(n.prototype,e.prototype,{getProductName:function(){return t.trans("affiliate.product_"+this.productCode)},getRakesAmount:function(){return r.call(this,"rakesAmount")},getStakeAmount:function(){return r.call(this,"stakeAmount")},getWinLossAmount:function(){return r.call(this,"winLossAmount")},getActivePlayer:function(){return this.activePlayer}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.newSignup=null,this.newSignupWithDeposit=null}e.Class("Pt.Contracts.SignupOverview",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.commission_types=null,this.countries=null,this.currencies=null,this.languages=null}e.Class("Pt.Contracts.SignupSettings",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.activeMember=null,this.products=null,this.totalWinLossAmount=null}e.Class("Pt.Contracts.SubAffiliate",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.code=null,this.name=null}e.Class("Pt.Contracts.TrackingName",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.clicks=null,this.uniqueClicks=null,this.code=null,this.name=null,this.date=null}e.Class("Pt.Contracts.TrackingStatistics",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.totalClicks=null,this.totalUniqueClicks=null,this.trackingStatistics=null}e.Class("Pt.Contracts.MainTrackingStatistics",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.status=null,this.message=null}e.Class("Pt.Contracts.AffiliateSignUp",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(t,e){"use strict";function n(){this.id=null,this.memberCode=null,this.parentId=null,this.parentMemberCode=null,this.currency=null,this.balance=null,this.registrationDate=null,this.status=null}t.Class("Pt.Contracts.Downline",n),t.extend(n.prototype,e.prototype,{canTopup:function(){return 1===this.status||20===this.status},getMemberCode:function(){return this.memberCode},getMaskedMemberCode:function(){return t.maskString(this.memberCode,3,2,t.trans("affiliate.reports_username_mask"))},getParentMemberCode:function(){return this.parentMemberCode},getBalance:function(){return function(e){return t.isNull(this[e])||0===this[e]?t.trans("affiliate.reports_payment_zero_value"):t.toCurrencyTruncate(this[e])}.call(this,"balance")}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.createdAt=null,this.reference=null,this.memberCode=null,this.amount=null,this.status=null}e.Class("Pt.Contracts.TopupHistory",n),e.extend(n.prototype,t.prototype,{getStatus:function(){return 1===this.status?e.trans("affiliate.option_status_success"):e.trans("affiliate.option_status_unsuccessful")}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.id=null,this.balance=null,this.currency=null}e.Class("Pt.Contracts.AffiliateBalance",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(t,e){function n(){var e;this.id=null,this.methodCode=null,this.mode=null,this.currencyCode=null,this.dailyLimit=null,this.maximumAmount=null,this.minimumAmount=null,this.totalAllowed=null,this.launcherUrl=null,this.processType=null,this.supportedBanks=[],this.customFields={},this.bankingType=null,this.processingFeeSupported=["alipay","wechat","selection","none"],this.formFields=[],this.fee={a:(e=parseFloat(Math.random().toFixed(2)),.49<e&&(e=parseFloat((e/2).toFixed(2))),e),b:parseFloat(Math.random().toFixed(2)),c:parseFloat(Math.random().toFixed(2))},this.selfLimit=null,this.hasSelfLimit=!1}t.Class("Pt.Contracts.AffiliateDepositMethods",n),t.extend(n.prototype,e.prototype,{getMinimumAmount:function(){return+this.minimumAmount},getMaximumAmount:function(){return+this.maximumAmount},isDailyUnlimited:function(){return 0===this.dailyLimit},isBankTransfer:function(){return"bank_transfer"===this.processType},getCustomFields:function(e){return t.has(this.customFields,e)?this.customFields[e]:this.customFields},getProcessingFee:function(){var e=this.getCustomFields("processing_fee");return t.booleanString(e)},hasProcessingFee:function(){return this.getProcessingFee()},getProcessingFeeMessage:function(){return t.str_replace_key({":method":this.getMethodName(),":member":Pt.Settings.member.code},t.trans("funds.processing_fee_message"))},isProcessingFeeSupported:function(){return-1<t.indexOf(this.processingFeeSupported,this.bankingType)},getActualAmount:function(e){return(e=+e)<22?e+this.fee.a:e<101?e+this.fee.b:e-this.fee.c},getMethodName:function(){return t.trans("transaction_methods.method_"+this.get("id"))},hasFormFields:function(){return!t.isEmpty(this.formFields)}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.bankCode=null,this.bankName=null,this.bankNativeName=null}e.Class("Pt.Contracts.AffiliateBankAccounts",n),e.extend(n.prototype,t.prototype,{getValue:function(){return this.bankCode},getLabel:function(){return this.bankNameNative}})}(_,Pt.Contracts.AbstractModel),function(n,e){"use strict";function t(){this.accountId=null,this.accountName=null,this.accountNumber=null,this.bankCode=null,this.bankBranch=null,this.bankDowntimeId=null,this.bankName=null,this.dateFrom=null,this.dateTo=null,this.externalDescription=null,this.showBankInfo=null}n.Class("Pt.Contracts.AffiliateSystemBankAccount",t),n.extend(t.prototype,e.prototype,{shouldShowBankInfo:function(){return this.showBankInfo},isCurrentlyDown:function(){if(null===this.bankDowntimeId||""===this.bankDowntimeId)return!1;var e=moment(this.dateFrom,"YYYY-MM-DDTHH:mm:ss"),t=moment(this.dateTo,"YYYY-MM-DDTHH:mm:ss"),n=moment(new Date).format("YYYY-MM-DDTHH:mm:ss");return n=moment(n,"YYYY-MM-DDTHH:mm:ss"),null!==this.dateFrom&&null===this.dateTo?e<=n:n.isBetween(e,t)},downDownTooltip:function(){var e="-";if(null!==this.dateFrom&&""!==this.dateFrom)e=moment(this.dateFrom).format("MM/DD/YYYY HH:mm:ss");var t="-";if(null!==this.dateTo&&""!==this.dateTo)t=moment(this.dateTo).format("MM/DD/YYYY HH:mm:ss");return'<div class="systembank-account-tootltip"><span cass="systembankaccount-tooltip-main-label">'+n.trans("funds.label_downtime")+"</span><br />"+n.trans("funds.label_downtime_from")+" "+e+"<br />"+n.trans("funds.label_downtime_to")+" "+t+"</div>"}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.paymentType=null,this.invId=null,this.methodCode=null,this.source=null,this.requestCurrency=null,this.requestAmount=null,this.requestBaseAmount=null,this.receivedCurrency=null,this.receivedAmount=null,this.receivedBaseAmount=null,this.status=null,this.requestDate=null,this.createdBy=null}e.Class("Pt.Contracts.FundsHistory",n),e.extend(n.prototype,t.prototype,{getPaymentMethod:function(){return e.trans("affiliate.funds_method_"+this.methodCode)},getSubmittedAmount:function(){return e.toCurrency(this.requestAmount,2)},getSubmittedAmountRMB:function(){return e.toCurrency(this.requestBaseAmount,2)},getReceivedAmount:function(){return e.toCurrency(this.receivedAmount,2)},getReceivedAmountRMB:function(){return e.toCurrency(this.receivedBaseAmount,2)},getStatus:function(){return e.trans("affiliate.option_status_"+this.status.toLowerCase())}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.id=null,this.hashId=null,this.title=null,this.summary=null,this.body=null,this.cardImage=null,this.startDate=null,this.categories=null}e.Class("Pt.Contracts.Article",n),e.extend(n.prototype,t.prototype,{getCardImage:function(){return e.isEmpty(this.cardImage)?"/assets/images/no-image.gif":"/"!==this.cardImage[0]?"/"+this.cardImage:this.cardImage},getStartDate:function(){return moment(this.startDate).format("MM/DD/YYYY")}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.affiliateId=null,this.currencyCode=null,this.deposit=0,this.memberCode=null,this.memberId=null,this.promotionClaim=0,this.rebate=0,this.withdrawal=0}e.Class("Pt.Contracts.DownlineHistory",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e){"use strict";var n={jpeg:"image/jpeg",jpg:"image/jpeg",png:"image/png",gif:"image/gif"};function t(){this.affiliateId=0,this.attachments=null,this.createdBy=null,this.createdDate=null,this.description=null,this.fileName=null,this.paymentType=null,this.paymentTypeId=0,this.settlementId=0}_.Class("Pt.Contracts.Affiliate.PaymentType",t),_.extend(t.prototype,e.prototype,{constructor:t,generateImgSource:function(){var e=(this.fileName||"").split(".").slice(-1)[0].toLowerCase(),t=n[e];return void 0!==t?"data:"+t+";base64, "+this.attachments:""}})}(Pt.Contracts.AbstractModel),function(a){"use strict";Pt.Cache={};var o={"<":function(e,t){return e<t},"<=":function(e,t){return e<=t},">":function(e,t){return t<e},">=":function(e,t){return t<=e}};a.mixin({snakeCaseUri:function(e){var t=a.toSnakeCase(e,"/");return a.toSnakeCase(t,"-")},str_replace_key:function(e,t){var n,r;for(n in e)e.hasOwnProperty(n)&&(r=new RegExp(n,"g"),t=t.replace(r,e[n]));return t},propertyValue:function(e,t,n){var r=t.split(".");try{for(var i=0;i<r.length;i++)null!==n&&i+1===r.length&&(e[r[i]]=e[r[i]]||n),e=e[r[i]];return e}catch(e){return n}},capitalize:function(e){return e.charAt(0).toUpperCase()+e.substring(1).toLowerCase()},limitWords:function(e,t){var n="",r=e.replace(/\s+/g," ").split(" "),i=0;if(t<r.length){for(i=0;i<t;i++)n=n+" "+r[i]+" ";return n+"..."}return e},ucfirst:function(e){return e.charAt(0).toUpperCase()+e.slice(1)},toSnakeCase:function(e,t){var n=a.isUndefined(t)?/\s/gi:new RegExp(t,"g");return"_"===(e=(e=e.replace(n,"_")).toLowerCase())[0]?e.substr(1):e},toCamelCase:function(e){return e.replace(/_([a-z])/g,function(e){return e[1].toUpperCase()})},urlSegments:function(e,t,n){n="undefined"===n?0:n;try{e=e.replace(/(\?.*)|(#.*)/g,"");var r=a.trimSlash(e).split("/");return(r=r.slice(t,n)).join("/")}catch(e){}return e},trimTrailingSlash:function(e){return e.replace(/\/$/,"")},trimSlash:function(e,t){switch(t=t||"left"){case"left":if("/"===e[0])return e.substr(1);break;case"right":if("/"===e[e.length-1])return e.substr(0,e.length-1)}return e},maskString:function(e,t,n,r){return e+="",a.isEmpty(e)?r:(t=+t,n=+n,e.substr(0,t)+r+e.substr(e.length-n,n))},firstProp:function(e){for(var t in e)return e[t]},extendArrayObject:function(r,n,i){return"index"===(i=i||"index")?a.each(r,function(e,t){a.extend(e,n[t])}):a.each(n,function(e){var t={};t[i]=e[i];var n=a.findWhere(r,t);a.isEmpty(n)||a.extend(n,e)}),r},extendOnly:function(n,r){return a.each(n,function(e,t){n[t]=void 0===r[t]?n[t]:r[t]}),n},getUniqueByProp:function(n,r){var e=a.uniq(a.pluck(n,r));return a.map(e,function(e){var t={};return t[r]=e,a.findWhere(n,t)})},dottedObject:function(e,t){var n=t;try{for(var r=e.split("."),i=0;i<r.length;i++)n=n[r[i]];return n}catch(e){return!1}},sortStringInteger:function(e){return e.sort(function(e,t){return e-t})},sortByReference:function(e,r,i){if(a.isEmpty(e))return r;var s=[];return a.each(e,function(e){var t={};t[i]=e;var n=a.findWhere(r,t)||{};a.isEmpty(n)||s.push(n)}),s},mergeByProperty:function(e,t){var n=[];return a.each(e,function(e){n.push(e[t])}),a.flatten(n)},getBaseDomain:function(){return a.str_replace_key({"www.":""},location.hostname)},toFullUrl:function(e,t){return t?t+"/"+this.trimSlash(e):location.protocol+"//"+location.host+"/"+this.trimSlash(e)},parseUrl:function(e,t){var n=document.createElement("a");return n.href=e,n[t]},urlHash:function(){return location.hash.replace("#","")},addRouteParamsToUri:function(e,t){var n={};return a.each(e,function(e,t){n[":"+t]=e}),this.str_replace_key(n,t)},getParameterByName:function(e){e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var t=new RegExp("[\\?&]"+e+"=([^&#]*)").exec(location.search);return null===t?"":decodeURIComponent(t[1].replace(/\+/g," "))},encodeObjToUri:function(e,t){var n="",r=0,i="function"==typeof encodeURI;return a.each(e,function(e,t){n+=r?"&":"?",n+=t+"=",n+=i?encodeURI(e):e,r++}),a.isEmpty(t)?n:t+n},isIe:function(e){var t,n,r,i,s=(navigator&&navigator.userAgent||"").toLowerCase().match(/(?:msie |trident.+?; rv:)(\d+)/);return null!==s&&(t=s[1],r=+((n=e+"").match(/\d+/)||NaN),i=n.match(/^[<>]=?|/)[0],o[i]?o[i](t,r):t===r||r!=r)},isMobile:function(){return window._isMobileDevice.any},isAndroid:function(){return window._isMobileDevice.android.device},isIos:function(){return window._isMobileDevice.apple.device},mobileDevice:function(){return window._isMobileDevice.android.device?"android":window._isMobileDevice.apple.device?"ios":window._isMobileDevice.windows.device?"windows":window._isMobileDevice.amazon.device?"amazon":"other"},toInt:function(e){var t=parseInt(e);return isNaN(t)?0:t},toFloat:function(e){if(a.isNumber(e))return e;e=e.replace(new RegExp("(,)","gi"),"");var t=parseFloat(e);return isNaN(t)?0:t},negativeToZero:function(e){return isNaN(e)?0:parseFloat(e)<0?0:parseFloat(e)},paginate:function(e,t,n){return a.chain(e).rest(t).first(n)._wrapped},isSameRoute:function(e,t){return!a.isEmpty(e)&&(e.canonicalPath===t.canonicalPath&&e.params.path===t.params.path&&e.params.pathname===t.params.pathname&&e.state.path===t.state.path)},getRange:function(e,t,n){return a.first(a.rest(e,t),n)},imgPathResolver:function(e,t){try{var n=e.image.relative_uri;return a.isEmpty(t)||a.isEmpty(e[t])||(n=e[t].relative_uri),a.isEmpty(n)||"/"===n[0]||(n="/"+n),n}catch(e){return""}},showCurrency:function(e){var t=Pt.Settings.member.currency||"RMB";return void 0===e||a.isEmpty(e)||"-"===e||"*"===e||"_"===e?t:e},toCurrency:function(e,t){var n=new RegExp("(\\d)(?=(\\d{3})+(?!\\d))","gi");return((e=a.toFloat(e)).toFixed(t||2)+"").replace(n,"$1,")},toCurrencyTruncate:function(e){var t=new RegExp("(\\d)(?=(\\d{3})+(?!\\d))","gi");return((e=0<(e=a.toFloat(""+e))?Math.floor(100*e)/100:Math.ceil(100*e)/100)+"").replace(t,"$1,")},booleanString:function(e){return a.isBoolean(e)?e:!(void 0===e||a.isNull(e)||a.isEmpty(e)||0<a.allKeys(e).length)&&"true"===(e=a.isArray(e)?e[0]:a.isUndefined(e)?"false":e).toLowerCase()},isFalsy:function(e){return a.isNull(e)||a.isEmpty(e)||a.isUndefined(e)||a.isNaN(e)||0===e},exceedsDecimal:function(e,t){return-1<e.indexOf(".")&&e.length-e.indexOf(".")-1>t},escapeHtmlQuotes:function(e){return e?e.replace(/\'/g,"&#39;").replace(/\"/g,"&#34;"):""},getFormValue:function(e,t){if(!a.isEmpty(e)&&!a.isEmpty(t))return a.findWhere(e,{name:t}).value||void 0},nthMask:function(e,n){return a.isEmpty(e)?e:(a.isEmpty(n)&&(n=2),e=a.map(e.split(""),function(e,t){return(t+1)%n==0?"*":e}).join(""))},leadingZero:function(e){return isNaN(e)||e<0?e:e<=9?"0"+e:e},percentage:function(e,t){return!isNaN(e)&&!isNaN(t)&&e/t*100+"%"},updateCdnPath:function(e){try{var t=Pt.Settings.cdn_settings;return a.isUndefined(t.use_domain_prefixed_path)||"true"!==t.use_domain_prefixed_path?"/"+a.trimSlash(e.relative_uri):a.trimSlash(e.uri)}catch(e){}}})}(_),function(e){"use strict";function d(e,t){var n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}function o(e,t,n,r,i,s){return d((a=d(d(t,e),d(r,s)))<<(o=i)|a>>>32-o,n);var a,o}function m(e,t,n,r,i,s,a){return o(t&n|~t&r,e,t,i,s,a)}function f(e,t,n,r,i,s,a){return o(t&r|n&~r,e,t,i,s,a)}function p(e,t,n,r,i,s,a){return o(t^n^r,e,t,i,s,a)}function h(e,t,n,r,i,s,a){return o(n^(t|~r),e,t,i,s,a)}function u(e,t){var n,r,i,s,a;e[t>>5]|=128<<t%32,e[14+(t+64>>>9<<4)]=t;var o=1732584193,u=-271733879,l=-1732584194,c=271733878;for(n=0;n<e.length;n+=16)u=h(u=h(u=h(u=h(u=p(u=p(u=p(u=p(u=f(u=f(u=f(u=f(u=m(u=m(u=m(u=m(i=u,l=m(s=l,c=m(a=c,o=m(r=o,u,l,c,e[n],7,-680876936),u,l,e[n+1],12,-389564586),o,u,e[n+2],17,606105819),c,o,e[n+3],22,-1044525330),l=m(l,c=m(c,o=m(o,u,l,c,e[n+4],7,-176418897),u,l,e[n+5],12,1200080426),o,u,e[n+6],17,-1473231341),c,o,e[n+7],22,-45705983),l=m(l,c=m(c,o=m(o,u,l,c,e[n+8],7,1770035416),u,l,e[n+9],12,-1958414417),o,u,e[n+10],17,-42063),c,o,e[n+11],22,-1990404162),l=m(l,c=m(c,o=m(o,u,l,c,e[n+12],7,1804603682),u,l,e[n+13],12,-40341101),o,u,e[n+14],17,-1502002290),c,o,e[n+15],22,1236535329),l=f(l,c=f(c,o=f(o,u,l,c,e[n+1],5,-165796510),u,l,e[n+6],9,-1069501632),o,u,e[n+11],14,643717713),c,o,e[n],20,-373897302),l=f(l,c=f(c,o=f(o,u,l,c,e[n+5],5,-701558691),u,l,e[n+10],9,38016083),o,u,e[n+15],14,-660478335),c,o,e[n+4],20,-405537848),l=f(l,c=f(c,o=f(o,u,l,c,e[n+9],5,568446438),u,l,e[n+14],9,-1019803690),o,u,e[n+3],14,-187363961),c,o,e[n+8],20,1163531501),l=f(l,c=f(c,o=f(o,u,l,c,e[n+13],5,-1444681467),u,l,e[n+2],9,-51403784),o,u,e[n+7],14,1735328473),c,o,e[n+12],20,-1926607734),l=p(l,c=p(c,o=p(o,u,l,c,e[n+5],4,-378558),u,l,e[n+8],11,-2022574463),o,u,e[n+11],16,1839030562),c,o,e[n+14],23,-35309556),l=p(l,c=p(c,o=p(o,u,l,c,e[n+1],4,-1530992060),u,l,e[n+4],11,1272893353),o,u,e[n+7],16,-155497632),c,o,e[n+10],23,-1094730640),l=p(l,c=p(c,o=p(o,u,l,c,e[n+13],4,681279174),u,l,e[n],11,-358537222),o,u,e[n+3],16,-722521979),c,o,e[n+6],23,76029189),l=p(l,c=p(c,o=p(o,u,l,c,e[n+9],4,-640364487),u,l,e[n+12],11,-421815835),o,u,e[n+15],16,530742520),c,o,e[n+2],23,-995338651),l=h(l,c=h(c,o=h(o,u,l,c,e[n],6,-198630844),u,l,e[n+7],10,1126891415),o,u,e[n+14],15,-1416354905),c,o,e[n+5],21,-57434055),l=h(l,c=h(c,o=h(o,u,l,c,e[n+12],6,1700485571),u,l,e[n+3],10,-1894986606),o,u,e[n+10],15,-1051523),c,o,e[n+1],21,-2054922799),l=h(l,c=h(c,o=h(o,u,l,c,e[n+8],6,1873313359),u,l,e[n+15],10,-30611744),o,u,e[n+6],15,-1560198380),c,o,e[n+13],21,1309151649),l=h(l,c=h(c,o=h(o,u,l,c,e[n+4],6,-145523070),u,l,e[n+11],10,-1120210379),o,u,e[n+2],15,718787259),c,o,e[n+9],21,-343485551),o=d(o,r),u=d(u,i),l=d(l,s),c=d(c,a);return[o,u,l,c]}function l(e){var t,n="",r=32*e.length;for(t=0;t<r;t+=8)n+=String.fromCharCode(e[t>>5]>>>t%32&255);return n}function c(e){var t,n=[];for(n[(e.length>>2)-1]=void 0,t=0;t<n.length;t+=1)n[t]=0;var r=8*e.length;for(t=0;t<r;t+=8)n[t>>5]|=(255&e.charCodeAt(t/8))<<t%32;return n}function r(e){var t,n,r="0123456789abcdef",i="";for(n=0;n<e.length;n+=1)t=e.charCodeAt(n),i+=r.charAt(t>>>4&15)+r.charAt(15&t);return i}function n(e){return unescape(encodeURIComponent(e))}function i(e){return l(u(c(t=n(e)),8*t.length));var t}function s(e,t){return function(e,t){var n,r,i=c(e),s=[],a=[];for(s[15]=a[15]=void 0,16<i.length&&(i=u(i,8*e.length)),n=0;n<16;n+=1)s[n]=909522486^i[n],a[n]=1549556828^i[n];return r=u(s.concat(c(t)),512+8*t.length),l(u(a.concat(r),640))}(n(e),n(t))}function t(e,t,n){return t?n?s(t,e):r(s(t,e)):n?i(e):r(i(e))}"function"==typeof define&&define.amd?define(function(){return t}):"object"==typeof module&&module.exports?module.exports=t:e.md5=t}(this),function(){"use strict";var e=window.location.protocol+"//"+window.location.hostname,t=e+"/api/v2/",n=e+"/api/v1/",r=e+"/api/v3/:pubkey/:lang/op/:msId.:cmsId/",i=t+"members/",s=e+"/:lang/api/v1/operator/:operatorId/",a=e+"/cms/api/v2/",o=e+"/cms/api/v3/",u=o+"affiliates/",l=t+"affiliates/:affiliateId/",c=r+"affiliates/downline/",d=r+"affiliates/account/:affiliateUser/",m=t+"members/:memberCode/",f=n+"members/:memberCode/",p=e+"/cms/payments/",h=r+"game/:vendor/",g=r+"affiliates/";Pt.Endpoints={urls:{assets:"/assets/",templates:"/build/templates/",api:{affiliate:{signup:t+"affiliates",member:t+"affiliates",login:t+"affiliates/signin",forgotLogin:t+"affiliates/forgot-password",publicAnnouncements:r+"affiliates/announcements",announcements:r+"affiliates/announcements/:affiliateUser",signupSettings:t+"affiliates/form-settings",productOverview:l+"product-overview",subAffiliates:l+"sub-affiliate/product-overview",overview:l+"overview",signupOverview:l+"signup-count-overview",creativeBannerSizes:l+"creative-banner-sizes",creativeTrackers:l+"creative-dropdown",creativeList:l+"creative-list",creativeTrackingNames:l+"tracking-names",trackingStatistics:l+"tracking-statistics",reports:l+"reports/:reportType",websites:l+"websites",changePassword:l+"change-password",subAffiliateInvite:l+"invitations",track:n+"affiliates/track",countryList:o+"country-list",downlineStatus:c+":affiliateUser/status",downlineSearch:c+":affiliateUser/from/:regDateFrom/to/:regDateTo/type/:type",downlineSearchByUser:c+":affiliateUser/from/:regDateFrom/to/:regDateTo/type/:type/user/:user",downlineTopupHistory:c+"history/:affiliateUser/from/:startDate/to/:endDate/type/:type/method/:method/status/:status",downlineDailyTransactions:c+"transactions/:affiliateUser/from/:startDate/to/:endDate",accountBalance:d+"balance",accountTopup:d+"balance/top-up/:type",depositMethods:d+"deposit-methods",deposit:d+"deposit/:method",lastWireTransfer:d+"last-wire-transfer",systemBankAccounts:d+"system-bank-accounts",banks:d+"bank-accounts",fundsHistory:d+"history/:paymentType/from/:startDate/to/:endDate/status/:paymentStatus",paymentType:g+"settlements/payment-type",reportsV3:g+"account/:affiliateUser/reports/reportType"},member:{sessionCheck:e+"/local/members/session-check",sessionVerification:e+"/local/members/sessions/verification",login:e+"/local/members/sessions",signup:t+"members",signupV3:r+"members/registration/full",quickRegistration:t+"members/quick-registration",quickRegistrationFinalStep:t+"members/quick-registration/final-step",resendVerification:t+"members/verification/resend-mail",validateSession:t+"validate-session",member:m,forgotLogin:t+"members/forgot-password",publicAnnouncements:t+"announcements",announcements:m+"announcements",cashierPageAnnouncements:m+"cashier-announcements",updatePassword:m+"password",bankingDetail:m+"bank-detail",deliveryAddress:m+"delivery-address",privateMessageSubjects:m+"private-messages/subjects",privateMessages:m+"private-messages",privateMessage:m+"private-messages/:messageId",privateImportant:m+"private-messages/:messageId/flag",privateMessagesBulkDelete:m+"private-messages/trash/batch",paymentTransactionLimits:t+"members/transaction-limits",wallets:m+"wallets",fundTransfers:m+"fund-transfers",balance:m+"wallets/:walletId/balance",freeBetClaims:m+"free-bet-claims",banks:m+"bank-accounts",systemBankAccounts:m+"system-bank-accounts",preferredBank:f+"preferred-bank/:type",depositMethods:m+"deposit-methods",offlineDeposit:m+"deposits",offlineDepositV3:r+"members/:memberCode/deposits",onlineDeposits:m+"deposits/:methodId",onlineDepositsV3:r+"members/:memberCode/deposits/:methodId",onlineWithdrawals:m+"withdrawals/:methodId",offlineTransfer:m+"deposits/:methodId/offline-transfer",offlineTransferV3:r+"members/:memberCode/deposits/:methodId",transactions:m+"deposits/:methodId/transactions/:transactionId",withdrawal:m+"withdrawals",withdrawalMethods:m+"withdrawal-methods",withdrawalTransactions:m+"withdrawal-status/:transactionStatus",cancelWithdrawal:m+"withdrawals/:methodId",depositWithdrawalHistory:m+"histories/deposit-withdrawals",fundTransferHistory:m+"histories/fund-transfers",adjustmentsHistory:m+"histories/adjustments",referralBonusHistory:m+"histories/referrals",promotionsClaimsHistory:m+"histories/promotion-fund-transfers",promotionsPageClaimsHistory:m+"histories/promotion-claims",spinwheelRedemptionsHistory:r+"rewards/account/:memberCode/redemptions/from/:dateFrom/to/:dateTo",scratchCardDenominations:m+"scratch-card/:methodId/denominations",scratchCardQuantity:m+"scratch-card/:methodId/quantity",scratchCardValidate:m+"scratch-card/:methodId/validate",checkCustomPromotionEligibility:r+"promotions/:promotion/eligibility",checkPromoStatusV3:r+"promotions/:promotion/status",customPromotionClaim:r+"promotions/:promotion/claim",rebateSummaryList:m+"product-rebate-summaries",rebateClaims:m+"rebate-claims",rebateCodes:m+"rebate-codes",promotionClaims:m+"promotion-claims",bonusCodes:m+"promotions",promoCodeStatus:m+"promo-codes/:promoCode/status",rebatePromoCodeStatus:m+"rebate-codes/:promoCode",rebateSummaryPerProduct:m+"current-week-rebates/",dailySummaryPerProductUri:m+"current-daily-rebates/:product/?date=:date",previousDailySummaryUri:m+"previous-daily-rebates/?date=:date",rebatePreviousWeekSummary:m+"previous-week-rebates?date=:date",newRebateSummaryPerProduct:m+"rebates/summary/:product?date=:date&period=:period",newRebateStatements:m+"rebates/statements?date=:date&period=:period",newRebateStatementPerProduct:m+"rebates/statement/:product?date=:date&period=:period",favoriteSlotGames:m+"favorite-slot-games",slotGameHistory:m+"slot-game-histories",currencyConversion:t+"currency/conversion?currencyFrom=:currencyFrom&currencyTo=:currencyTo",currencyConversionToRmb:t+"currency/base-exchange-rate/:currencyFrom",bankingDetails:i+"banking-details",bankingProvinces:i+"banking-details/provinces",bankingCities:i+"banking-details/provinces/:provinceId/cities",bankingDistricts:i+"banking-details/cities/:cityId/districts",bankingDetailsAccount:i+"banking-details/:accountId",referrals:f+"referrals",gameExternalAuth:e+"/members/external_auth",safetyRating:r+"members/:memberCode/safety-rating",sendEmailVerification:r+"members/:memberCode/send-email-verification",sendSmsVerification:r+"members/:memberCode/send-sms-verification",verifySmsCode:r+"members/:memberCode/contact-number-verification",verifyEmailCode:r+"members/:memberCode/email-verification",rewards:r+"rewards/account/:memberCode",leaderboard:t+"tournament/leaderboards/:club",spinWheelItems:m+"spin-wheel/prize-items",spinWheelClaim:m+"spin-wheel/claim",hotMatchFeed:r+"sportsbook/hot-matches",gameVendorAccount:h+"account"}},cms:{captcha:"/local/captcha/:type/:case",page:o+"pages",banners:s+"banners/:platform",widget:o+"widgets/:widget",widgetBundle:o+"widgets/bundled/:bundle",games:o+"games",gameByVendorAndId:o+"games/vendor/:vendor/id/:gameId",promotionCategories:a+"promo_categories",promotions:o+"promos",affiliatePromotions:u+"promotions",affiliatePromotionsCategories:o+"affiliates/promo-categories",affiliateArticles:u+"articles",affiliateArticlesCategories:o+"affiliates/article-categories",bankingOptions:p+"banking-options",activeDepositMethods:p+"active-deposit-methods",rebates:p+"rebates",walletConfig:p+"wallet-settings",bankCodes:p+"bank-codes",infoCenterCategories:a+"info-centre/categories",infoCenterList:a+"info-centre/category/id/:catId/names",infoCenterDetails:a+"info-centre/category/id/:catId/content/:detailId",infoCenterDetailsBySlug:a+"info-centre/category_slug/:catSlug/:slug"}}}}(),function(i,e,s){var t={extendDepositAmountRules:function(e,t,n){var r=s.validation.deposit[e].amount.numericality;arguments[3]&&"affiliate"===arguments[3]&&(r=s.validation.affiliate.deposit[e].amount.numericality),r.notLessThanOrEqualTo=i.trans("errors.deposit_amount_notLessThanOrEqualTo"),r.notGreaterThanOrEqualTo=i.trans("errors.deposit_amount_notGreaterThanOrEqualTo"),r.greaterThanOrEqualTo=+t,r.lessThanOrEqualTo=+n},getMethodRules:function(e){var t="withdrawal"===arguments[1]?"withdrawal":"deposit";return arguments[2]&&"affiliate"===arguments[2]?s.validation.affiliate[t][e]||{}:s.validation[t][e]||{}},extendWithdrawalAmountRules:function(e,t,n){var r=s.validation.withdrawal[e].amount.numericality;r.notLessThanOrEqualTo=i.trans("errors.withdrawal_amount_notLessThanOrEqualTo"),r.notGreaterThanOrEqualTo=i.trans("errors.withdrawal_amount_notGreaterThanOrEqualTo"),r.greaterThanOrEqualTo=+t,r.lessThanOrEqualTo=+n},extendDateRangeRules:function(e,t,n){var r=e.val();validate.extend(validate.validators.datetime,{parse:function(e,t){return+moment.utc(e)},format:function(e,t){var n=t.dateOnly?"YYYY-MM-DD":"YYYY-MM-DD hh:mm:ss";return moment.utc(e).format(n)}}),n.datetime={message:i.trans("errors.endDate_less_than_startDate"),dateOnly:!0,earliest:moment.utc(r).add(1,"days")}}};i.Class("Pt.Helpers.RulesHelper",t)}(_,jQuery,Pt.Rules),function(a,o,u){var e={generate:function(e,t,n){var r=n.limit||u.games.slots.listLimit;if(!n.total||n.total<r)return o(e).html(""),null;o(e).html('<ul data-js="paging-element" class="pagination"></ul>'),t=a.isFunction(t)?t:function(){};var i=Math.ceil(n.total/r),s=a.extend({visible:5,first:a.trans("global.pagination_first"),last:a.trans("global.pagination_last"),previous:a.trans("global.pagination_previous"),next:a.trans("global.pagination_next")},n);return o("[data-js=paging-element]").twbsPagination({totalPages:a.isNaN(i)?0:i,visiblePages:s.visible,onPageClick:t,first:s.first,last:s.last,prev:s.previous,next:s.next,initiateStartPageClick:!1})}};a.Class("Pt.Helpers.PaginationHelper",e)}(_,jQuery,Pt.Config),function(e){"use strict";var t={start:function(){e.start()},done:function(){e.done()}};_.Class("Pt.Helpers.Nprogress",t)}(window.NProgress),function(i,s){var e={success:function(e){e=i.isArray(e)?e.join("<br>"):e;var t=i.isUndefined(arguments[1])?5:arguments[1];this._alert(1,e,{time:t})},warning:function(e){this._alert(2,e,{timer:timer})},error:function(e){e=i.isArray(e)?e.join("<br>"):e;var t=i.isUndefined(arguments[1])?5:arguments[1];this._alert(3,e,{timer:t})},info:function(e){this._alert(4,e,{timer:5})},confirm:function(e,t,n,r,i){s.confirm({text:e,stay:!1,submitText:t,cancelText:n,submitCallback:r,cancelCallback:i})},_alert:function(e,t,n){var r=i.extend({type:e,text:t,position:"top",timer:0,stay:!1,submitText:"Yes",cancelText:"Cancel",submitCallback:function(){},cancelCallback:function(){}},n);s.alert(r)}};i.Class("Pt.Helpers.Notify",e)}(_,window.notie),function(n){"use strict";var e={show:function(e){var t=_.map(e,function(e){if(_.isObject(e.message)&&_.has(e.message,"message"))return e.message.message;var t=e.message,n=null;try{var r="errors."+JSON.parse(t).code.replace(/\./g,"_");n=_.trans(r),_.isString(JSON.parse(t).error)&&n===r&&(n=JSON.parse(t).error)}catch(e){}return n||t}).join("<br>");n.error(t)}};_.Class("Pt.Helpers.Error",e),_.Class("Pt.Helpers.ErrorHandler",e)}(Pt.Helpers.Notify),function(){"use strict";var e={lockForm:function(e,t){if(!$(e).length)return!1;var n=$(e)[0].elements;_.each(n,function(e){void 0===$(e).attr("data-locked-field")&&(e.disabled=t)})}};_.Class("Pt.Helpers.Form",e)}(),function(){"use strict";var t='<div class="loader"><div class="data-loader"></div></div>',n='<div class="loader loader-sm"><div class="data-loader"></div></div>',e={basic:function(e){return $(e).html(t),this},small:function(e){return $(e).html(n),this}};_.Class("Pt.Helpers.Preloader",e)}(),function(r){"use strict";_.Class("Pt.Helpers.ErrorParser",new function(){return{parseApiErrors:function(e){var t,n,r=e.responseJSON,i=[],s=_.has(r,"ErrorMessage");if(_.isObject(r.error)&&_.each(r.error,function(e,t){i.push(a(r.statusCode,_.isArray(e)?e[0]:e,"api"))}),s){if(_.isObject(r.ErrorMessage))return _.isArray(r.ErrorMessage)?i=_.map(r.ErrorMessage,function(e){return a(r.ResponseCode,e,"api")}):(t=r.ErrorMessage,n=[],_.each(t,function(e,t){_.isArray(e)?_.each(e,function(e){n.push(a(t,e,"api"))}):n.push(t,e)}),n);i.push(a(r.ErrorCode,r.ErrorMessage,"api"))}return s||!_.has(e,"responseText")||_.isObject(r.error)||i.push(a(e.status,e.responseText,"api")),i},createError:a};function a(e,t,n){return(new r).set("source",n).set("code",e).set("message",t)}})}(Pt.Contracts.Error),function(){"use strict";var r={labels:{placeholder:_.trans("global.label_search"),perPage:_.trans("global.dt_displayRecords"),noRows:_.trans("global.dt_NothingFound"),info:_.trans("global.dt_showingPage")},prevText:_.trans("global.dt_prev"),nextText:_.trans("global.dt_next"),firstText:_.trans("global.dt_first"),lastText:_.trans("global.dt_last"),ellipsisText:"&hellip;",ascText:"▴",descText:"▾",footer:!1,perPageSelect:"AffiliateSite"===Pt.Settings.site?[10,25,50,100]:[5,10,15,20,25]},e={render:function(e,t){function n(e){e.onFirstPage&&$(e.pagers).find("li.pager").first().addClass("disabled"),e.onLastPage&&$(e.pagers).find("li.pager").last().addClass("disabled")}var s=new window.DataTable(e,_.extend(r,_.propertyValue(Pt,"Plugins.defaults.datatable")||{},{footer:1===$(e).find("tfoot").length},t));return s.on("datatable.init",function(){n(s),$(".dataTable-sorter").attr("href","javascript:void(0);")}),s.on("datatable.page",function(e){n(s)}),s.on("datatable.perpage",function(){n(s)}),s.on("datatable.sort",function(){n(s)}),s.on("datatable.search",function(e,t){var n=$(s.wrapper).find(".dataTable-bottom"),r=$(s.wrapper).find(".dataTable-selector"),i=$(s.wrapper).find(".dataTable-sorter");_.isEmpty(e)||0!==t.length?(n.removeClass("hidden"),r.prop("disabled",!1),i.css("pointer-events","auto")):(n.addClass("hidden"),r.prop("disabled",!0),i.css("pointer-events","none")),s.onFirstPage&&$(s.pagers).find("li.pager").first().addClass("disabled")}),s},destroy:function(e){try{e.destroy()}catch(e){throw new Error("Not a Vanilla-Dtable instance")}}};_.Class("Pt.Helpers.DataTable",e)}(),function(){"use strict";var e={activate:function(e,t,n){if($(e).length){n&&window[n]($);var r=_.propertyValue(Pt,"Plugins.defaults.datepicker")||{},i=_.propertyValue(Pt,"Plugins.overrides.datepicker")||{};return $(e).datepicker(_.extend(r,t||{},i))}return!1}};_.Class("Pt.Helpers.DatePicker",e)}(),function(){"use strict";var e={activate:function(e,t){if($(e).length){var n=_.propertyValue(Pt,"Plugins.defaults.timepicker")||{},r=_.propertyValue(Pt,"Plugins.overrides.timepicker")||{};return $(e).timepicker(_.extend({icons:{up:"data-icon icon-arrow-up",down:"data-icon icon-arrow-down"}},n,t||{},r))}return!1}};_.Class("Pt.Helpers.TimePicker",e)}(),function(o,u){var a={smaller:"modal-sm",small:"",large:"modal-lg"},e={confirm:function(e){var t="confirm-modal",n={text:"",static:!0,modalOptionsKeyboard:!1,dialogClass:t+" text-center",confirmButton:u.trans("global.btn_proceed"),cancelButton:u.trans("global.btn_cancel")};e.dialogClass&&(e.dialogClass+=" "+t),o.confirm(u.extend(n,e)),EventBroker.dispatch(EventBroker.events.domChanged,{container:o("."+t),markup:o("."+t).html()})},info:function(e,t,n,r,i){var s="info-modal",a={title:e,text:t,static:!0,modalOptionsKeyboard:!1,dialogClass:s+" text-center",confirmButton:u.trans("global.btn_ok"),showCancel:!1};r.dialogClass&&(r.dialogClass+=" "+s),"function"==typeof n&&(a.confirm=n),"function"==typeof i&&(a.cancel=i);o.confirm(u.extend(a,r));EventBroker.dispatch(EventBroker.events.domChanged,{container:o("."+s),markup:o("."+s).html()})},generic:function(e,t){var n=u.extend({size:"small"},t),r=o("[data-widget=generic-modal]"),i=r.find("[data-js=modal-content]"),s=r.find("[data-js=modal-dialog]");return s.removeClass().addClass("modal-dialog").addClass(a[n.size]),t&&t.additionalClass&&s.addClass(t.additionalClass),i.html(e),EventBroker.dispatch(EventBroker.events.domChanged,{container:i,markup:e}),r.modal("show"),r}};u.Class("Pt.Helpers.Modal",e)}(jQuery,_),function(e,i,t,s){"use strict";var n={decode:function(e){e=e.length?e[0]:null;var r=i.defer();if("function"!=typeof s)return r.reject({error:_.trans("errors.qr_decode_error")}),r.promise;var t=s();if(e.files&&e.files[0]){var n=new FileReader;n.onload=function(n){t.decodeFromImage(n.target.result,function(e,t){e?r.reject({error:_.trans("errors.qr_decode_error")}):r.resolve({file:n.target.result,value:t})})},n.readAsDataURL(e.files[0])}else r.reject({error:_.trans("errors.qr_no_file_selected")});return r.promise},decodeImage:function(e){var n=i.defer();return"function"!=typeof s?n.reject({error:_.trans("errors.qr_decode_error")}):s().decodeFromImage(e[0],function(e,t){e?n.reject({error:_.trans("errors.qr_decode_error")}):n.resolve({file:"",value:t})}),n.promise},getImage:function(e){e=e.length?e[0]:null;var t=i.defer();if(e.files&&e.files[0]){var n=new FileReader;n.onload=function(e){t.resolve({file:e.target.result})},n.readAsDataURL(e.files[0])}else t.reject({error:_.trans("errors.qr_no_file_selected")});return t.promise},generate:function(e){new QRCode(e.id,{text:e.url,width:e.width,height:e.height,colorDark:e.colorDark||"#000000",colorLight:e.colorLight||"#ffffff",correctLevel:QRCode.CorrectLevel.H})}};_.Class("Pt.Helpers.QrCode",n)}(jQuery,Q,Pt.Helpers.Notify,window.QCodeDecoder),function(n,t){function e(){this.hooks={"remove-if-not-auth":"removeIfNotAuth","remove-if-auth":"removeIfAuth","remove-if-funds":"removeIfFunds"}}e.prototype={run:function(e){if(e)return this[this.hooks[e]]();var t=this;n.each(this.hooks,function(e){t[e]()})},removeIfNotAuth:function(){var e=$("[data-hook=remove-if-not-auth]");return t.member.isLoggedIn&&"MemberSite"===Pt.Settings.site||t.affiliate.isLoggedIn&&"AffiliateSite"===Pt.Settings.site?e.removeClass("hide"):e.remove(),this},removeIfAuth:function(){var e=$("[data-hook=remove-if-auth]");return t.member.isLoggedIn&&"MemberSite"===Pt.Settings.site||t.affiliate.isLoggedIn&&"AffiliateSite"===Pt.Settings.site?e.remove():e.removeClass("hide"),this},removeIfFunds:function(){var e=$("[data-hook=remove-if-funds]");return"Funds"!==t.module&&t.member.isLoggedIn?e.removeClass("hide"):e.remove(),this}},n.Class("Pt.Helpers.Hook",new e)}(_,Pt.Settings),function(d,m,e){var t={generate:function(e,t,n){var r=t.current?t.current:"current",i=t.total?t.total:"total",s=t.paginationClass?t.paginationClass:"slick-counter",a=t.open?t.open:"[",o=t.close?t.close:"]",u='<div class="'+s+'">'+a+' <span class="'+r+' count"></span> '+(t.separator?t.separator:"/")+' <span class="'+i+'"></span> '+o+"</div>",l="."+r,c="."+i;e.on("init",function(e,t){m(this).append(u),m(l).text(d.leadingZero(t.currentSlide+1)),m(c).text(d.leadingZero(t.slideCount))}).slick(n).on("beforeChange",function(e,t,n,r){m(l).text(d.leadingZero(r+1))})}};d.Class("Pt.Helpers.SlickPaginationHelper",t)}(_,jQuery,Pt.Config),function(){"use strict";_.Class("Pt.Managers.Analytics",new function(){return{goalMap:{SIGN_UP_SUCCESS:1,LOG_IN_SUCCESS:2,DEPOSIT_SUBMIT:3,WITHDRAWAL_SUBMIT:5,SIGN_UP_FAIL:7,LOG_IN_FAIL:8},eventMap:{MEMBER_ACTIONS:"Member Actions",PAYMENT_ACTIONS:"Payment Actions"},actionMap:{SIGN_UP_FAIL:"Sign Up Fail",LOG_IN_FAIL:"Log In Fail",LOG_IN_SUCCESS:"Log In Success",WITHDRAWAL_SUCCESS:"Withdrawal Success",WITHDRAWAL_FAIL:":gateway: - Withdrawal Fail"},trackGoal:function(e,t){try{var n=i();!_.isEmpty(n)&&_.isFunction(n.trackGoal)&&n.trackGoal(e,t)}catch(e){}},trackEvent:function(e,t,n){try{var r=i();!_.isEmpty(r)&&_.isFunction(r.trackEvent)&&r.trackEvent(e,t,n)}catch(e){}}};function i(){return"undefined"!=typeof Piwik?Piwik.getAsyncTracker():{}}})}(),function(e,u){"use strict";u.Class("Pt.Managers.Cache",new function(){var o=window.simpleStorage;function e(){}return e.prototype={setObject:function(e,n){var r=this;u.each(e,function(e,t){r.set(n+t,e)})},set:function(e,t,n){var r,i,s,a={TTL:36e6};u.extend(a,n),r=e,i=t,s=a,o.canUse()?o.set(r,i,s):Pt.Cache[r]=i},get:function(e){return o.canUse()?o.get(e)||null:Pt.Cache[e]||null},remove:function(e){return o.canUse()?o.deleteKey(e):Pt.Cache[e]=null,this},flush:function(){o.flush()}},new e})}(jQuery,_),function(r,i){"use strict";r.Class("Pt.Managers.Cookie",new function(){return{get:function(e){if("lang"===e){var n=window.Cookies.get("lang");try{if(Pt.Settings.hasOwnProperty("new_feature_settings"))return r.each(Pt.Settings.new_feature_settings.language_override,function(e,t){e===n&&e!==t&&(n=t)}),n}catch(e){}}return window.Cookies.get(e)},set:function(e){var t={name:"",value:"",expires:7,path:"/",secure:!r.isEmpty(i.secure)&&i.secure};r.extend(t,e);var n=[null,i.main_domain,i.app_domain];r.each(n,function(e){window.Cookies.remove(t.name,{domain:e})}),window.Cookies.set(t.name,t.value,{expires:t.expires,path:t.path,domain:t.domain,secure:t.secure})},remove:function(e){var t={name:"",path:"/",secure:!r.isEmpty(i.secure)&&i.secure};return t=r.extend(t,e),window.Cookies.remove(t.name,t)}}})}(_,Pt.Settings),function(d,m,f){"use strict";function p(e){this.data=e}p.prototype={get:function(e){var t=m.findWhere(this.data,{name:e});if(t)return t.value},set:function(e,t){var n=m.findWhere(this.data,{name:e});return n?n.value=t:this.data.push({name:e,value:t}),this},toFormData:function(){var t=new FormData;return m.each(this.data,function(e){t.append(e.name,e.value)}),t}},m.Class("Pt.Managers.Validation",function(e,l){var c='<label class="error" for=":el"><span class="glyphicon glyphicon-remove"></span><small class="caption">:caption</small></label>',t=!1,a=!0,o="label.error",u=d(e),n=[[e+" input","change",r],[e+" textarea","change",r],[e+" select","change",r]];return{init:function(){u.length||(u=d(e));t&&m.each(n,function(e){d("body").off(e[1],e[0],e[2]).on(e[1],e[0],{context:self},e[2])})},setRules:function(e){return l=e,this},getRules:function(){return l},validate:function(e,t){var n=new p(u.serializeArray());d(o).remove(),d(".error").removeClass("error");var r=f(u,l);if(!r)return a&&(n=u.serializeArray()),e.call(t,n,t),!0;s=u,i=r,s=d(s),m.each(i,function(e,t){var n=s.find('[name="'+t+'"]'),r=m.str_replace_key({":el":n.attr("id"),":caption":e[0]},c),i=n.data("eph");i?d("[data-js="+i+"]").html(r):(n.next("label.error").remove(),n.addClass("error"),n.after(r))});var s,i},destroy:function(){m.each(n,function(e){d("body").off(e[1],e[0],self[e[2]])}),d(o).remove(),d(".error").removeClass("error")},bindInput:function(e){return t=e,this},shouldSerialize:function(e){return a=e,this},single:function(e,t,n){return f.single(e,t,n)}};function r(){var e={},t={},n=d(this),r=d(this).closest("form"),i=n[0].files||(m.isEmpty(n.val())?null:n.val());if(e[n.attr("name")]=i,t[n.attr("name")]=l[n.attr("name")],"object"==typeof l[n.attr("name")]&&void 0!==l[n.attr("name")].equality){var s=l[n.attr("name")].equality.attribute;e[s]=r.find('input[name="'+s+'"]').val()}var a,o,u=f(e,t)||{};m.isEmpty(u)?(d(this).next("label.error").remove(),d(this).removeClass("error")):(a=d(this),o=u,m.each(o,function(e){var t=m.str_replace_key({":el":a.attr("id"),":caption":e[0]},c);a.next("label.error").remove(),a.addClass("error"),a.after(t)}))}})}(jQuery,_,window.validate),function(t,i,e){"use strict";var s=new window.slidebars({scrollLock:!0}),n=[".js-close-any","click",function(e){s.getActiveSlidebar()&&(e.preventDefault(),e.stopPropagation(),s.close())}];s.init(),t(s.events).on("opening",function(e){t("[canvas]").addClass("js-close-any"),t("body").addClass("sb-open"),t(n[0]).on(n[1],n[2])}),t(s.events).on("closing",function(e){t(n[0]).off(n[1],n[2]),t("[canvas]").removeClass("js-close-any"),t("body").removeClass("sb-open")}),t(s.events).on("closed",function(e,t){EventBroker.dispatch(EventBroker.events.slidebar.close,{event:e.type,id:t})}),EventBroker.subscribe(EventBroker.events.navigate,function(){s.close()});var a={left:"app-left-nav",right:"app-right-nav"};i.Class("Pt.Managers.Slidebar",new function(){return{open:function(e,t,n){r("open",a[e],n,t)},close:function(e,t,n){r("close",a[e],n,t)},toggle:function(e,t,n){r("toggle",a[e],n,t)},closeAll:function(){s.getActiveSlidebar()&&s.close()}};function r(t,n,r,e){i.isEmpty(e)||e.preventDefault(),s[t](n,function(e){"function"==typeof r&&r({event:t,side:n,ev:e})})}})}(jQuery,_),function(s,a,o,u,l){"use strict";s.Class("Pt.Managers.Session",new function(){var r={MemberSite:"member",AffiliateSite:"affiliate"};return{handle:function e(t){var n=Pt.Services.Members.SessionService;l.Cookie.get(o.tokenKey)&&a.session_polling&&n.check(r[t]).then(function(e){e.data||(i(),u.info(s.trans("session.session_title"),s.trans("session.session_auto_logout"),function(){location.href="/"}))}).finally(function(){s.delay(function(){e(t)},a.session_polling_interval)})}};function i(){l.Cookie.remove({name:o.tokenKey}),l.Cookie.remove({name:"s"})}})}(_,Pt.Settings,Pt.Config,Pt.Helpers.Modal,Pt.Managers),function(e,u,l,c){"use strict";_.Class("Pt.Services.HttpClientCacheService",new function(){var r=_.propertyValue(e,"cacheKeys.httpclient")||"httpclient",t=c.get("lang")||"zh-hans",i=u.cache_settings&&u.cache_settings[u.site.toLowerCase()]||{},n="true"===i.active,s=u.app_md5;return{shouldUseCache:function(e){return e&&e.store&&n},setCache:function(e,t){var n=o()||{id:s};n[a(e)]=t,l.set(r,n,{TTL:1e3*(parseInt(i.ttl)||0)*60})},getCache:function(e){var t,n=o();n&&(s!==n.id?l.remove(r):(t=n[a(e)])&&(t.fromCache=!0));return t},getDataCacheKey:a};function a(e){return md5(s+t+e)}function o(){return l.get(e.cacheKeys.httpclient)}})}(Pt.Config,Pt.Settings,Pt.Managers.Cache,Pt.Managers.Cookie),function(g,v,b,e,y,C,_,P){"use strict";v.Class("Pt.Managers.HttpClient",new function(){var m=e.tokenKey,f="zh-hans";return{get:function(e,t,n,r){return p("GET",e,t,n,r)},post:function(e,t,n,r){return p("POST",e,t,n,r)},put:function(e,t,n,r){return p("PUT",e,t,n,r)},del:function(e,t,n,r){return p("DELETE",e,t,n,r)},setAuthKey:function(e){return m=e||m,this},replaceV3Tags:function(e){return v.str_replace_key({":pubkey":y.public_key,":lang":C.get("lang")||"en",":msId":y.operator.msId,":cmsId":y.operator.cmsId,":affiliateUser":y.affiliate.user},e)}};function p(i,u,s,a,o,e){var l,c,d=e||b.defer();if("GET"===i&&(l=P.shouldUseCache(o),c=u+(s?"?"+g.param(s):"")),l){var t=P.getCache(c);if(t)return d.resolve(t),d.promise}a=a||"json";var n=v.extend({type:i,url:u,data:s,dataType:a,timeout:y.httpTimeout||15e3,beforeSend:function(e){var t,n,r,i,s,a,o=C.get(m);v.isEmpty(o)||e.setRequestHeader("Authorization","Prometheus "+o),t=e,n={url:u},r=v.isEmpty(y.debug_host)?window.location.hostname.replace(/^(www\.)|^(m\.)/i,""):y.debug_host,i=n.url||"",s=-1===i.indexOf("/api/v3")||-1<i.indexOf("/cms/api/v3"),a=i.indexOf(".json")!==i.length-5,s&&a&&(t.setRequestHeader("Prometheus-BoId",y.operator.msId),t.setRequestHeader("Prometheus-operator-id",y.operator.cmsId),t.setRequestHeader("Prometheus-ClientIp",y.clientIp),t.setRequestHeader("App-Origin",window.location.origin),t.setRequestHeader("Prometheus-Domain",r),t.setRequestHeader("Accept-Language",C.get("lang")||f),t.setRequestHeader("X-Client-Version","v3"),t.setRequestHeader("X-Client-Key",y.public_key))},success:function(e,t,n){var r;h(n),void 0!==(r=e)&&"407"===r.status_code&&(v.each(r.data,function(e,t){C.set({name:t,value:e})}),1)?p(i,u,s,a,o,d):(!v.isUndefined(o)&&o.returnXhr?d.resolve({data:e,status:t,xhr:n}):d.resolve(e),l&&P.setCache(c,e))},error:function(e){var t=r(u)?"cms":"api";if("timeout"===e.statusText)return d.reject([_.createError(504,v.trans("errors.request_timeout_notification"),t)]),void EventBroker.dispatch(EventBroker.events.requestTimeout,u);if(401===e.status&&!r(u))return C.remove({name:m}),d.reject([_.createError(401,v.trans("errors.un_authorized"),t)]),void EventBroker.dispatch(EventBroker.events.memberUnauthorized,u);h(e);try{return r(u)?d.reject([_.createError(e.statusCode,e.statusText,t)]):500===e.status?d.reject([_.createError(0,v.trans("errors.unknown_error"),t)]):d.reject(_.parseApiErrors(e)),this}catch(e){d.reject([_.createError(0,v.trans("errors.unknown_error"),t)])}}},o||{});return v.isIe()&&(n.cache=!1),g.ajax(n),d.promise}function h(e){var t=e.getResponseHeader("Authorization");v.isEmpty(t)||(C.set({name:m,value:t,expires:-1}),C.set({name:m,value:t,domain:y.main_domain}))}function r(e){return window.location.origin&&(e=e.replace(window.location.origin,"")),/\/.*\/api\/v.*/.test(e)}})}(jQuery,_,Q,Pt.Config,Pt.Settings,Pt.Managers.Cookie,Pt.Helpers.ErrorParser,Pt.Services.HttpClientCacheService),function(e,l,c,d,r,m,f,i,p){"use strict";l.Class("Pt.Managers.Template",new function(){var e=window.prom_template_version,s="development"===d.env?r.urls.templates:"/"+d.asset_path,n=Pt.Templates.Extensions,a="tpl.",o={};return t=d.app+"-template-version",f.get(t)!==e&&(f.flush(),f.set(t,e,{TTL:3154e7})),{init:function(){var t=c.defer(),r=[],i=[];return l.each(h[d.site],function(e,t){var n=a+t;(!0!==f.get(n)||d.debug)&&(i.push(n),r.push(m.get(s+e)))}),c.allSettled(r).then(function(e){e.forEach(function(e,t){"fulfilled"===e.state&&(f.set(i[t],!0),f.setObject(e.value,i[t]+"."))}),function(e){if(l.isEmpty(n))return u(e);m.get("/"+n,null,null,{store:!0}).then(function(e){var t=e.data.web?e.data.web:[];l.each(t,function(e,t){l.isEmpty(e)||l.each(e,function(e){o[a+t+"."+e.key]=l.unescape(e.body)})})}).finally(function(){u(e)})}(t)}),t.promise},get:function(e,t){t=t||{};try{var n=o[a+e]?o[a+e]:f.get(a+e);if(!l.isEmpty(n)){n=n.replace(/<%\s*include\s*(.*?)\s*%>/g,function(e,t){return'<%= _.include("'+t+'", arguments) %>'});var r=l.template(n);return r(t)}}catch(e){d.debug&&i.error(e.message+"<br/><br/>"+e.stack,0)}return""},compile:function(e,t){t=t||{};try{var n=(e=l.unescape(e)).replace(/<%\s*include\s*(.*?)\s*%>/g,function(e,t){return'<%= _.include("'+t+'", arguments) %>'}),r=l.template(n);return r(t)}catch(e){d.debug&&i.error(e.message+"<br/><br/>"+e.stack,0)}return""}};var t;function u(n){var e=l.trimSlash(p.tpl);if(!e)return n.resolve(),!1;m.get("/"+e,null,null,{store:!0}).then(function(e){var t=e.prom_cp_templates;f.set(a+"plugins",!0),f.setObject(t,a+"plugins."),n.resolve()})}});var h={AffiliateSite:{aweb:"aweb.json",awidgets:"awidgets.json"},MemberSite:{web:"web.json",funds:"funds.json",profile:"profile.json",widgets:"widgets.json"}}}(jQuery,_,Q,Pt.Settings,Pt.Endpoints,Pt.Managers.HttpClient,Pt.Managers.Cache,Pt.Helpers.Notify,Pt.Plugins),function(t,n){"use strict";_.Class("Pt.Services.AbstractV3Service",new function(){return{replaceV3Tags:function(e){return _.str_replace_key({":pubkey":n.public_key,":lang":t.get("lang")||"en",":msId":n.operator.msId,":cmsId":n.operator.cmsId,":affiliateUser":n.affiliate.user},e)}}})}(Pt.Managers.Cookie,Pt.Settings),function(s,a,o,e,t,u){"use strict";_.Class("Pt.Services.Members.SessionService",new function(){return{check:function(){var t=s.defer();return u.get(o.urls.api.member.sessionCheck,{site:"member"}).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise},login:function(e,t,n){var r=s.defer(),i={memberCode:e,password:t,operatorId:a.operator.msId,deviceId:n||"Desktop"};return u.post(o.urls.api.member.login,i).then(function(e){return r.resolve(_.extendOnly(new Pt.Contracts.SignIn,e))}).fail(function(e){r.reject(e)}),r.promise},forgotLogin:function(e,t){var n=s.defer(),r={memberCode:e,email:t,operatorId:a.operator.msId,deviceId:"Desktop"};return u.post(o.urls.api.member.forgotLogin,r).then(function(e){n.resolve(_.extendOnly(new Pt.Contracts.ForgotPassword,e))}).fail(function(e){n.reject(e)}),n.promise},validate:function(){var t=s.defer();return u.get(o.urls.api.member.validateSession,{}).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise},resendVerification:function(e){var t=s.defer();return u.post(o.urls.api.member.resendVerification,e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise},verifySession:function(e){var t=s.defer();return u.post(o.urls.api.member.sessionVerification,e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise}}})}(Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.Cache,Pt.Managers.HttpClient),function(o,i,u,l,c,d,m,f){"use strict";o.Class("Pt.Services.Members.AnnouncementService",new function(){return{getAnnouncements:function(){var e=l.urls.api.member.publicAnnouncements,t={operatorId:u.operator.msId};u.member.isLoggedIn&&(e=o.addRouteParamsToUri({memberCode:u.member.code},l.urls.api.member.announcements),t={});var s=i.defer(),a=btoa(e+m.get("lang")),n=d.get(a);o.isEmpty(n)?f.get(e,t).then(function(e){var t={},n=[],r=[],i={};o.each(e.data.announcements,function(e){(i=o.extendOnly(new c.Announcements,e)).compileMessage(),n.push(i)}),o.each(e.data.categories,function(e){r.push(o.extendOnly(new c.AnnouncementCategories,e))}),t={announcement_list:n,category_list:r},o.isEmpty(t.category_list)||d.set(a,t,{TTL:18e4}),s.resolve(t)}).fail(function(e){s.reject(e)}):s.resolve(n);return s.promise},getCashierAnnouncements:function(){var e=o.addRouteParamsToUri({memberCode:u.member.code},l.urls.api.member.cashierPageAnnouncements),n=i.defer(),r=btoa(e+m.get("lang")),t=d.get(r);o.isEmpty(t)?f.get(e).then(function(e){var t=[];o.each(e.data.announcements,function(e){t.push(o.extendOnly(new c.CashierAnnouncement,e))}),o.isEmpty(t)||d.set(r,t,{TTL:18e4}),n.resolve(t)}).fail(function(e){n.reject(e)}):n.resolve(t);return n.promise}}})}(_,Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.Cache,Pt.Managers.Cookie,Pt.Managers.HttpClient),function(r,i,s,a,o,u){r.Class("Pt.Services.Members.AlipayTransferService",new function(){var n=r.addRouteParamsToUri({memberCode:a.member.code,methodId:1204131},s.urls.api.member.onlineDepositsV3);return n=u.replaceV3Tags(n),{createTransaction:function(e){var t=i.defer();return u.post(n,e).then(function(e){t.resolve(e.data.transactionId)}).fail(function(e){t.reject(e)}),t.promise},getTransaction:function(e){var t=r.addRouteParamsToUri({memberCode:a.member.code,methodId:1204131,transactionId:e},s.urls.api.member.transactions),n=i.defer();return u.get(t).then(function(e){n.resolve(r.extendOnly(new o.AlipayTransferTransaction,e.data))}).fail(function(e){n.reject(e)}),n.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Managers.HttpClient),function(i,s,a,o,e,u){i.Class("Pt.Services.Members.OfflineTransferService",new function(){return{createTransaction:function(e,t){var n=s.defer(),r=i.addRouteParamsToUri({memberCode:o.member.code,methodId:":methodId"},a.urls.api.member.offlineTransfer);return u.post(i.str_replace_key({":methodId":t},r),e).then(function(e){n.resolve(e.data.transaction.transactionId)}).fail(function(e){n.reject(e)}),n.promise},createTransactionV3:function(e,t){var n=s.defer(),r=i.addRouteParamsToUri({memberCode:o.member.code,methodId:":methodId"},a.urls.api.member.offlineTransferV3);return r=u.replaceV3Tags(r),u.post(i.str_replace_key({":methodId":t},r),e).then(function(e){n.resolve(e.data.transactionId)}).fail(function(e){n.reject(e)}),n.promise},getTransaction:function(e,t){var n=i.addRouteParamsToUri({memberCode:o.member.code,methodId:t,transactionId:e},a.urls.api.member.transactions),r=s.defer();return u.get(n).then(function(e){r.resolve(e.data)}).fail(function(e){r.reject(e)}),r.promise},createQRTransaction:function(e,t){var n=s.defer(),r=i.addRouteParamsToUri({memberCode:o.member.code,methodId:":methodId"},a.urls.api.member.offlineTransfer);return u.post(i.str_replace_key({":methodId":t},r),e).then(function(e){n.resolve(e.data.transaction)}).fail(function(e){n.reject(e)}),n.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Managers.HttpClient),function(s,a,o,u,l){"use strict";s.Class("Pt.Services.Members.BalanceService",new function(){return{getByWalletId:function(e){var t=s.addRouteParamsToUri({memberCode:u.member.code,walletId:e},o.urls.api.member.balance),n=a.defer();return l.get(t,[],"json",{timeout:4e4}).then(function(e){var t=s.extendOnly(new Pt.Contracts.Balance,e.data.balance);return n.resolve({balance:t})}).fail(function(e){n.reject(e)}),n.promise},getByWalletPromise:function(r){var t=[],n="",i=a.defer();return s.each(r,function(e){n=s.addRouteParamsToUri({memberCode:u.member.code,walletId:e.id},o.urls.api.member.balance),t.push(l.get(n,[],"json",{timeout:4e4}))}),a.all(t).then(function(n){s.each(r,function(t){var e=s.find(n,function(e){return e.data.balance.wallet_id===t.id});s.isEmpty(e)||(t.balance=e.data.balance.amount),i.resolve(r)}),i.resolve(r)}).fail(function(e){i.reject(e)}),i.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient),function(a,o,u,e,l,c){"use strict";a.Class("Pt.Services.Members.BankingAddressService",new function(){var s={};return{getProvinces:function(){var n=o.defer(),e=u.urls.api.member.bankingProvinces,r=this,i=window.btoa(e);return a.isUndefined(s[i])?c.get(e).then(function(e){var t=[];a.size(e.data)&&(t=a.map(e.data,function(e){var t=new l.BankingProvince;return t.set("id",a.propertyValue(e,"provinceId")),t.set("name",a.propertyValue(e,"provinceName")),t.set("nativeName",a.propertyValue(e,"provinceNameNative")),t.getCities=function(){return r.getCities(this.id)},t})),s[i]=t,n.resolve(t)}).fail(function(e){n.reject(e)}):n.resolve(s[i]),n.promise},getCities:function(e){var n=o.defer(),r=this,t=a.addRouteParamsToUri({provinceId:e},u.urls.api.member.bankingCities),i=window.btoa(t);return a.isUndefined(s[i])?c.get(t).then(function(e){var t=[];a.size(e.data)&&(t=a.map(e.data,function(e){var t=new l.BankingCity;return t.set("id",a.propertyValue(e,"cityId")),t.set("name",a.propertyValue(e,"cityName")),t.set("nativeName",a.propertyValue(e,"cityNameNative")),t.set("provinceId",a.propertyValue(e,"provinceId")),t.getDistricts=function(){return r.getDistricts(this.id)},t}),s[i]=t,n.resolve(t))}).fail(function(e){n.reject(e)}):n.resolve(s[i]),n.promise},getDistricts:function(e){var n=o.defer(),t=a.addRouteParamsToUri({cityId:e},u.urls.api.member.bankingDistricts),r=window.btoa(t);return a.isUndefined(s[r])?c.get(t).then(function(e){var t=[];a.size(e.data)&&(t=a.map(e.data,function(e){var t=new l.BankingDistrict;return t.set("id",a.propertyValue(e,"districtId")),t.set("name",a.propertyValue(e,"districtName")),t.set("cityId",a.propertyValue(e,"cityId")),t.set("nativeName",a.propertyValue(e,"districtNameNative")),t})),s[r]=t,n.resolve(t)}).fail(function(e){n.reject(e)}):n.resolve(s[r]),n.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Managers.HttpClient),function(c,a,o,n,d,r,e,t,u){"use strict";c.Class("Pt.Services.Members.BankService",new function(){var e=o.urls.cms.bankingOptions;return{getBanks:t,getSystemBankAccounts:function(){var e=s(o.urls.api.member.systemBankAccounts),n=a.defer();return u.get(e).then(function(e){var t=[];0<e.data.systemBankAccounts.length&&c.each(e.data.systemBankAccounts,function(e){t.push(c.extendOnly(new d.SystemBankAccount,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getBankingOptions:function(){var t=a.defer();return u.get(e,null,null,{store:!0}).then(function(e){var n=[];c.each(e.data,function(e,t){n.push(c.extendOnly(new d.BankingOption,{code:t,name:e}))}),t.resolve(n)}).fail(function(e){t.reject(e)}),t.promise},getBankDetail:function(){var e=s(o.urls.api.member.bankingDetail),r=a.defer();return t().then(function(n){u.get(e).then(function(e){var t=null;c.isEmpty(e.data)?t=new d.BankDetail:(t=c.extendOnly(new d.BankDetail,e.data.bankDetails),c.findWhere(n,{bankCode:t.get("bankCode")})&&t.bankSupported()),r.resolve(t)}).fail(function(e){r.reject(e)})}),r.promise},updateBankDetail:function(e){var t=s(o.urls.api.member.bankingDetail),n=a.defer();return u.put(t,e).then(function(e){n.resolve(c.extendOnly(new d.Generic,e))}).fail(function(e){n.reject(e)}),n.promise},getBankingList:function(e){var n=a.defer(),t=o.urls.api.member.bankingDetails;return u.get(t).then(function(e){var t=i(e);n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getBankAccount:function(e){var t=a.defer(),n=c.addRouteParamsToUri({accountId:e},o.urls.api.member.bankingDetailsAccount);return u.get(n).then(function(e){e.data=l(e.data,"regular"),t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise},addBankAccount:function(e){var t=a.defer(),n=o.urls.api.member.bankingDetails;return u.post(n,e).then(function(e){t.resolve(i(e))}).fail(function(e){t.reject(e)}),t.promise},editBankAccount:function(e){var t=a.defer(),n="";c.each(e,function(e){"bankAccountId"===e.name&&(n=e.value)});var r=c.addRouteParamsToUri({accountId:n},o.urls.api.member.bankingDetailsAccount);return u.put(r,e).then(function(e){t.resolve(i(e))}).fail(function(e){t.reject(e)}),t.promise},deleteBankAccount:function(e){var t=a.defer(),n=c.addRouteParamsToUri({accountId:e},o.urls.api.member.bankingDetailsAccount);return u.del(n).then(function(e){t.resolve(i(e))}).fail(function(e){t.reject(e)}),t.promise},banksToModel:i};function i(e){var o={},t=r.funds.bankingDetails,u=e.data||e;return r.funds.currency_bankingDetails[n.member.currency]&&t.push(r.funds.currency_bankingDetails[n.member.currency]),c.each(t,function(t){if(c.has(u,t)){var e=u[t],n=new d.BankingList,r=c.propertyValue(e,"consumed",0),i=c.propertyValue(e,"limit",0),s=c.propertyValue(e,"accounts",[]);if(n.set("consumed",r),n.set("limit",i),n.set("allowed",i-r),n.set("active",c.size(s)),n.set("type",t),c.size(s)){var a=c.map(s,function(e){return l(e,t)});n.set("accounts",a)}o[t]=n}}),o}function t(){var e=s(o.urls.api.member.banks),n=a.defer();return u.get(e).then(function(e){var t=[];0<e.data.bankAccounts.length&&c.each(e.data.bankAccounts,function(e){t.push(c.extendOnly(new d.Bank,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise}function s(e){return c.addRouteParamsToUri({memberCode:n.member.code},e)}function l(e,t){var n=new(d[c.ucfirst(t)+"Bank"]);return n.set("bankAccountId",c.propertyValue(e,"bankAccountId")),n.set("bankAccountName",c.propertyValue(e,"bankAccountName").trim()),n.set("bankAccountNumber",c.propertyValue(e,"bankAccountNumber")),n.set("bankAddress",c.propertyValue(e,"bankAddress")),n.set("bankAddressId",c.propertyValue(e,"bankAddressId")),n.set("bankBranch",c.propertyValue(e,"bankBranch")),n.set("bankCode",c.propertyValue(e,"bankCode")),n.set("bankName",c.propertyValue(e,"bankName")),n.set("bankNameNative",c.propertyValue(e,"bankNameNative")),n.set("isPreferred",c.propertyValue(e,"isPreferred")),n.set("state",c.propertyValue(e,"state")),n}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Config,Pt.Managers.Cache,Pt.Managers.Cookie,Pt.Managers.HttpClient),function(a,o,u,l,c,d){"use strict";a.Class("Pt.Services.Members.BonusCodeService",new function(){var n=a.addRouteParamsToUri({memberCode:l.member.code},u.urls.api.member.bonusCodes);return{getAll:function(){var t=o.defer(),e=[c.get(u.urls.cms.walletConfig,null,null,{store:!0}),c.get(n)];return o.all(e).then(function(e){var n=[],r=e[0].data.product_wallets;a.each(e[1].data,function(e){var t=a.extendOnly(new d.BonusCode,e);t.get("productCode")in r&&t.set("walletId",+r[t.get("productCode")]),n.push(t)}),t.resolve(n)}).fail(function(e){t.reject(e)}),t.promise},getBonusCodeStatus:function(e,t,n){var r=o.defer(),i=a.addRouteParamsToUri({memberCode:l.member.code,promoCode:t},u.urls.api.member.promoCodeStatus),s={walletId:e,transferAmount:n};return c.get(i,s).then(function(e){var t=e.data,n=new d.PromoCodeStatus;n.set("code",t.statusCode).set("message",t.statusText).set("rolloverAmount",t.rolloverAmount),r.resolve(n)}).fail(function(e){r.reject(e)}),r.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient,Pt.Contracts),function(e,l,r,i,s,c,o){"use strict";l.Class("Pt.Services.Members.DepositService",function(){var e=l.addRouteParamsToUri({memberCode:i.member.code},s.urls.api.member.depositMethods),u=["select","radio","checkbox"],n={};return{getMethods:function(){var t=r.defer(),i=[];n.methods?t.resolve(n.methods):o.get(e).then(function(e){l.each(e.data,function(e){var n=l.extendOnly(new c.DepositMethod,e);if(function(e){var t={yeepay_card:function(e){var r=[];return l.each(e.cards,function(e,t){var n=new c.CardType;n.set("code",t.toUpperCase()).set("denominations",e),r.push(n)}),r},offline:function(e){var s={amountSelection:e.amount_selections?e.amount_selections:e.amount_selection,fieldSettings:[],channels:[]},t=e.available_channels;return t&&t.length&&(l.each(t,function(e){s.channels.push(l.extendOnly(new c.BankingOption,{code:e,name:l.trans("funds.offline_channel_"+e)}))}),delete e.available_channels),l.each(e,function(e,t){var n="true"===e[t+"_visibility"],r=null;r=n||"deposit_time"!==t?n||"deposit_date"!==t?e[t+"_default_value"]||null:moment().format("YYYY-MM-DD"):moment().format("hh:mm:ss");var i=l.extendOnly(new c.OfflineDepositField,{name:l.toCamelCase(t),shouldDisplay:n,defaultValue:r});s.fieldSettings.push(i)}),l.has(e,"processing_fee")&&(s.processing_fee=e.processing_fee),s},basic:a,bank_transfer:a},n=t[e.get("methodCode")];l.has(e.customFields,"web_recommended")&&(e.isRecommended=l.booleanString(e.customFields.web_recommended));l.has(e.customFields,"logo")&&(e.logo=e.customFields.logo);if(l.isFunction(n)){var r=n(e.get("customFields"));e.set("customFields",r)}var i=t[e.get("processType")];if(l.isFunction(i)){var s=i(e.get("customFields"));e.set("formFields",s)}}(n),n.isExcluded())return!1;if(n.isBankTransfer()){var r=[];l.each(e.banks,function(e){var t="banks."+n.get("methodCode")+"_"+e;r.push((new c.Bank).set("bankName",l.trans(t)).set("bankCode",e))}),n.set("supportedBanks",r)}i.push(n)}),n.methods=i,t.resolve(n.methods)}).fail(function(e){t.reject(e)});return t.promise},createOfflineTransaction:function(e){var n=r.defer(),t=o.replaceV3Tags(l.addRouteParamsToUri({memberCode:i.member.code},s.urls.api.member.offlineDepositV3));return o.post(t,e,"json",{contentType:!1,processData:!1}).then(function(e){if(+(e=l.propertyValue(e,"data",{})).invId<=0){var t=l.trans("errors.offline_deposit_error_"+e.invId);n.reject([t])}else n.resolve({transactionId:e.invId})}).fail(function(e){n.reject(e)}),n.promise},getPreferredBank:function(){var e=l.addRouteParamsToUri({memberCode:i.member.code,type:"deposit"},s.urls.api.member.preferredBank),n=r.defer();return o.get(e).then(function(e){try{var t=l.extendOnly(new c.DepositPreferredBank,e.data.tblDepositWireTransfer)}catch(e){t=new c.PreferredBank}n.resolve(t)}).fail(function(e){n.resolve(e)}),n.promise}};function a(e){var t=[];if(l.has(e,"form_fields"))try{e.form_fields=l.isArray(e.form_fields)?e.form_fields:[e.form_fields],t=l.filter(e.form_fields,function(e){return e.field_name}),t=l.map(t,function(e){var t=new c.FormFields,n=l.propertyValue(e,"field_name",null),r="private"===l.propertyValue(e,"encryption_type","private").toLowerCase(),i=(r?"csf_":"csfb_")+n,s=null;t.set("fieldName",i),t.set("encryptionType",l.propertyValue(e,"encryption_type","private")),l.isEmpty(l.propertyValue(e,"validation_rules",""))||(s=l.propertyValue(e,"validation_rules","").split("|")),t.set("validationRules",s);var a=l.propertyValue(e,"input_type",null);if(t.set("inputType",a),-1<l.indexOf(u,a)){var o=l.map(l.propertyValue(e,"selections",[]),function(e){return{value:e,label:l.trans("funds.csf_"+n.toLowerCase()+"_"+e.toLowerCase())}});t.set("selections",o)}return t})}catch(e){}return t}}())}(jQuery,_,Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient),function(s,a,r,e,t,o,u,l){"use strict";s.Class("Pt.Services.Members.FavoriteSlotGameService",new function(){var i=s.addRouteParamsToUri({memberCode:t.member.code},e.urls.api.member.favoriteSlotGames);return{getAll:function(e){return void 0!==e?(t=a.defer(),n().then(function(n){if(s.isEmpty(n))return t.resolve([]),this;var e=s.map(n,function(e){return e.gameId});l.Cms.GameService.getGamesByIds("slot_machines",e).then(function(e){s.each(e.items,function(e){var t=s.findWhere(n,{gameId:e.gameId});t&&(e.club=t.productCode),e.isFavorite=!0}),t.resolve(e.items)}).fail(function(e){t.resolve(e)})}).fail(function(e){t.reject(e)}),t.promise):n();var t},getByProductCode:function(e){return n(e)},addToFavorites:function(e,t){var n=a.defer(),r={gameId:e,productCode:t};return o.post(i,r).then(function(e){n.resolve(s.extendOnly(new u.SlotGame,e.data))}).fail(function(e){n.reject(e)}),n.promise},removeFromFavorites:function(e,t){var n=a.defer(),r={gameId:e,productCode:t,_method:"DELETE"};return o.post(i,r).then(function(){n.resolve(!0)}).fail(function(e){n.reject(e)}),n.promise}};function n(){var n=a.defer(),e=i,t=r.get("refreshCache");return arguments[0]&&(e+="/"+arguments[0]),e+="1"===t?"?refresh=true":"",o.get(e).then(function(e){var t=[];s.each(e.data,function(e){t.push(s.extendOnly(new u.SlotGame,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise}})}(_,Q,Pt.Managers.Cookie,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient,Pt.Contracts,Pt.Services),function(e,r,t,i,s){"use strict";e.Class("Pt.Services.Members.FreeBetClaimService",new function(){var n=e.addRouteParamsToUri({memberCode:i.member.code},t.urls.api.member.freeBetClaims);return{claim:function(e){var t=r.defer();return s.post(n,e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient),function(i,s,a,e,o,r){"use strict";i.Class("Pt.Services.Members.FundTransferService",new function(){var n=i.addRouteParamsToUri({memberCode:e.member.code},a.urls.api.member.fundTransfers);return{transfer:function(e){var t=s.defer();return o.post(n,e).then(function(e){t.resolve(i.extendOnly(new r.FundTransfer,e))}).fail(function(e){t.reject(e)}),t.promise},currencyConversion:function(e,t){var n="rmb"===t.toLowerCase()?i.addRouteParamsToUri({currencyFrom:e},a.urls.api.member.currencyConversionToRmb):i.addRouteParamsToUri({currencyFrom:e,currencyTo:t},a.urls.api.member.currencyConversion),r=s.defer();return o.get(n).then(function(e){r.resolve(e)}).fail(function(e){r.reject(e)}),r.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient,Pt.Contracts),function(o,u,l,c,d,m,r){"use strict";o.Class("Pt.Services.Members.HistoryService",new function(){var a={};return{getDepositWithdrawal:function(e){var t=o.addRouteParamsToUri({memberCode:c.member.code},l.urls.api.member.depositWithdrawalHistory),n=u.defer(),r={datetimeFrom:e.from,datetimeTo:e.to,paymentType:e.paymentType,paymentStatus:e.paymentStatus};return m.get(t,r).then(function(e){var t=[];o.each(e.data.histories,function(e){t.push(o.extendOnly(new d.DepositWithdrawalHistory,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getAdjustments:function(e){var n=u.defer(),t=o.addRouteParamsToUri({memberCode:c.member.code},l.urls.api.member.adjustmentsHistory),r={datetimeFrom:e.from,datetimeTo:e.to,paymentType:e.paymentType,paymentStatus:e.paymentStatus};return m.get(t,r).then(function(e){var t=[];o.each(e.data.histories,function(e){t.push(o.extendOnly(new d.AdjustmentsHistory,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getFundTransfer:function(e){var n=u.defer(),t=o.addRouteParamsToUri({memberCode:c.member.code},l.urls.api.member.fundTransferHistory),r={datetimeFrom:e.from,datetimeTo:e.to,transferType:e.transferType,transferStatus:e.transferStatus};return m.get(t,r).then(function(e){var t=[];o.each(e.data.histories,function(e){t.push(o.extendOnly(new d.FundTransferHistory,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getReferralBonus:function(e){var t=u.defer(),n=o.addRouteParamsToUri({memberCode:c.member.code},l.urls.api.member.referralBonusHistory),r={dateFrom:e.from,dateTo:e.to},i=btoa($.param(r)),s=a[i];o.isEmpty(s)?m.get(n,r).then(function(n){var r=[];if(0<n.data.histories.length)o.each(n.data.histories,function(e){var t=o.extendOnly(new d.ReferralBonusHistory,e);t=o.extend(t,n.data.report),r.push(t)});else{var e=new d.ReferralBonusHistory;e=o.extend(e,n.data.report),r.push(e)}r&&(a[i]=r),t.resolve(r)}).fail(function(e){t.reject(e)}):t.resolve(s);return t.promise},getPromotions:function(e){var n=u.defer(),t=o.addRouteParamsToUri({memberCode:c.member.code},l.urls.api.member.promotionsClaimsHistory),r={datetimeFrom:e.from,datetimeTo:e.to,transferType:e.transferType,transferStatus:e.transferStatus};return m.get(t,r).then(function(e){var t=[];o.each(e.data.histories,function(e){t.push(o.extendOnly(new d.PromotionHistory,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getPromotionsPage:function(e){var n=u.defer(),t=o.addRouteParamsToUri({memberCode:c.member.code},l.urls.api.member.promotionsPageClaimsHistory),r={datetimeFrom:e.from,datetimeTo:e.to};return m.get(t,r).then(function(e){var t=[];o.each(e.data.histories,function(e){t.push(o.extendOnly(new d.PromotionClaimsHistory,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getSpinwheelRedemptions:function(e){var n=u.defer(),t=r.replaceV3Tags(o.str_replace_key({":memberCode":c.member.code,":dateFrom":e.from,":dateTo":e.to},l.urls.api.member.spinwheelRedemptionsHistory));return m.get(t,{spinwheel:1}).then(function(e){var t=[];o.each(e.data,function(e){t.push(o.extendOnly(new d.SpinwheelRedemption,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Managers.HttpClient,Pt.Services.AbstractV3Service),function(a,o,u,l,c,d,e,m){"use strict";a.Class("Pt.Services.Members.MemberService",new function(){var s={};return{getMember:function(e){var t=a.addRouteParamsToUri({memberCode:u.member.code},l.urls.api.member.member),n=window.btoa(t),r=o.defer();if(a.isUndefined(s[n])||e)d.get(t).then(function(e){s[n]=e;var t=a.extendOnly(new c.Member,e);r.resolve(t)}).fail(function(e){r.reject(e)});else{var i=s[n];r.resolve(a.extendOnly(new c.Member,i))}return r.promise},create:function(e){var t=a.findIndex(e,{name:"memberSocialChatAcctId"}),n=l.urls.api.member.signup,r=a.getParameterByName("testAccount")?1:0;try{-1<t&&e[t].value&&(n=m.replaceV3Tags(l.urls.api.member.signupV3),r=!!a.getParameterByName("testAccount"))}catch(e){}var i=o.defer();return e.push({name:"testAccount",value:r}),d.post(n,e).then(function(e){i.resolve(a.extendOnly(new c.SignUp,e)),i.resolve(e)}).fail(function(e){i.reject(e)}),i.promise},quick:function(e){var t=l.urls.api.member.quickRegistration,n=o.defer();a.getParameterByName("testAccount")&&e.push({name:"testAccount",value:1});return d.post(t,e).then(function(e){n.resolve(e.data)}).fail(function(e){n.reject(e)}),n.promise},quickFinal:function(e){var t=l.urls.api.member.quickRegistrationFinalStep,n=o.defer();return d.post(t,e).then(function(e){n.resolve(e.data)}).fail(function(e){n.reject(e)}),n.promise},update:function(e){var t=a.addRouteParamsToUri({memberCode:u.member.code},l.urls.api.member.member),n=o.defer();return d.put(t,e).then(function(e){n.resolve(a.extendOnly(new c.MemberProfile,e))}).fail(function(e){n.reject(e)}),n.promise},updatePassword:function(e){var t=a.addRouteParamsToUri({memberCode:u.member.code},l.urls.api.member.updatePassword),n=o.defer();return d.put(t,e).then(function(e){n.resolve(a.extendOnly(new c.Generic,e))}).fail(function(e){n.reject(e)}),n.promise},updateDeliveryAddress:function(e){var t=a.addRouteParamsToUri({memberCode:u.member.code},l.urls.api.member.deliveryAddress),n=o.defer();return d.put(t,e).then(function(e){n.resolve(a.extendOnly(new c.MemberProfile,e.data.member))}).fail(function(e){n.reject(e)}),n.promise},referrals:function(e){var t=a.addRouteParamsToUri({memberCode:u.member.code},l.urls.api.member.referrals),n=o.defer();return d.post(t,e).then(function(e){n.resolve(a.extendOnly(new c.Generic,e))}).fail(function(e){n.reject(e)}),n.promise},rewards:function(){var t=o.defer(),e=m.replaceV3Tags(a.str_replace_key({":memberCode":u.member.code},l.urls.api.member.rewards));return d.get(e).then(function(e){t.resolve(a.extendOnly(new c.Rewards,e.data))}).fail(function(e){t.resolve(a.extendOnly(new c.Rewards,{}))}),t.promise}}})}(_,Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient,Pt.Managers.Cache,Pt.Services.AbstractV3Service),function(r,e,i,s,a){"use strict";_.Class("Pt.Services.Members.PaymentSettingService",new function(){return{transactionLimits:function(e){var t=i.urls.api.member.paymentTransactionLimits,n=r.defer();return a.get(t,e).then(function(e){var t=new s.TransactionLimit;t.set("transType",e.data.transType),t.set("frequency",e.data.frequency),t.set("limitAmount",e.data.limitAmount),t.set("validFrom",e.data.validFrom),t.set("validTo",e.data.validTo),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},setTransactionLimits:function(e){var t=i.urls.api.member.paymentTransactionLimits,n=r.defer();return a.put(t,e).then(function(e){n.resolve(_.extendOnly(new s.Generic,e))}).fail(function(e){n.reject(e)}),n.promise}}})}(Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient),function(u,l,c,d,m,f,p){"use strict";function e(e){var t=u.str_replace_key({":memberCode":c.member.code},d.urls.api.member.privateMessagesBulkDelete),n=l.defer();return p.post(t,e).then(function(e){n.resolve(e)}).fail(function(e){n.reject(e)}),n.promise}u.Class("Pt.Services.Members.PrivateMessageService",new function(){var o=c.member.code+"-private-messages",i=c.member.code+"-unread-message";return{getUnread:function(e){var r=l.defer(),t=m.get(i);e=e||!1,u.isEmpty(t)||e?n().then(function(e){var t=u.where(e,{status:0}),n={unread:t.length};m.set(i,n,{TTL:18e4}),r.resolve(n)}):r.resolve(t);return r.promise},getSubjects:function(){var e=u.addRouteParamsToUri({memberCode:c.member.code},d.urls.api.member.privateMessageSubjects),n=l.defer();return p.get(e).then(function(e){var t=[];u.each(e.data.message_subjects,function(e){t.push(u.extendOnly(new f.PrivateMessageSubject,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getPrivateMessages:n,getMessage:function(s){var e=u.addRouteParamsToUri({memberCode:c.member.code,messageId:s},d.urls.api.member.privateMessage),a=l.defer();return p.get(e).then(function(e){if(!e.data.private_messages.length)return a.resolve(new f.PrivateMessage),this;var t=e.data.private_messages[0],n=[],r=u.extendOnly(new f.PrivateMessage,t);if(u.each(r.replies,function(e){n.push(u.extendOnly(new f.PrivateMessage,e))}),r.replies=n,m.get(o)){var i=m.get(o);i=u.map(i,function(e){return e.messageId===s&&"1"!==e.status&&(e.status="1"),e}),m.set(o,i,{TTL:18e4})}a.resolve(r)}).fail(function(e){a.reject(e)}),a.promise},sendMessage:function(e,t){var n=u.addRouteParamsToUri({memberCode:c.member.code,messageId:e},d.urls.api.member.privateMessage),r=o,i=l.defer();return p.post(n,t).then(function(e){m.remove(r),i.resolve(u.extendOnly(new f.Generic,e))}).fail(function(e){i.reject(e)}),i.promise},deleteMessage:function(e){var t=u.addRouteParamsToUri({memberCode:c.member.code,messageId:e},d.urls.api.member.privateMessage),n=l.defer();return p.del(t).then(function(e){m.remove(o),n.resolve(u.extendOnly(new f.Generic,e))}).fail(function(e){n.reject(e)}),n.promise},markAsImportant:function(e,t){var n=u.addRouteParamsToUri({memberCode:c.member.code,messageId:e},d.urls.api.member.privateImportant),r=l.defer();return p.put(n,{flagImportant:t}).then(function(e){m.remove(o),r.resolve(u.extendOnly(new f.Generic,e))}).fail(function(e){r.reject(e)}),r.promise},bulkDelete:e};function n(e){var t=u.addRouteParamsToUri({memberCode:c.member.code},d.urls.api.member.privateMessages),n=l.defer(),r=o,i=m.get(r);if(e=e||!1,u.isEmpty(i)||e)p.get(t,{limit:1e3,page:1}).then(function(e){var t=[];u.each(e.data.private_messages,function(e){t.push(u.extendOnly(new f.PrivateMessage,e))}),m.set(r,t,{TTL:18e4}),n.resolve(t)}).fail(function(e){n.reject(e)});else{var s=i.map(function(e){return u.extendOnly(new f.PrivateMessage,e)});n.resolve(s)}return n.promise}})}(_,Q,Pt.Settings,Pt.Endpoints,Pt.Managers.Cache,Pt.Contracts,Pt.Managers.HttpClient),function(e,s,t,n,a){"use strict";e.Class("Pt.Services.Members.PromotionClaimService",new function(){var i=e.addRouteParamsToUri({memberCode:n.member.code},t.urls.api.member.promotionClaims);return{claim:function(e,t){var n=s.defer(),r={subjectCode:e,comment:t};return a.post(i,r).then(function(e){n.resolve(e.message)}).fail(function(e){n.reject(e)}),n.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient),function(m,f,p,h,g,e,v){"use strict";m.Class("Pt.Services.Members.RebateService",new function(){var n=m.addRouteParamsToUri({memberCode:h.member.code},p.urls.api.member.rebateClaims),r=m.addRouteParamsToUri({memberCode:h.member.code},p.urls.api.member.rebateSummaryPerProduct),t=m.addRouteParamsToUri({memberCode:h.member.code},p.urls.api.member.promotionClaims),i={subjectCode:null,comment:"rebate"};return{getMondaySelection:function(e){for(var t=[],n=0,r=null,i=void 0,s=e||moment(new Date).format("YYYY-MM-DD");n<5;n++){if(-1<(r=i?i.day(-2).startOf("isoWeek").isoWeekday(1):moment().startOf("isoWeek").isoWeekday(1)).diff(new Date(s),"days")){var a=moment(r.format("YYYY-MM-DD"));a=m.extend(a,{getLabel:function(){var e=this.format("gggg")+" "+m.trans("rebates.label_year")+" "+this.isoWeek()+" "+m.trans("rebates.label_week");return moment(new Date).isoWeek()===this.isoWeek()&&(e+=" "+m.trans("rebates.label_current_week")),e},canClaim:function(){var e=+moment(new Date).isoWeek();return e===+this.isoWeek()||e-1===this.isoWeek()},isCurrentWeek:function(){return+moment(new Date).isoWeek()==+this.isoWeek()}}),t.push(a)}i=r}return t},getRebateSettings:function(){var t=f.defer();return e.Cms.WidgetService.get("rebate_settings").then(function(e){t.resolve(new g.RebateSettings(e))}),t.promise},getRebateSummaries:function(e,t){var n=f.defer();e.canClaim()?(o=n,l=[],c=[],d=(a=t).currentPeriod._i,m.each(a.products,function(e){m.each(e,function(e){u=m.addRouteParamsToUri({memberCode:h.member.code,product:e.get("claimCode"),date:d,period:1},p.urls.api.member.newRebateSummaryPerProduct),l.push(v.get(u))})}),f.allSettled(l).then(function(e){m.each(e,function(e){if("rejected"===e.state&&!m.isEmpty(m.findWhere(e.reason,{code:404})))return!1;c.push(e.value.data)}),m.each(a.products,function(e,n){var r=[];m.each(e,function(e){var t=m.findWhere(c,{productCode:e.productCode});t&&("sportsbook"===n&&(t=m.extendOnly(e,t)),r.push(m.extendOnly(new g.RebateProduct,t)))}),m.isEmpty(r)?delete a.products[n]:a.products[n]=r}),o.resolve(a.products)})):(r=e,i=n,s=m.addRouteParamsToUri({memberCode:h.member.code,date:r._i,period:1},p.urls.api.member.newRebateStatements),v.get(s).then(function(e){m.each(e.data,function(n){m.each(n,function(e,t){n[t]=m.extendOnly(new g.RebateProduct,e)})}),i.resolve(e.data)}));var r,i,s;var a,o,u,l,c,d;return n.promise},getRebatePerProduct:function(e){var t=f.defer();return v.get(r+e).then(function(e){t.resolve(m.extendOnly(new g.RebateProduct,e.data))}).fail(function(){}),t.promise},getRebatePromoCodeStatus:function(e){var n=f.defer();if(m.isArray(e))return f.allSettled(m.map(e,function(e){return s(e)})).then(function(e){var t=m.map(e,function(e,t){if("fulfilled"===e.state)return e.value;var n=new g.PromoCode;return n.set("claimable",!1),n.set("rebateCode",n[t]),n});n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise;return s(e).then(function(e){n.resolve(e)}).fail(function(e){n.reject(e)}),n.promise},instantClaim:function(e){var t=f.defer();return v.post(n,e).then(function(){t.resolve(!0)}).fail(function(e){t.reject(e)}),t.promise},weeklyClaim:function(r){var n=f.defer();m.isString(r)&&(r=[r]);return f.allSettled(m.map(r,function(e){return v.post(t,m.extend(i,{subjectCode:e}))})).then(function(e){var t=m.map(e,function(e,t){var n=new g.PromoClaim;return n.set("claimed","fulfilled"===e.state),n.set("promoCode",r[t]),n});n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getDailyRebateSummaries:function(e,t){var n=f.defer();moment(e)>=moment().subtract(2,"days")?(a=e,o=t,u=n,c=[],d=[],m.each(o.daily_rebate_products,function(e){m.each(e,function(e){l=m.addRouteParamsToUri({memberCode:h.member.code,product:e.get("claimCode"),date:a,period:2},p.urls.api.member.newRebateStatementPerProduct),c.push(v.get(l))})}),f.allSettled(c).then(function(e){m.each(e,function(e){if("rejected"===e.state&&!m.isEmpty(m.findWhere(e.reason,{code:404})))return!1;d.push(e.value.data)}),m.each(o.daily_rebate_products,function(e,n){var r=[];m.each(e,function(e){var t=m.findWhere(d,{productCode:e.productCode});t&&("sportsbook"===n&&(t=m.extendOnly(e,t)),r.push(m.extendOnly(new g.RebateProduct,t)))}),m.isEmpty(r)?delete o.daily_rebate_products[n]:o.daily_rebate_products[n]=r}),u.resolve(o.daily_rebate_products)})):(r=e,i=n,s=m.addRouteParamsToUri({memberCode:h.member.code,date:r,period:2},p.urls.api.member.newRebateStatements),v.get(s).then(function(e){m.each(e.data,function(n){m.each(n,function(e,t){n[t]=m.extendOnly(new g.RebateProduct,e)})}),i.resolve(e.data)}));var r,i,s;var a,o,u,l,c,d;return n.promise}};function s(e){var n=f.defer(),t=m.addRouteParamsToUri({memberCode:h.member.code,promoCode:e},p.urls.api.member.rebatePromoCodeStatus);return v.get(t).then(function(e){if(m.has(e,"data")){var t=new g.PromoCode;t.set("claimable",e.data.claimable),t.set("rebateCode",e.data.rebateCode),n.resolve(t)}}).fail(function(e){n.reject(e)}),n.promise}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Services,Pt.Managers.HttpClient),function(r,i,s,a,e,o){r.Class("Pt.Services.Members.SDAPayService",new function(){var n=r.addRouteParamsToUri({memberCode:a.member.code,methodId:120254},s.urls.api.member.onlineDeposits);return{createTransaction:function(e){var t=i.defer();return o.post(n,{transferAmount:e}).then(function(e){t.resolve(e.data.transaction.transactionId)}).fail(function(e){t.reject(e)}),t.promise},getTransaction:function(e){var t=r.addRouteParamsToUri({memberCode:a.member.code,methodId:120254,transactionId:e},s.urls.api.member.transactions),n=i.defer();return o.get(t).then(function(e){n.resolve(e.data)}).fail(function(e){n.reject(e)}),n.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Managers.HttpClient),function(a,o,e,t,u,l,c,d){"use strict";a.Class("Pt.Services.Members.SlotGameHistoryService",new function(){var i=a.addRouteParamsToUri({memberCode:t.member.code},e.urls.api.member.slotGameHistory),s="refreshHistoryCache",r=function(){return 1==d.get(s)};return{getAll:function(e){return void 0!==e?(t=o.defer(),n().then(function(n){if(a.isEmpty(n))return t.resolve([]),this;var e=a.map(n,function(e){return e.gameId});c.Cms.GameService.getGamesByIds("slot_machines",e).then(function(e){a.each(e.items,function(e){var t=a.findWhere(n,{gameId:e.gameId});t&&(e.club=t.productCode)}),t.resolve(e.items)}).fail(function(e){t.resolve(e)})}).fail(function(e){t.reject(e)}),t.promise):n();var t},getByProductCode:function(e){return n(e)},addToHistory:function(e,t){var n=o.defer(),r={gameId:e,productCode:t};return u.post(i,r).then(function(e){d.set({name:s,value:1}),n.resolve(a.extendOnly(new l.SlotGame,e.data))}).fail(function(e){n.reject(e)}),n.promise}};function n(){var n=o.defer(),e=i,t={dateFrom:moment(new Date/1e3).format("YYYY-MM-DD"),dateTo:moment().format("YYYY-MM-DD")};return arguments[0]&&(e+="/"+arguments[0]),r()&&(t.refresh=!0),u.get(e,t).then(function(e){var t=[];a.each(e.data,function(e){t.push(a.extendOnly(new l.SlotGame,e))}),r()&&d.remove({name:s}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient,Pt.Contracts,Pt.Services,Pt.Managers.Cookie),function(a,n,r,o,u,l,c){"use strict";a.Class("Pt.Services.Members.WalletService",new function(){var t=a.addRouteParamsToUri({memberCode:o.member.code},r.urls.api.member.wallets),s=[];return{getAll:e,getWalletsWithBalance:function(){var i=n.defer();return e().then(function(r){var e=a.map(r,function(e){return c.getByWalletId(e.get("id"))});n.allSettled(e).then(function(e){e=a.map(e,function(e){return e.value});var n=a.flatten(a.map(e,a.values)),t=a.map(r,function(e){var t=a.findWhere(n,{wallet_id:e.id});return t&&e.set("balance",t.amount).set("currency",t.currency),e});i.resolve(t)})}).fail(function(e){i.reject(e)}),i.promise}};function e(){var i=n.defer();if(s.length)i.resolve(s);else{var e=[u.get(t),u.get(r.urls.cms.walletConfig,null,null,{store:!0})];n.all(e).then(function(e){var t=e[0].data.wallets,n=a.map(e[1].data.wallets,Number),r=[];a.each(t,function(e){!a.contains(n,e.id)||20===e.id&&"RMB"!==o.member.currency||(e.name=a.trans("wallets.id_"+e.id),r.push(a.extendOnly(new l.Wallet,e)))}),s=r,i.resolve(r)}).fail(function(e){i.reject(e)})}return i.promise}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient,Pt.Contracts,Pt.Services.Members.BalanceService),function(e,r,i,s,a,o,u){"use strict";r.Class("Pt.Services.Members.WithdrawalService",new function(){return{getMethods:function(){var e=r.addRouteParamsToUri({memberCode:s.member.code},a.urls.api.member.withdrawalMethods),n=i.defer();return u.get(e).then(function(e){var t=[];r.each(e.data.paymentMethods,function(e){-1<l.indexOf(e.methodId)&&t.push(r.extendOnly(new o.WithdrawalMethod,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getPreferredBank:function(){var e=r.addRouteParamsToUri({memberCode:s.member.code,type:"withdrawal"},a.urls.api.member.preferredBank),n=i.defer();return u.get(e).then(function(e){try{var t=r.extendOnly(new o.WithdrawalPreferredBank,response.data.tblWithdrawalWireTransfer)}catch(e){t=new o.WithdrawalPreferredBank}n.resolve({tblWithdrawalWireTransfer:t})}).fail(function(e){n.resolve(e)}),n.promise},withdraw:function(e){var t=r.addRouteParamsToUri({memberCode:s.member.code},a.urls.api.member.withdrawal),n=i.defer();return u.post(t,e).then(function(e){n.resolve(r.extendOnly(new o.Generic,e))}).fail(function(e){n.reject(e)}),n.promise},getTransactions:function(e){var t=r.addRouteParamsToUri({memberCode:s.member.code,transactionStatus:e},a.urls.api.member.withdrawalTransactions),n=i.defer();return u.get(t).then(function(e){var t=[];r.isArray(e.data)?r.each(e.data,function(e){t.push(r.extendOnly(new o.WithdrawalTransaction,e))}):""!==e.data&&t.push(r.extendOnly(new o.WithdrawalTransaction,e.data)),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},cancelTransaction:function(e){var t=r.addRouteParamsToUri({memberCode:s.member.code,methodId:e.methodId},a.urls.api.member.cancelWithdrawal),n=i.defer();return u.del(t,e).then(function(e){n.resolve(r.extendOnly(new o.Generic,e))}).fail(function(e){n.reject(e)}),n.promise}}});var l=["210602","2208963","2208969"]}(jQuery,_,Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient),function(r,t,i,s){r.Class("Pt.Deposit.DepositLauncherService",new function(){return{launch:function(e){var n=e.launcherUrl;n+="?transferAmount="+e.amount,e.custom&&r.each(e.custom,function(e,t){r.isArray(e)?r.each(e,function(e){n+="&"+t+"[]="+e}):n+="&"+t+"="+e});n+="&acceptLanguage="+s.get("lang"),n+="&errorUrl="+location.origin+t.depositErrorPage+e.methodId,n+="&token="+s.get("pt_token"),n+="&cmsId="+r.propertyValue(i,"operator.cmsId",""),window.open(n,e.title||"Deposit","width="+(e.width||1e3)+", height="+(e.height||800))}}})}(_,Pt.Config,Pt.Settings,Pt.Managers.Cookie),function(s,a,o,u,l,i){s.Class("Pt.Services.Members.ScratchCardService",new function(){return{getDenominations:function(e){var t=a.defer(),n=s.addRouteParamsToUri({memberCode:u.member.code,methodId:e},o.urls.api.member.scratchCardDenominations),r=new i;return l.get(n).then(function(e){r.set("denominations",e?e.data:[]),t.resolve(r)}).fail(function(e){t.reject(e)}),t.promise},createTransaction:function(e,t){var n=s.addRouteParamsToUri({memberCode:u.member.code,methodId:t},o.urls.api.member.onlineDeposits),r=a.defer();return l.post(n,e).then(function(e){r.resolve(e.data.transaction.transactionId)}).fail(function(e){r.reject(e)}),r.promise},createWithdrawalTransaction:function(e,t){var n=s.addRouteParamsToUri({memberCode:u.member.code,methodId:t},o.urls.api.member.onlineWithdrawals),r=a.defer();return l.post(n,e).then(function(e){r.resolve(s.propertyValue(e,"data.transaction.id","0"))}).fail(function(e){r.reject(e)}),r.promise},validateTransaction:function(e,t){var n=s.addRouteParamsToUri({memberCode:u.member.code,methodId:t},o.urls.api.member.scratchCardValidate),r=a.defer();return l.post(n,e).then(function(e){r.resolve(e.data)}).fail(function(e){r.reject(e)}),r.promise},getQuantity:function(e){var r=a.defer(),t=s.addRouteParamsToUri({memberCode:u.member.code,methodId:e},o.urls.api.member.scratchCardQuantity),i=[1];return l.get(t).then(function(e){var t=s.propertyValue(e,"data",1);i=[];for(var n=1;+n<=+t;)i.push(n),n++;r.resolve(i)}).fail(function(e){r.resolve(i)}),r.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient,Pt.Contracts.ScratchCardDenominations),function(r,i,s,a,o){r.Class("Pt.Services.Members.MPayService",new function(){return{createTransaction:function(e){var t=r.addRouteParamsToUri({memberCode:a.member.code,methodId:1204769},s.urls.api.member.onlineDeposits),n=i.defer();return o.post(t,e).then(function(e){n.resolve(e.data.transaction)}).fail(function(e){n.reject(e)}),n.promise},getTransactionDetails:function(e){var t=r.addRouteParamsToUri({memberCode:a.member.code,methodId:1204769,transactionId:e.transactionId},s.urls.api.member.transactions),n=i.defer();return o.get(t).then(function(e){n.resolve(e.data)}).fail(function(e){n.reject(e)}),n.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient),function(r,i,s,a,o){"use strict";r.Class("Pt.Services.Members.GameAuthenticationService",new function(){return{login:function(e){var t=i.defer(),n=r.addRouteParamsToUri({memberCode:a.member.code},s.urls.api.member.gameExternalAuth);return o.post(n,e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient),function(r,i,s,a,n,e,o,u){"use strict";r.Class("Pt.Services.Members.VerificationService",new function(){return{safetyRating:function(){var t=i.defer(),e=r.addRouteParamsToUri({pubkey:a.public_key,lang:o.get("lang"),msId:a.operator.msId,cmsId:a.operator.cmsId,memberCode:a.member.code},s.urls.api.member.safetyRating);return u.get(e).then(function(e){t.resolve(r.extendOnly(new n.SafetyRating,e.data))}).fail(function(e){t.reject(e)}),t.promise},verifyEmail:function(){var t=i.defer(),e=r.addRouteParamsToUri({pubkey:a.public_key,lang:o.get("lang"),msId:a.operator.msId,cmsId:a.operator.cmsId,memberCode:a.member.code},s.urls.api.member.sendEmailVerification);return u.post(e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise},verifySms:function(){var t=i.defer(),e=r.addRouteParamsToUri({pubkey:a.public_key,lang:o.get("lang"),msId:a.operator.msId,cmsId:a.operator.cmsId,memberCode:a.member.code},s.urls.api.member.sendSmsVerification);return u.post(e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise},sendSmsCode:function(e){var t=i.defer(),n=r.addRouteParamsToUri({pubkey:a.public_key,lang:o.get("lang"),msId:a.operator.msId,cmsId:a.operator.cmsId,memberCode:a.member.code},s.urls.api.member.verifySmsCode);return u.post(n,e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise},sendEmailCode:function(e){var t=i.defer(),n=r.addRouteParamsToUri({pubkey:a.public_key,lang:o.get("lang"),msId:a.operator.msId,cmsId:a.operator.cmsId,memberCode:a.member.code},s.urls.api.member.verifyEmailCode);return u.post(n,e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Config,Pt.Managers.Cookie,Pt.Managers.HttpClient),function(i,s,r,e,a,t,o,u,l){"use strict";i.Class("Pt.Services.Members.CustomPromotionService",new function(){return{checkRedEnvelopeEligibility:function(e){var t=i.str_replace_key({":promotion":e,":msId":Pt.Settings.operator.msId,":cmsId":Pt.Settings.operator.cmsId,":lang":o.get("lang"),":pubkey":Pt.Settings.public_key},u.urls.api.member.checkCustomPromotionEligibility),n=s.defer();return i.booleanString(i.propertyValue(r,"service_toggle.checkCustomPromotionEligibility","true"))?l.get(t).then(function(e){n.resolve(i.extendOnly(new a.CustomPromotion,e))}).fail(function(e){n.reject(e)}):n.resolve(i.extendOnly(new a.CustomPromotion,{})),n.promise},claim:function(e,t){var n=i.str_replace_key({":promotion":e,":msId":Pt.Settings.operator.msId,":cmsId":Pt.Settings.operator.cmsId,":lang":o.get("lang"),":pubkey":Pt.Settings.public_key},u.urls.api.member.customPromotionClaim),r=s.defer();if(i.isEmpty(t.claimCode))return o.set({name:"red-packet-not-eligible",value:Pt.Settings.member.code,expires:t.expiry}),r.resolve(t),r.promise;return l.post(n,t).then(function(e){r.resolve(e)}).fail(function(e){r.reject(e)}),r.promise}}})}(_,Q,Pt.Settings,Pt.Config,Pt.Contracts,Pt.Managers.Cache,Pt.Managers.Cookie,Pt.Endpoints,Pt.Managers.HttpClient),function(r,i,s,a,o){r.Class("Pt.Services.Members.LeaderboardService",new function(){return{getLeaderboard:function(e){var t=i.defer(),n=r.addRouteParamsToUri({club:e},s.urls.api.member.leaderboard);return a.get(n).then(function(e){t.resolve(r.extendOnly(new o,e.data))}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Endpoints,Pt.Managers.HttpClient,Pt.Contracts.Leaderboard),function(r,i,s,a,o){"use strict";r.Class("Pt.Services.Members.SpinWheelService",new function(){return{getPrizes:function(){var t=i.defer(),e=r.addRouteParamsToUri({memberCode:a.member.code},s.urls.api.member.spinWheelItems);return o.get(e).then(function(e){t.resolve(e.data)}).fail(function(e){t.reject(e)}),t.promise},claim:function(e){var t=i.defer(),n=r.addRouteParamsToUri({memberCode:a.member.code},s.urls.api.member.spinWheelClaim);return o.post(n,e).then(function(e){t.resolve(e.data)}).fail(function(e){t.resolve(e)}),t.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient),function(e,n,r,i,s){"use strict";e.Class("Pt.Services.Members.HotMatchFeedService",new function(){return{get:function(e){var t=n.defer(),e=s.replaceV3Tags(i.urls.api.member.hotMatchFeed);return r.get(e).then(function(e){t.resolve(e.data)}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Managers.HttpClient,Pt.Endpoints,Pt.Services.AbstractV3Service),function(r,i,s,a,o,u){"use strict";function e(e){var t,n=i.defer();return t=o.replaceV3Tags(r.str_replace_key({":vendor":"idnpoker"},s.urls.api.member.gameVendorAccount)),a.post(t,e).then(function(e){n.resolve(r.extendOnly(new u,e.data))}).fail(function(e){n.reject(e)}),n.promise}function t(){var e,t=i.defer();return e=o.replaceV3Tags(r.str_replace_key({":vendor":"idnpoker"},s.urls.api.member.gameVendorAccount)),a.get(e).then(function(e){t.resolve(r.extendOnly(new u,e.data))}).fail(function(e){t.reject(e)}),t.promise}function n(e){var t,n=i.defer();return t=o.replaceV3Tags(r.str_replace_key({":vendor":"idnpoker"},s.urls.api.member.gameVendorAccount)),a.post(t+"/password",e).then(function(e){n.resolve(r.extendOnly(new u,e.data))}).fail(function(e){n.reject(e)}),n.promise}r.Class("Pt.Services.Members.GameIntegration",new function(){return{createIDNPokerAccount:e,getIDNPokerAccount:t,updateIDNPokerAccountPassword:n}})}(_,Q,Pt.Endpoints,Pt.Managers.HttpClient,Pt.Services.AbstractV3Service,Pt.Contracts.IDNPokerAccount),function(s,a,o,u,l,e,c,r){"use strict";s.Class("Pt.Services.Cms.WidgetService",new function(){var i={};return{get:function(e){var n=s.addRouteParamsToUri({widget:e,operatorId:u.operator.cmsId,lang:l.get("lang")},o.urls.cms.widget),r=a.defer();if(!s.booleanString(s.propertyValue(u,"service_toggle."+e,"true")))return r.resolve({}),r.promise;i[n]?r.resolve(i[n]):c.get(n,null,null,{store:!0}).then(function(e){if(!s.isEmpty(e.data)&&!s.isEmpty(e.data.data)){var t=e.data.data;return i[n]=t,r.resolve(t),this}if(e&&e.fromCache)return r.resolve(e),this;r.resolve({})}).fail(function(e){r.reject(e)});return r.promise},getAll:function(e){var t=s.addRouteParamsToUri({widget:e,operatorId:u.operator.cmsId,lang:l.get("lang")},o.urls.cms.widget),n=a.defer();return c.get(t).then(function(e){if(!s.isEmpty(e))return n.resolve(e._empty_.widgets),this;n.resolve([])}).fail(function(e){n.reject(e)}),n.promise},getBundle:function(e){var t=s.addRouteParamsToUri({bundle:e,operatorId:u.operator.cmsId},o.urls.cms.widgetBundle),n=a.defer();return c.get(t,null,null,{store:!0}).then(function(e){s.each(e.data,function(e){var t=e.key,n=s.addRouteParamsToUri({widget:t,operatorId:u.operator.cmsId,lang:l.get("lang")},o.urls.cms.widget);r.getCache(n)||r.setCache(n,e.data)}),n.resolve(e)}).fail(function(e){n.reject(e)}),n.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.Cookie,Pt.Managers.Cache,Pt.Managers.HttpClient,Pt.Services.HttpClientCacheService),function(o,e,t,r,u,i,l){o.Class("Pt.Services.Cms.BankingOptionService",new function(){var a={};return{get:function(){var n=o.addRouteParamsToUri({widget:"banking_options",operatorId:r.operator.cmsId,lang:l.get("lang")},t.urls.cms.widget),s=e.defer();return o.isEmpty(a[n])?i.get(n,null,null,{store:!0}).then(function(e){var r,t=e.data.data,i={};try{o.each(o.groupBy(t.options,"currency"),function(e,n){i[n]={},o.each(o.groupBy(e,"transaction_type"),function(e,t){i[n][t]=[],o.each(e,function(e){(r=new u.Cms.BankingOption).set("currency",o.propertyValue(e,"currency","")),r.set("details",o.propertyValue(e,"details","")),r.set("duration",o.propertyValue(e,"duration","")),r.set("maximum",o.propertyValue(e,"maximum","")),r.set("minimum",o.propertyValue(e,"minimum","")),r.set("name",o.propertyValue(e,"name","")),r.set("className",o.propertyValue(e,"class_name","")),r.set("redirectTo",o.propertyValue(e,"redirect_to","")),r.set("transaction_type",o.propertyValue(e,"transaction_type","")),r.set("fee",o.propertyValue(e,"fee","")),i[n][t].push(r)})})})}catch(e){s.reject([])}a[n]=i,s.resolve(i)}).fail(function(e){s.reject(e)}):s.resolve(a[n]),s.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Managers.HttpClient,Pt.Managers.Cookie),function(a,e,t,n,o,u){a.Class("Pt.Services.Cms.BankService",new function(){var s={};return{getByMethodCode:function(r){var i=e.defer();a.isEmpty(s[r])?u.get(t.urls.cms.bankCodes,{methodCode:r},null,{store:!0}).then(function(e){var t=e.data,n=[];a.each(t,function(e){"101ka_b2c"===r&&(e.bankCode+="-WAP"),n.push(a.extendOnly(new o.Bank,{bankCode:e.bankCode,bankName:a.trans("banks."+e.name)}))}),s[r]=n,i.resolve(n)}).fail(function(e){i.reject(e)}):i.resolve(s[r]);return i.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Managers.HttpClient),function(i,s,a,o,u,e,l){"use strict";i.Class("Pt.Services.Cms.BannerService",new function(){return{get:function(e,t){var n=i.str_replace_key({":platform":t||""},i.addRouteParamsToUri({operatorId:o.operator.cmsId,lang:u.get("lang")},a.urls.cms.banners)),r=s.defer();return l.get(n,{page:e},null,{store:!0}).then(function(e){r.resolve(e)}).fail(function(e){r.reject(e)}),r.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.Cookie,Pt.Managers.Cache,Pt.Managers.HttpClient),function(r,e,i){"use strict";r.Class("Pt.Services.Cms.DepositInstructionService",new function(){var n=null;return{init:function(){var t=e.defer();if(n)return t.resolve(n),t.promise;return i.get("deposit_instruction").then(function(e){n=e.deposit_method||[],t.resolve(n)}).fail(function(e){t.reject(e)}),t.promise},getByMethodCode:function(e){var t=r.findWhere(n,{method_code:e});if(t)return t.instruction;return""},getNotice:function(e){var t=r.findWhere(n,{method_code:e});if(t)return t.notice;return""},getPostInstruction:function(e){var t=r.findWhere(n,{method_code:e});if(t)return t.post_instructions;return""}}})}(_,Q,Pt.Services.Cms.WidgetService),function(r,e,i){"use strict";r.Class("Pt.Services.Cms.DepositBannerService",new function(){var n=null;return{init:function(){var t=e.defer();if(n)return t.resolve(n),t.promise;return i.get("deposit_mini_banner").then(function(e){n=e.deposit_method||[],t.resolve(n)}).fail(function(){t.resolve([])}),t.promise},getBanner:function(e){var t=r.findWhere(n,{method_code:e});if(t)return t;return""}}})}(_,Q,Pt.Services.Cms.WidgetService),function(e,r,i){"use strict";e.Class("Pt.Services.Cms.FeaturedGameService",new function(){var n=null;return{fetch:function(){var t=r.defer();if(n)return void t.resolve(n);return i.get("featured_games").then(function(e){n=e||[],t.resolve(n)}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Services.Cms.WidgetService),function(f,p,h,g,v,e,b,t,y,C,n){"use strict";f.Class("Pt.Services.Cms.GameService",new function(){h=h||{};var d=["en","zh-hans"],m=t.get("lang")||"zh-hans";return{getAllSlotGames:function(){var e=p.defer(),t=[],n=this;return f.each(g.games.slots.clubs,function(e){t.push(n.getGames("slot_machines",e))}),p.all(t).finally(function(){e.resolve({data:"ok"})}),e.promise},getTopGames:function(){var r=p.defer();return n.Cms.WidgetService.get("top_played_games").then(function(n){if(f.isEmpty(n))throw new Error("Top Played Widget Empty");e("slot_machines",f.flatten(f.map(n.slots.club_items,function(e){return f.map(f.filter(e.game_items,function(e){return e.game_id}),"game_id")}))).then(function(e){var t=new b.TopPlayedGames;t.games=e,t.data=n,r.resolve(t)})}).fail(function(){r.resolve(new b.TopPlayedGames)}),r.promise},getGames:function(e,r){t=e,n=r,f.each(d,function(e){h.cached||C.remove(t+"-"+n+"-"+e)});var t,n;var i=p.defer(),s=e+"-"+r+"-"+m,a=C.get(s),o={};"slot_machines"===e&&(o={fields:g.games.slots.fields});var u=f.extend({club:r,type:e,offset:0,limit:1e3},o),l=v.urls.cms.games;function c(e){h.cached=1,i.resolve(e)}f.isEmpty(a)?y.get(l,u,null,{store:!0}).then(function(e){var t=new b.CmsCollection,n=[];f.each(e.data,function(e){e.club=r,n.push(f.extendOnly(new b.Games,e))}),f.isEmpty(n)||(t.items=n,t.pagination=e.pagination,C.set(s,t,{TTL:18e4})),c(t)}).fail(function(){i.reject(new b.CmsCollection)}):c(a);return i.promise},getGamesByIds:e,getGameByVendorAndId:function(e,t){var n=p.defer(),r=f.str_replace_key({":vendor":e,":gameId":t},v.urls.cms.gameByVendorAndId);return y.get(r).then(function(e){f.isEmpty(e.data)?n.reject(!1):n.resolve(f.extendOnly(new b.Games,e.data))}),n.promise}};function e(e,t){var r=p.defer(),n={};"slot_machines"===e&&(n={fields:g.games.slots.fields});var i=f.extend({type:e,offset:0,limit:1e3,game_ids:t.join(",")},n),s=v.urls.cms.games;return y.get(s,i,null,{store:!0}).then(function(e){var t=new b.CmsCollection,n=[];f.each(e.data,function(e){n.push(f.extendOnly(new b.Games,e))}),f.isEmpty(n)||(t.items=n,t.pagination=e.pagination),r.resolve(t)}).fail(function(){r.reject(new b.CmsCollection)}),r.promise}})}(_,Q,Pt.GameSettings,Pt.Config,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Managers.Cookie,Pt.Managers.HttpClient,Pt.Managers.Cache,Pt.Services),function(e,r,i){"use strict";e.Class("Pt.Services.Cms.HotGamesService",new function(){var n=null;return{fetch:function(){var t=r.defer();if(n)return void t.resolve(n);return i.get("hot_games").then(function(e){n=e||[],t.resolve(n)}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Services.Cms.WidgetService),function(i,s,a,e,t,n,o){"use strict";i.Class("Pt.Services.Cms.InfoCenter",new function(){return{getCategories:function(){var e=a.urls.cms.infoCenterCategories,n=s.defer();return o.get(e,null,null,{store:!0}).then(function(e){if(!i.isEmpty(e)){var t=i.map(e,function(e){return{id:e._id,label:e.name,slug:e.slug}});return n.resolve(t),this}n.resolve({})},function(e){n.reject(e)}),n.promise},getList:function(e){var t=i.str_replace_key({":catId":e},a.urls.cms.infoCenterList),n=s.defer();return o.get(t,null,null,{store:!0}).then(function(e){if(!i.isEmpty(e)){var t={};return i.each(e,function(e){t[e.slug]={slug:e.slug,name:e.name,id:e._id}}),n.resolve(t),this}n.resolve({})},function(e){n.reject(e)}),n.promise},getDetails:function(e,t){var n=i.str_replace_key({":catId":t,":detailId":e},a.urls.cms.infoCenterDetails),r=s.defer();return o.get(n,null,null,{store:!0}).then(function(e){if(!i.isEmpty(e))return r.resolve(e),this;r.resolve({})},function(e){r.reject(e)}),r.promise},getDetailsBySlug:function(e,t){var n=i.str_replace_key({":catSlug":t,":slug":e},a.urls.cms.infoCenterDetailsBySlug),r=s.defer();return o.get(n,null,null,{store:!0}).then(function(e){if(!i.isEmpty(e))return r.resolve(e),this;r.resolve({})},function(e){r.reject(e)}),r.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.Cookie,Pt.Managers.Cache,Pt.Managers.HttpClient),function(r,i,s,e,t,n,a){"use strict";r.Class("Pt.Services.Cms.PageService",new function(){return{getPage:function(e){var t=s.urls.cms.page,n=i.defer();return a.get(t,{page:e},null,{store:!0}).then(function(e){if(!r.isEmpty(e.data))return n.resolve(e.data[0]),this;n.resolve({})}).fail(function(e){n.reject(e)}),n.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.Cookie,Pt.Managers.Cache,Pt.Managers.HttpClient),function(a,o,i,u,e,t,l,c,d){"use strict";a.Class("Pt.Services.Cms.PromotionService",new function(){var s=t.get("lang")||"zh-hans";return{getPromotionsCategory:function(t){t=t||"member";var n=o.defer(),r="promotions-category-"+s,e=c.get(r),i="member"===t?"promotionCategories":"affiliatePromotionsCategories";a.isEmpty(e)?l.get(u.urls.cms[i],null,null,{store:!0}).then(function(e){e="member"===t?e:e.data,a.isEmpty(e)||c.set(r,e),n.resolve(e)}).fail(function(){n.resolve([])}):n.resolve(e);return n.promise},getPromotions:function(e,t){t=t||"member";var r=o.defer(),n="member"===t?"promotions":"affiliatePromotions";return l.get(u.urls.cms[n],{page:"promotions",category:e},null,{store:!0}).then(function(e){var n=[];a.each(e.data,function(e){var t=a.extendOnly(new d,e);a.isEmpty(a.propertyValue(e,"body",""))&&t.set("body",a.propertyValue(e,"contents.body.code","")),t.set("hashId",i(e.id)),a.isObject(e.image)&&t.set("cardImage",a.updateCdnPath(e.image)),a.isObject(e.contentBanner)&&t.set("bannerImage",a.updateCdnPath(e.contentBanner)),n.push(t)}),r.resolve(n)}).fail(function(){r.resolve([])}),r.promise}}})}(_,Q,md5,Pt.Endpoints,Pt.Settings,Pt.Managers.Cookie,Pt.Managers.HttpClient,Pt.Managers.Cache,Pt.Contracts.Promotion),function(e,r,i){"use strict";e.Class("Pt.Services.Cms.WinnersService",new function(){var n=null;return{fetch:function(){var t=r.defer();if(n)return void t.resolve(n);return i.get("winners_notification").then(function(e){n=e||[],t.resolve(n)}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Services.Cms.WidgetService),function(r,e,i){"use strict";r.Class("Pt.Services.Cms.WithdrawalInstructionService",new function(){var n=null;return{init:function(){var t=e.defer();if(n)return void t.resolve();return i.get("withdrawal_instruction").then(function(e){n=e.withdrawal_method||[],t.resolve()}).fail(function(e){t.reject(e)}),t.promise},getByMethodCode:function(e){if(!n&&!e)return"";var t=Array.isArray(n)?r.findWhere(n,{method_code:e}):n;return void 0!==t&&t.method_code===e?t.instruction:""}}})}(_,Q,Pt.Services.Cms.WidgetService),function(n,e,r,t,i,s){"use strict";n.Class("Pt.Services.Cms.YeePayCardService",new function(){return{getCardConfig:function(){var t=e.defer();return s.get(r.urls.cms.yeepayCards,null,null,{store:!0}).then(function(e){var r=[];n.each(e.data,function(e,t){var n=new i.CardType;n.set("code",t).set("denominations",e),r.push(n)}),t.resolve(r)}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Managers.HttpClient),function(e,r,i){"use strict";e.Class("Pt.Services.Cms.IdleTimeService",new function(){var n=null;return{getConfig:function(){var t=r.defer();if(n)return t.resolve(n),t.promise;return i.get("idle_time").then(function(e){n=e||[],t.resolve(n)}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Services.Cms.WidgetService),function(a,o,i,u,e,t,l,c,d){"use strict";a.Class("Pt.Services.Cms.ArticleService",new function(){var s=t.get("lang")||"zh-hans";return{getArticlesCategory:function(t){t=t||"member";var n=o.defer(),r="article-category-"+s,e=c.get(r),i="member"===t?"articleCategories":"affiliateArticlesCategories";a.isEmpty(e)?l.get(u.urls.cms[i],null,null,{store:!0}).then(function(e){e="member"===t?e:e.data,a.isEmpty(e)||c.set(r,e),n.resolve(e)}).fail(function(){n.resolve([])}):n.resolve(e);return n.promise},getArticles:function(e,t){t=t||"member";var r=o.defer(),n="member"===t?"articles":"affiliateArticles";return l.get(u.urls.cms[n],{page:"articles",category:e},null,{store:!0}).then(function(e){var n=[];a.each(e.data,function(e){var t=a.extendOnly(new d,e);a.isEmpty(a.propertyValue(e,"body",""))&&t.set("body",a.propertyValue(e,"contents.body.code","")),t.set("hashId",i(e.id)),a.isObject(e.image)&&t.set("cardImage","/"+e.image.relative_uri),n.push(t)}),r.resolve(n)}).fail(function(){r.resolve([])}),r.promise}}})}(_,Q,md5,Pt.Endpoints,Pt.Settings,Pt.Managers.Cookie,Pt.Managers.HttpClient,Pt.Managers.Cache,Pt.Contracts.Article),function(s,a,e,o,u,l){"use strict";_.Class("Pt.Services.Affiliates.SessionService",new function(){var i={};return{login:function(e,t){var n=s.defer(),r={username:e,password:t,operatorId:a.operator.msId,deviceId:"Desktop"};return l.post(o.urls.api.affiliate.login,r).then(function(e){n.resolve({token:e.data.token})}).fail(function(e){n.reject(e)}),n.promise},forgotLogin:function(e,t){var n=s.defer(),r={username:e,email:t,operatorId:a.operator.msId};return l.post(o.urls.api.affiliate.forgotLogin,r).then(function(e){n.resolve(_.extendOnly(new u.ForgotPassword,e))}).fail(function(e){n.reject(e)}),n.promise},signup:function(e){var n=s.defer();return l.post(o.urls.api.affiliate.signup,e).then(function(e){var t=new u.AffiliateSignUp;t.set("status",e.data.service_code),t.set("message",e.message),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},signupSettings:function(){var n=s.defer(),r=o.urls.api.affiliate.signupSettings;return _.isEmpty(i[r])?l.get(r,{}).then(function(e){var t=new u.SignupSettings;t.commission_types=e.data.commission_types,t.countries=e.data.countries,t.currencies=e.data.currencies,t.languages=e.data.languages,i[r]=t,n.resolve(t)}).fail(function(e){n.reject(e)}):n.resolve(i[r]),n.promise},countryList:function(){var n=s.defer(),r=o.urls.api.affiliate.countryList;return _.isEmpty(i[r])?l.get(r,{}).then(function(e){var t=e.data.countries;i[r]=t,n.resolve(t)}).fail(function(e){n.reject(e)}):n.resolve(i[r]),n.promise}}})}(Q,Pt.Settings,Pt.Config,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient),function(r,i,e,s,a,o){"use strict";_.Class("Pt.Services.Affiliates.CreativeService",new function(){return{getCreativeBannerSizes:function(){var t=r.defer(),e=_.str_replace_key({":affiliateId":i.affiliate.id},s.urls.api.affiliate.creativeBannerSizes);return o.get(e).then(function(e){t.resolve(e.data.bannerSizes)}).fail(function(e){t.reject(e)}),t.promise},getCreativeTrackers:function(){var n=r.defer(),e=_.str_replace_key({":affiliateId":i.affiliate.id},s.urls.api.affiliate.creativeTrackers);return o.get(e).then(function(e){var t=new a.CreativeTrackers;t.groups=e.data.groups,t.languages=e.data.languages,t.trackingNames=e.data.trackingNames,n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getCreativeList:function(e){var t=r.defer(),n=_.str_replace_key({":affiliateId":i.affiliate.id},s.urls.api.affiliate.creativeList);return o.get(n,e).then(function(e){t.resolve(e.data.creatives)}).fail(function(e){t.reject(e)}),t.promise},createTrackingName:function(e){var t=r.defer(),n=_.str_replace_key({":affiliateId":i.affiliate.id},s.urls.api.affiliate.creativeTrackingNames);return o.post(n,e).then(function(e){t.resolve(e.data)}).fail(function(e){t.reject(e)}),t.promise}}})}(Q,Pt.Settings,Pt.Config,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient),function(s,n,e,i,a,o){"use strict";_.Class("Pt.Services.Affiliates.OverviewService",new function(){return{getAllDependencies:function(){var t=s.defer(),n=this,i=["getProductOverview","getSubAffiliates","getOverview","getSignupCountOverview"],r=[];return _.each(i,function(e){r.push(n[e]())}),s.allSettled(r).then(function(e){var r={};_.each(e,function(e,t){var n=i[t].replace("get","");r[n]=e.value||{}}),t.resolve(r)}),t.promise},getProductOverview:function(){var r=s.defer(),e=_.str_replace_key({":affiliateId":n.affiliate.id},i.urls.api.affiliate.productOverview);return o.get(e).then(function(e){var t=new a.ProductOverview,n=e.data.productOverview;t.activeMember=n.activeMember,t.products=n.products,t.totalCompanyWinLossAmount=n.totalCompanyWinLossAmount,t.totalRakesAmount=n.totalRakesAmount,t.totalTurnoverAmount=n.totalTurnoverAmount,r.resolve(t)}).fail(function(e){r.reject(e)}),r.promise},getSubAffiliates:function(){var r=s.defer(),e=_.str_replace_key({":affiliateId":n.affiliate.id},i.urls.api.affiliate.subAffiliates);return o.get(e).then(function(e){var t=new a.SubAffiliate,n=e.data.subAffiliateProductOverview;t.activeMember=n.activeMember,t.products=n.products,t.totalWinLossAmount=n.totalWinLossAmount,r.resolve(t)}).fail(function(e){r.reject(e)}),r.promise},getOverview:function(){var t=s.defer(),e=_.str_replace_key({":affiliateId":n.affiliate.id},i.urls.api.affiliate.overview);return o.get(e).then(function(e){t.resolve(e.data.tables)}).fail(function(e){t.reject(e)}),t.promise},getSignupCountOverview:function(){var r=s.defer(),e=_.str_replace_key({":affiliateId":n.affiliate.id},i.urls.api.affiliate.signupOverview);return o.get(e).then(function(e){var t=new a.SignupOverview,n=e.data.signupCountOverview;t.newSignup=n.newSignup,t.newSignupWithDeposit=n.newSignupWithDeposit,r.resolve(t)}).fail(function(e){r.reject(e)}),r.promise}}})}(Q,Pt.Settings,Pt.Config,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient),function(o,u,l,a,e,c){"use strict";_.Class("Pt.Services.Affiliates.ProfileService",new function(){var i=l.urls.api.affiliate.member,s={},r=e.replaceV3Tags(l.urls.api.affiliate.paymentType);return{getMemberInfo:function(e){var r=o.defer();return _.isEmpty(s[i])||e?c.get(i).then(function(e){var t=e.data.affiliate,n=new a.Affiliate.Member;n.set("dateOfBirth",window.moment(t.DOB)),n.set("address",t.address),n.set("affiliateId",t.affiliateId),n.set("username",t.affiliateUser),n.set("isFundingAllowed",_.booleanString(t.allowFunding)),n.set("city",t.city),n.set("commissionType",t.comType),n.set("messenger",t.contactMessenger),n.set("countryCode",t.countryCode),n.set("currencyCode",t.currency),n.set("languageCode",t.languageCode),n.set("email",t.email),n.set("fullName",t.firstname),n.set("loginAttempts",+t.loginAttempts),n.set("mobileNumber",t.mobileNo),n.set("operatorCode",t.operatorCode),n.set("operatorId",t.operatorId),n.set("payout",t.payout),n.set("postal",t.postal),n.set("websites",t.webUrls),n.set("accountName",t.BankAccName),n.set("accountNumber",t.BankAccNumber),n.set("bankAddress",t.BankAddress),n.set("bankBranch",t.BankBranch),n.set("bankName",t.BankName),n.set("bankSwiftCode",t.BankSwiftCode),n.set("securityAnswer",t.securityAnswer),n.set("securityQuestion",t.securityQuestion),n.set("redirectionPage",t.landingpage_id),s[i]=n,r.resolve(n)}).fail(function(e){r.reject(e)}):r.resolve(s[i]),r.promise},updateMemberInfo:function(e){var t=o.defer();return c.put(i+"/"+u.affiliate.id,e).then(function(){t.resolve()}).fail(function(e){t.reject(e)}),t.promise},addWebsite:function(e){var t=o.defer(),n=_.addRouteParamsToUri({affiliateId:u.affiliate.id},l.urls.api.affiliate.websites);return c.post(n,{websiteUrl:e}).then(function(){t.resolve()}).fail(function(e){t.reject(e)}),t.promise},deleteWebsite:function(e){var t=o.defer(),n=_.addRouteParamsToUri({affiliateId:u.affiliate.id},l.urls.api.affiliate.websites);return c.del(n+"/"+e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise},editWebsite:function(e){var t=o.defer(),n=_.addRouteParamsToUri({affiliateId:u.affiliate.id},l.urls.api.affiliate.websites);return c.put(n+"/"+e.siteId,{websiteUrl:e.websiteUrl}).then(function(e){t.resolve(_.extendOnly(new a.Generic,e))}).fail(function(e){t.reject(e)}),t.promise},getWebsites:function(){var n=o.defer(),e=_.addRouteParamsToUri({affiliateId:u.affiliate.id},l.urls.api.affiliate.websites);return c.get(e).then(function(e){var t=_.map(e.data.websiteUrls,function(e){var t=new a.AffiliateWebsite;return t.set("affiliateurl",e.websiteUrl),t.set("affiliatememberurlid",e.websiteUrlId),t});n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},changePassword:function(e){var t=o.defer(),n=_.addRouteParamsToUri({affiliateId:u.affiliate.id},l.urls.api.affiliate.changePassword);return c.put(n,e).then(function(e){t.resolve(_.extendOnly(new a.Generic,e))}).fail(function(e){t.reject(e)}),t.promise},inviteSubAffiliate:function(e){var i=o.defer(),s=_.addRouteParamsToUri({affiliateId:u.affiliate.id},l.urls.api.affiliate.subAffiliateInvite),a=[];return function t(e,n){var r=o.allSettled(_.map(e,function(e){return c.post(s,{emails:e})}));r.then(function(e){_.each(e,function(e){"rejected"===e.state&&a.push(e.reason[0])}),n&&n.length?t(n):a.length?i.reject(a):i.resolve()})}(e,e.splice(1)),i.promise},checkPaymentTypeAccess:function(){var t=o.defer();return c.get(r+"/access").then(function(e){t.resolve(e.data.canAccess)}).fail(function(e){t.reject(e)}),t.promise},getPaymentType:function(){var n=o.defer();_.isEmpty(s[r])?c.get(r).then(function(e){var t=_.extendOnly(new a.Affiliate.PaymentType,e.data);s[r]=t,n.resolve(t)}).fail(function(e){n.reject(e)}):n.resolve(s[r]);return n.promise},savePaymentType:function(e){var t=o.defer();return c.post(r,e,"json",{contentType:!1,processData:!1}).then(function(){t.resolve(),delete s[r]}).catch(function(e){t.reject(e)}),t.promise}}})}(Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Services.AbstractV3Service,Pt.Managers.HttpClient),function(s,u,l,c,a,d){"use strict";_.Class("Pt.Services.Affiliates.ReportsService",new function(){var o={};return{getMonthSelection:function(){var t=s.defer(),n=_.addRouteParamsToUri({affiliateId:u.affiliate.id,reportType:"available-months"},l.urls.api.affiliate.reports),r=[];return _.isUndefined(o[n])?d.get(n).then(function(e){r=_.map(e.data.months,function(e){return t=e,n=window.moment(t.startDate).utcOffset("+08:00"),r=n.format("MMMM")+" "+n.format("YYYY"),i=n.format("YYYY-MM-DD"),"bi-monthly"===t.payoutFrequency.toLowerCase()&&(r+=1==+n.get("date")?_.trans("affiliate.month_first_half"):_.trans("affiliate.month_second_half")),{month:n,payoutFrequency:t.payoutFrequency,label:r,referrence:i};var t,n,r,i}),o[n]=r,t.resolve(r)}).fail(function(e){t.reject(e)}):t.resolve(o[n]),t.promise},getCommissions:function(e){var t=s.defer(),n=[],r=a.replaceV3Tags(_.str_replace_key({affiliateId:u.affiliate.id,reportType:"commissions"},l.urls.api.affiliate.reportsV3)),i=_.encodeObjToUri(e,r);return _.isUndefined(o[i])?d.get(i).then(function(e){n=_.map(e.data.reports,function(e){var t=new c.CommissionReport;if(t.set("adjustment",+_.propertyValue(e,"adjustmentUSD",0)),t.set("expenses",+_.propertyValue(e,"expenses",0)),t.set("user",_.propertyValue(e,"affiliateUser",null)),t.set("settlementId",_.propertyValue(e,"settlementID","")),t.set("grossCommission",+_.propertyValue(e,"grossCommission",0)),t.set("subAffiliateCommission",+_.propertyValue(e,"subAffiliateCommissionUSD",0)),t.set("previousCommission",+_.propertyValue(e,"previousComUSD",0)),t.set("commission",+_.propertyValue(e,"payoutCommission",0)),t.set("negativeNetRevenue",+_.propertyValue(e,"negativeNetRevenue",0)),t.set("previousNegativeNetRevenue",+_.propertyValue(e,"previousNegativeNetRevenue",0)),t.set("commissionRollOverNextMonth",+_.propertyValue(e,"comRollNextMonth",0)),t.set("activeMember",+_.propertyValue(e,"uniqueActiveMember",0)),t.set("paymentFee",+_.propertyValue(e,"paymentFeeUSD",0)),t.set("rebate",+_.propertyValue(e,"rebateUSD",0)),t.set("reward",+_.propertyValue(e,"rewardUSD",0)),t.set("royalty",+_.propertyValue(e,"royaltyUSD",0)),t.set("bonus",+_.propertyValue(e,"bonusUSD",0)),t.set("netTurnOver",+_.propertyValue(e,"netTurnoverUSD",0)),t.set("grossRevenue",+_.propertyValue(e,"grossRevenueUSD",0)),t.set("rakesAmount",+_.propertyValue(e,"rakesAmount",0)),t.set("signUps",+_.propertyValue(e,"signUps",0)),t.set("firstTimeDeposits",+_.propertyValue(e,"firstTimeDeposits",0)),!_.isEmpty(_.propertyValue(e,"settlements",""))){var n=_.map(e.settlements,function(e){var t=new c.CommissionSettlement;return t.set("totalStakeAmount",+_.propertyValue(e,"TotalStakeAmount",0)),t.set("totalWinLoseAmount",+_.propertyValue(e,"TotalwinloseAmount",0)),t.set("stakeAmount",+_.propertyValue(e,"stakeAmount",0)),t.set("winloseAmount",+_.propertyValue(e,"winloseAmount",0)),t.set("rakesAmount",+_.propertyValue(e,"rakesAmount",0)),t.set("productKey",_.propertyValue(e,"productKey","")),t.set("productName",_.propertyValue(e,"productName","")),t.set("settlementId",_.propertyValue(e,"settlementID","")),t});t.set("settlements",n)}return t}),o[i]=n,t.resolve(n)}).fail(function(e){t.reject(e)}):t.resolve(o[i]),t.promise},getMemberProfileSummary:function(e){var t,n=s.defer(),r=_.addRouteParamsToUri({affiliateId:u.affiliate.id,reportType:"member-profile-summary"},l.urls.api.affiliate.reports),i=_.encodeObjToUri(e,r);return _.isUndefined(o[i])?d.get(i).then(function(e){t=_.map(e.data,function(e){var t=new c.MemberProfileSummary;return t.set("createDate",moment(_.propertyValue(e,"createdDate",""))),t.set("currencyCode",_.propertyValue(e,"currencyCode","")),t.set("memberCode",_.propertyValue(e,"memberCode","")),t.set("memberStatus",_.propertyValue(e,"memberStatus","")),t.set("signUpIp",_.propertyValue(e,"signUpIp","")),t.set("signUpSiteUrl",_.propertyValue(e,"signUpSiteUrl","")),t.set("dateTransaction",_.propertyValue(e,"dateTransaction","")),t}),o[i]=t,n.resolve(t)}).fail(function(e){n.reject(e)}):n.resolve(o[i]),n.promise},getProductReports:function(e){var t=s.defer(),a={},n=_.addRouteParamsToUri({affiliateId:u.affiliate.id,reportType:"products"},l.urls.api.affiliate.reports),r=_.encodeObjToUri(e,n);return _.isUndefined(o[r])?d.get(r).then(function(e){var s=[0,1,2];_.each(e.data.reports,function(r,i){a[i]=[],_.each(e.data.products,function(e){var t=_.findWhere(r,{productTranslationCode:e.productCode}),n=new c.ProductReport;n.set("productCode",e.productCode),n.set("productGroup",e.productGroup),n.set("productName",e.productName),n.set("currencyCode",_.propertyValue(t,"currencyCode","")),n.set("baseStakeAmount",+_.propertyValue(t,"baseStakeAmount",0)),n.set("baseWinLoseAmount",+_.propertyValue(t,"basewinloseAmount",0)),n.set("stakeAmount",+_.propertyValue(t,"stakeAmount",0)),n.set("winLoseAmount",+_.propertyValue(t,"winloseAmount",0)),n.set("clickAble",-1<s.indexOf(+e.productGroup)),a[i].push(n)})}),o[r]=a,t.resolve(a)}).fail(function(e){t.reject(e)}):t.resolve(o[r]),t.promise},getProductDetailedReport:function(e){var t=s.defer(),n=[],r=_.addRouteParamsToUri({affiliateId:u.affiliate.id,reportType:"products"},l.urls.api.affiliate.reports);r=r+"/"+e.productCode;var i=_.encodeObjToUri(e,r);return _.isUndefined(o[i])?d.get(i).then(function(e){n=_.map(e.data.reports,function(e,t){var n=new c.ProductReport;return n.set("productCode",e.productTranslationCode),n.set("productGroup",e.productGroup),n.set("productName",e.productName),n.set("currencyCode",_.propertyValue(e,"currencyCode","")),n.set("baseStakeAmount",+_.propertyValue(e,"basestakeAmount",0)),n.set("baseWinLoseAmount",+_.propertyValue(e,"basewinloseAmount",0)),n.set("stakeAmount",+_.propertyValue(e,"stakeAmount",0)),n.set("winLoseAmount",+_.propertyValue(e,"winloseAmount",0)),n}),o[i]=n,t.resolve(n)}).fail(function(e){t.reject(e)}):t.resolve(o[i]),t.promise},getPaymentReport:function(e){var t=s.defer(),n=_.addRouteParamsToUri({affiliateId:u.affiliate.id,reportType:"member-payments"},l.urls.api.affiliate.reports),r=[],i=_.encodeObjToUri(e,n);return _.isUndefined(o[i])?d.get(i).then(function(e){_.isEmpty(e.data)||(r=_.map(e.data,function(e){var t=new c.PaymentReport;return t.set("bonusAmount",_.propertyValue(e,"bonusAmount",0)),t.set("bonusAmountInUSD",_.propertyValue(e,"bonusAmountInUSD",0)),t.set("depositAmount",_.propertyValue(e,"depositAmount",0)),t.set("depositAmountInUSD",_.propertyValue(e,"depositAmountInUSD",0)),t.set("otherFeeAmount",_.propertyValue(e,"otherFeeAmount",0)),t.set("otherFeeAmountInUSD",_.propertyValue(e,"otherFeeAmountInUSD",0)),t.set("paymentFeeAmount",_.propertyValue(e,"paymentFeeAmount",0)),t.set("paymentFeeAmountInUSD",_.propertyValue(e,"paymentFeeAmountInUSD",0)),t.set("paymentFeeAmountInUSD",_.propertyValue(e,"paymentFeeAmountInUSD",0)),t.set("rebateAmount",_.propertyValue(e,"rebateAmount",0)),t.set("rebateAmountInUSD",_.propertyValue(e,"rebateAmountInUSD",0)),t.set("rebateAmountInUSD",_.propertyValue(e,"rebateAmountInUSD",0)),t.set("withdrawalAmount",_.propertyValue(e,"withdrawalAmount",0)),t.set("withdrawalAmountInUSD",_.propertyValue(e,"withdrawalAmountInUSD",0)),t.set("memberCode",_.propertyValue(e,"memberCode","")),t.set("memberId",_.propertyValue(e,"memberId","")),t.set("currency",_.propertyValue(e,"currency","")),t})),o[i]=r,t.resolve(r)}).fail(function(e){t.reject(e)}):t.resolve(o[i]),t.promise},getProductSummaries:function(e){var n=s.defer(),t=_.addRouteParamsToUri({affiliateId:u.affiliate.id,reportType:"product-summaries"},l.urls.api.affiliate.reports),r=[],i=_.encodeObjToUri(e,t);return _.isUndefined(o[i])?d.get(i).then(function(e){r=[],_.isEmpty(e.data.records)||(r=_.map(e.data.records,function(e){var t=new c.ProductSummary;return t.set("productCode",_.propertyValue(e,"productCode","")),t.set("rakesAmount",_.propertyValue(e,"rakesAmount",0)),t.set("stakeAmount",_.propertyValue(e,"stakeAmount",0)),t.set("stakeAmount",_.propertyValue(e,"stakeAmount",0)),t.set("activePlayer",_.propertyValue(e,"uniqueActivePlayer",0)),t.set("winLossAmount",_.propertyValue(e,"winLossAmount",0)),t}));var t="";_.isEmpty(e.data.totalUap)||(t=e.data.totalUap),r={records:r,totalUap:t},o[i]=r,n.resolve(r)}).fail(function(e){n.reject(e)}):n.resolve(o[i]),n.promise},getDailyTransactions:function(e){var t,n=s.defer(),r=[];return t=a.replaceV3Tags(_.str_replace_key({":affiliateUser":e.memberCode,":startDate":e.startDate,":endDate":e.endDate},l.urls.api.affiliate.downlineDailyTransactions)),_.isUndefined(o[t])?d.get(t).then(function(e){_.each(e.data,function(e){r.push(_.extendOnly(new c.DownlineHistory,e))}),o[t]=r,n.resolve(r)}).fail(function(e){n.reject(e)}):n.resolve(o[t]),n.promise}}})}(Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Services.AbstractV3Service,Pt.Managers.HttpClient),function(r,i,s,a,o){"use strict";_.Class("Pt.Services.Affiliates.TrackingService",new function(){return{getTrackingNames:function(){var n=r.defer(),e=_.addRouteParamsToUri({affiliateId:i.affiliate.id},s.urls.api.affiliate.creativeTrackers);return o.get(e).then(function(e){var t=_.map(e.data.trackingNames,function(e){return _.extendOnly(new a.TrackingName,{code:e.trackCodeID||"",name:e.trackCodeName||""})});n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getTrackingStatistics:function(e){var n=r.defer(),t=_.addRouteParamsToUri({affiliateId:i.affiliate.id},s.urls.api.affiliate.trackingStatistics);return o.get(_.encodeObjToUri(e,t)).then(function(e){var t=_.map(e.data.trackingStatistics,function(e){return _.extendOnly(new a.TrackingStatistics,{clicks:e.CountClick,uniqueClicks:e.CountUniqueClick,code:e.trackCodeID,name:e.trackCodeName,date:e.dates})});n.resolve(_.extendOnly(new a.MainTrackingStatistics,{totalClicks:e.data.totalClicks,totalUniqueClicks:e.data.totalUniqueClicks,trackingStatistics:_.groupBy(t,"name")}))}).fail(function(e){n.reject(e)}),n.promise}}})}(Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient),function(s,e,a,o,u,t){"use strict";_.Class("Pt.Services.Affiliates.DownlineService",new function(){var i=_.extend({},t,{getStatus:function(){var n=s.defer();if(r.isSet)n.resolve(r.value);else{var e=i.replaceV3Tags(a.urls.api.affiliate.downlineStatus);u.get(e).then(function(e){var t=!(!e.data||!e.data.status)&&e.data.status;n.resolve(t),r={isSet:!0,value:t}}).fail(function(e){n.reject(e)})}return n.promise},search:function(e){var n=s.defer(),t=_.getFormValue(e,"user")&&!_.isEmpty(_.getFormValue(e,"user").trim()),r=i.replaceV3Tags(_.str_replace_key({":regDateFrom":_.getFormValue(e,"regDateFrom"),":regDateTo":_.getFormValue(e,"regDateTo"),":type":_.getFormValue(e,"type"),":user":_.getFormValue(e,"user")},a.urls.api.affiliate[t?"downlineSearchByUser":"downlineSearch"]));return u.get(r).then(function(e){var t=[];_.each(e.data,function(e){t.push(_.extendOnly(new o.Downline,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getTopupHistory:function(e){var n=s.defer(),t=i.replaceV3Tags(_.str_replace_key({":startDate":_.getFormValue(e,"startDate"),":endDate":_.getFormValue(e,"endDate"),":status":_.getFormValue(e,"status"),":method":_.getFormValue(e,"method"),":type":_.getFormValue(e,"type")},a.urls.api.affiliate.downlineTopupHistory));return u.get(t).then(function(e){var t=[];_.each(e.data,function(e){t.push(_.extendOnly(new o.TopupHistory,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise}}),r={isSet:!1,value:void 0};return i})}(Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient,Pt.Services.AbstractV3Service),function(c,e,d,m,f,t){"use strict";_.Class("Pt.Services.Affiliates.FundsService",new function(){var i=_.extend({},t,{getBalance:function(e){var n=c.defer();if(r&&!e)n.resolve(r);else{var t=i.replaceV3Tags(d.urls.api.affiliate.accountBalance);f.get(t).then(function(e){var t=_.extendOnly(new m.AffiliateBalance,e.data||{});n.resolve(t),r=t}).fail(function(e){n.reject(e)})}return n.promise},topup:function(e){var t=c.defer(),n=_.getFormValue(e,"downlineType"),r=i.replaceV3Tags(_.str_replace_key({":type":n},d.urls.api.affiliate.accountTopup));return f.post(r,e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise},getDepositMethods:function(e){var n=c.defer();if(s&&!e)n.resolve(s);else{var t=i.replaceV3Tags(d.urls.api.affiliate.depositMethods);f.get(t).then(function(e){var t=[];_.each(e.data,function(e){var n=_.extendOnly(new m.AffiliateDepositMethods,e);if(function(e){var t={yeepay_card:function(e){var r=[];return _.each(e.cards,function(e,t){var n=new m.CardType;n.set("code",t.toUpperCase()).set("denominations",e),r.push(n)}),r},offline:function(e){var a={amountSelection:e.amount_selection,fieldSettings:[],channels:[]},t=e.available_channels;return t&&t.length&&(_.each(t,function(e){a.channels.push(_.extendOnly(new m.BankingOption,{code:e,name:_.trans("funds.offline_channel_"+e)}))}),delete e.available_channels),_.each(e,function(e,t){var n="true"===e[t+"_visibility"],r=null,i=null;n||"deposit_time"!==t?r=n||"deposit_date"!==t?e[t+"_default_value"]||null:moment().format("YYYY-MM-DD"):(r="-",i="text");var s=_.extendOnly(new m.OfflineDepositField,{name:_.toCamelCase(t),shouldDisplay:n,defaultValue:r,inputType:i});a.fieldSettings.push(s)}),_.has(e,"processing_fee")&&(a.processing_fee=e.processing_fee),a},basic:l,bank_transfer:l},n=t[e.get("methodCode")];_.has(e.customFields,"web_recommended")&&(e.isRecommended=_.booleanString(e.customFields.web_recommended));if(_.isFunction(n)){var r=n(e.get("customFields"));e.set("customFields",r)}var i=t[e.get("processType")];if(_.isFunction(i)){var s=i(e.get("customFields"));e.set("formFields",s)}}(n),n.isBankTransfer()){var r=[];_.each(e.banks,function(e){var t="banks."+n.get("methodCode")+"_"+e;r.push((new m.Bank).set("bankName",_.trans(t)).set("bankCode",e))}),n.set("supportedBanks",r)}t.push(n)}),s=t,n.resolve(t)}).fail(function(e){n.reject(e)})}return n.promise},getBanks:function(e){var n=c.defer();if(a&&!e)n.resolve(a);else{var t=i.replaceV3Tags(d.urls.api.affiliate.banks);f.get(t).then(function(e){var t=[];_.each(e.data,function(e){t.push(_.extendOnly(new m.AffiliateBankAccounts,e))}),a=t,n.resolve(t)}).fail(function(e){n.reject(e)})}return n.promise},getSystemBanksAccounts:function(e){var n=c.defer();if(o&&!e)n.resolve(o);else{var t=i.replaceV3Tags(d.urls.api.affiliate.systemBankAccounts);f.get(t).then(function(e){var t=[];_.each(e.data,function(e){t.push(_.extendOnly(new m.AffiliateSystemBankAccount,e))}),o=t,n.resolve(t)}).fail(function(e){n.reject(e)})}return n.promise},createOfflineTransaction:function(e,t){var n=c.defer(),r=i.replaceV3Tags(_.str_replace_key({":method":e},d.urls.api.affiliate.deposit));return f.post(r,t,"json",{contentType:!1,processData:!1}).then(function(e){n.resolve(e.data)}).fail(function(e){n.reject(e)}),n.promise},getHistory:function(e){var n=c.defer(),t=i.replaceV3Tags(_.str_replace_key({":startDate":_.getFormValue(e,"startDate"),":endDate":_.getFormValue(e,"endDate"),":paymentStatus":_.getFormValue(e,"paymentStatus"),":paymentType":_.getFormValue(e,"paymentType")},d.urls.api.affiliate.fundsHistory));return f.get(t).then(function(e){var t=[];_.each(e.data,function(e){t.push(_.extendOnly(new m.FundsHistory,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise}}),r=void 0,s=void 0,a=void 0,o=void 0,u=["select","radio","checkbox"];return i;function l(e){var t=[];if(_.has(e,"form_fields"))try{e.form_fields=_.isArray(e.form_fields)?e.form_fields:[e.form_fields],t=_.map(e.form_fields,function(e){var t=new m.FormFields,n=_.propertyValue(e,"field_name",null),r="private"===_.propertyValue(e,"encryption_type","private").toLowerCase(),i=(r?"csf_":"csfb_")+n,s=null;t.set("fieldName",i),t.set("encryptionType",_.propertyValue(e,"encryption_type","private")),_.isEmpty(_.propertyValue(e,"validation_rules",""))||(s=_.propertyValue(e,"validation_rules","").split("|")),t.set("validationRules",s);var a=_.propertyValue(e,"input_type",null);if(t.set("inputType",a),-1<_.indexOf(u,a)){var o=_.map(_.propertyValue(e,"selections",[]),function(e){return{value:e,label:_.trans("funds.csf_"+n.toLowerCase()+"_"+e.toLowerCase())}});t.set("selections",o)}return t})}catch(e){void 0}return t}})}(Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient,Pt.Services.AbstractV3Service),function(r,t,i,s){r.Class("Pt.Deposit.AffiliateDepositLauncherService",new function(){return{launch:function(e){var n=e.launcherUrl;n+="?transferAmount="+e.amount,e.custom&&r.each(e.custom,function(e,t){r.isArray(e)?r.each(e,function(e){n+="&"+t+"[]="+e}):n+="&"+t+"="+e});n+="&acceptLanguage="+i.get("lang"),n+="&errorUrl="+location.origin+t.depositErrorPage+e.methodId,n+="&token="+i.get("aff_token"),Pt.Settings.app_version&&(n+="&client-version="+Pt.Settings.app_version);n=r.str_replace_key({":pubkey":s.public_key,":lang":i.get("lang")||"en",":oid":s.operator.msId+"."+s.operator.cmsId},n),window.open(n,e.title||"Deposit","width="+(e.width||1e3)+", height="+(e.height||800))}}})}(_,Pt.Config,Pt.Managers.Cookie,Pt.Settings),function(i,s,a,o,u,l,c,d,m){"use strict";i.Class("Pt.Services.AffiliateAnnouncement",new function(){return{getAnnouncements:function(){var e=m.replaceV3Tags(o.urls.api.affiliate[a.affiliate.isLoggedIn?"announcements":"publicAnnouncements"]),t=s.defer(),n="affiliate.announcements."+md5(e+c.get("lang")),r=l.get(n)||[];i.isEmpty(r)?d.get(e).then(function(e){i.each(e.data,function(e){r.push(i.extendOnly(new u.AffiliateAnnouncements,e))}),i.isEmpty(r)||l.set(n,r,{TTL:18e4}),t.resolve(r)}).fail(function(e){t.reject(e)}):t.resolve(r);return t.promise}}})}(_,Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.Cache,Pt.Managers.Cookie,Pt.Managers.HttpClient,Pt.Services.AbstractV3Service);
(function ($,
    $q,
    _,
    Settings,
    Services,
    Router
) {

    "use strict";

    function Middleware() { }

    Middleware.prototype = {

        run: function (methods, requestContext) {

            var self = this;
            var defer = $q.defer();


            if (_.isEmpty(methods)) {


                defer.resolve(true);

            } else {

                var promises = [];

                methods = _.isString(methods) ? [methods] : methods;

                _.each(methods, function (method) {

                    promises.push(self[method](requestContext));

                });

                $q.all(promises)
                    .then(function (res) {
        

                        defer.resolve(res)

                    });

            }
            return defer.promise;

        },

        FullyRegisteredCheck: function (requestContext) {
            var defer = $q.defer(),
                //alpha88
                isCustomReg = +_.propertyValue(Settings, 'signup_settings.registration_type', 0) === 3;
                
                if(isCustomReg) {
                    return this.bankDetailsCheck();
                } else {
                    defer.resolve(true);
                }

            return defer.promise;
        },

        bankDetailsCheck: function (requestContext) {

            var defer = $q.defer();

            Services.Members
                .BankService
                .getBankingList()
                .then(function (response) {

                    if ( _.propertyValue(response, 'regular.accounts', []).length === 0) {

                        defer.reject();

                        Router.navigate('/funds/deposit');

                    } else {

                        defer.resolve(true);
                    }
                })
                .catch(function (error) {

                    defer.reject(error);

                });

            return defer.promise;
        },

    };

    /**
    * @namespace Pt.Middleware
    */
    _.Class('Pt.Middleware', new Middleware)

})(
    jQuery,
    Q,
    _,
    Pt.Settings,
    Pt.Services,
    Pt.Core.Router
);




/***********************
 * FACTORY HANDLERS
 ***********************/
/**
 * Abstract Fund Transfer Controller
 * Created by isda on 07/04/2017.
 */

(function (
    Q,
    Contracts,
    Helpers,
    Widgets,
    Managers,
    Services,
    Components,
    _bindTrait
) {

    'use strict';

    _.Class('Pt.Controllers.AbstractFundTransfer', AbstractFundTransfer);

    /**
     * @namespace Pt.Controllers.AbstractFundTransfer
     * @constructor
     */
    function AbstractFundTransfer() {

        this.walletFrom = '[data-js=wallet-from]';
        this.walletTo = '[data-js=wallet-to]';
        this.form = '[data-js=fund-transfer-form]';
        this.conversionWrapper = '[data-js=conversion-wrap]';
        this.amountSelector = '[data-js=transferAmount]';
        this.walletFromSelection = null;
        this.walletToSelection = null;

        this.walletsSelector = this.walletFrom + "," + this.walletTo;

        this.actions = [
            [
                this.walletsSelector, 'change', '_onWalletChange'
            ],
            [
                this.amountSelector, 'keydown', '_onAmountKeyDown'
            ],
            [
                this.form, 'submit', '_onFormSubmit'
            ]
        ];

        this.wallets = null;
        this.info = null;

        this.subscription = [
            EventBroker.subscribe(EventBroker.events.funds.transfer.bonusCodeFetchStart, '_bonusCodeFetchStartedHandler', this),
            EventBroker.subscribe(EventBroker.events.funds.transfer.bonusCodeSelect, '_bonusCodeSelectedHandler', this)
        ];

        this.headerBalance = Pt.Widgets.Balance.headerBalance();

    }

    AbstractFundTransfer.prototype = _.extend(_bindTrait, {

        resolve: function (next) {

            var self = this;

            var requests = [
                Services.Members.WalletService.getAll(),
                Services.Cms.WidgetService.get('fund_transfer_info')
            ];

            self.wallets = [];
            self.info = {};

            Helpers.Preloader.basic(self.container);

            Q.allSettled(requests)
                .then(function (results) {

                    if (results[0].state === "fulfilled") {

                        self.wallets = results[0].value;

                    }

                    if (results[1].state === "fulfilled") {

                        self.info = results[1].value;

                    }

                })
                .finally(function () {

                    next();

                });

        },

        _onWalletChange: function(e) {

            var self = e.data.context;
            var data = {};
            var otherWalletSelector = this.name === 'transferFrom' ? self.walletTo : self.walletFrom;

            data[this.name] = parseInt(this.value, 10);

            // Enable the currently disabled wallet and disable the newly selected
            $(otherWalletSelector)
                .find('[disabled]')
                .attr('disabled', false)
                .end()
                .find('option[value="' + this.value + '"]')
                .prop('disabled', true);

            // check if currencies are not the same, get the exchange rates
            var walletFromVal = $(self.walletFrom).val();
            var walletToVal = $(self.walletTo).val();
            var walletFrom = walletFromVal !== '' ? self._getCurrency(walletFromVal) : null;
            var walletTo = walletToVal !== '' ? self._getCurrency(walletToVal) : null;

            var view = Managers.Template.get('funds.currencyConversion', {
                conversionResponse: null
            });

            if ( walletFrom && walletTo && walletFrom !== walletTo ) {

                Services.Members.FundTransferService.currencyConversion(walletFrom, walletTo)
                    .then(function(conversionResponse) {

                        view = Managers.Template.get('funds.currencyConversion', {
                            conversionResponse: conversionResponse,
                            walletFrom: walletFrom,
                            walletTo: walletTo
                        });

                        self.render(self.conversionWrapper, view);

                    })
                    .fail(function(errors) {

                        Helpers.Error.show(errors);

                    });

            } else {

                self.render(self.conversionWrapper, view);

            }

            EventBroker.dispatch(EventBroker.events.funds.transfer.walletSelect, data);

        },

        _getCurrency: function(walletId) {

            var walletObj = _.find(Pt.Config.walletCurrencies, function(wallet) {

                return wallet.id === parseInt(walletId);

            });

            return ( walletObj ? walletObj.currency : Pt.Settings.member.currency );

        },

        _onFormSubmit: function(e) {

            e.preventDefault();

            var self = e.data.context;

            self.validator.validate(self._validationSuccessfulHandler, self);

        },

        _validationSuccessfulHandler: function(formData) {

            var self = this;

            self.secureFormRequest(self.form, true);

            Helpers.Nprogress.start();

            var promoCode = _.findWhere(formData, { name: 'promoCode' });

            if ( promoCode ) {

                promoCode.value = encodeURIComponent(promoCode.value) // remove all non-alphanumeric characters

            }

            var destinationWallet = _.findWhere(formData, { name: 'transferTo' });
            var amount = _.findWhere(formData, { name: 'transferAmount' });

            formData = _.reject(formData, function (field) {

                return field.name === 'promoCodeSelection';

            });

            // Don't show the confirmation message if no promo code was selected.
            if (! promoCode || ! promoCode.value) {

                self._sendFundTransferRequest(formData);

            } else {

                Pt.Components.FundTransferConfirm
                    .onPromoValid(function() {

                        self._sendFundTransferRequest(formData);

                    })
                    .onPromoInvalid(function() {

                        var filteredFormData = _.reject(formData, function (field) {

                            return field.name === 'promoCode';

                        });

                        self._sendFundTransferRequest(filteredFormData);

                    })
                    .onCancel(function() {

                        self.secureFormRequest(self.form, false);
                        Helpers.Nprogress.done();
                        self.balance.clearWalletIndicator();

                    })
                    .confirm(destinationWallet.value, promoCode.value, amount.value);

            }

        },

        _bonusCodeFetchStartedHandler: function() {

            $('[data-js=bonus-code-container]').show();
            Helpers.Preloader.basic('[data-js=bonus-code-container]');

        },

        _bonusCodeSelectedHandler: function (data) {

            var bonusCode = data.bonusCode.toLowerCase();

            if ( ! _.isEmpty(bonusCode) && bonusCode !== 'other' && data.walletId !== - 2 ) {

                $(this.walletTo).val(data.walletId).trigger('change');

            }

        },

        _sendFundTransferRequest: function (formData) {

            var self = this;

            Services.Members.FundTransferService.transfer(formData)
                .then(function() {

                    Helpers.Notify.success(_.trans('funds.success_message_fund_transfer'));

                    EventBroker.dispatch(EventBroker.events.funds.transfer.complete, formData);

                })
                .fail(function(errors) {

                    Helpers.Error.show(errors);

                })
                .finally(function() {

                    self.secureFormRequest(self.form, false);
                    Helpers.Nprogress.done();
                    self.balance.clearWalletIndicator();
                    $(self.form)[0].reset();
                    $(self.walletsSelector).find("option[disabled]").prop('disabled', false);

                    if ( self.walletFromSelection !== null && self.walletToSelection !== null) {

                        $(self.walletFrom).html(self.walletFromSelection);
                        $(self.walletTo).html(self.walletToSelection);

                    }
                    $(self.walletsSelector).find("option[disabled]").prop('disabled', false);

                    // refresh header balance
                    self.headerBalance
                        .setForce(true)
                        .activate();

                });

        },

        _onAmountKeyDown: function(e) {

            var self = e.data.context;

            if (e.keyCode === 13) {

                e.preventDefault();

                $(self.form).submit();

            }

        }

    });

})(
    Q,
    Pt.Contracts,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    Pt.Components,
    _.clone(Pt.Core.BindTrait)
);
/**
 * Created by rowen on 19/04/2017.
 */

(function(RulesHelper, Validator) {

    _.Class('Pt.Deposit.DepositGatewayFactory', new DepositGatewayFactory());

    /**
     * @namespace DepositGatewayFactory
     * @memberOf Pt.Deposit
     * @returns {{
	 * 	make: _make,
	 * 	getMethodName: _getMethodName,
	 * 	makeByMethod: _makeByMethod
	 * }}
     * @constructor
     */
    function DepositGatewayFactory() {

        var gatewayMap = {
            // Custom Implementation
            110101: 'OfflineDeposit', // api
            110310: 'CreditCardDeposit', // api
            120254: 'SdaPayDeposit', // api
            120244: 'DaddyPayQr', // form
            120241: 'YeePayCard',// redirect
            120214: 'NetellerDeposit',
            1204131: 'AlipayTransferDeposit',
            1204373: 'UnionPayTransferDeposit',
            1204769: 'MPay'
        };

        var configMap = {
            // Custom Implementation
            110101: 'offline_deposit',
            110310: 'credit_card',
            120254: 'basic', // SDA Pay (Different process but it's only using amount field)
            120244: 'daddypay_qr',
            120241: 'yeepay_card',
            120214: 'neteller',
            1204131: 'alipay_transfer',
            1204373: 'unionpay_transfer',
            1204769: 'mpay'
        };

        return {
            make: _make,
            getMethodName: _getMethodName,
            makeByMethod: _makeByMethod
        };

        ///////////////

        function _make(depositMethodId) {

            var gatewayName = gatewayMap[depositMethodId];

            if (gatewayName) {

                return new Pt.Deposit[gatewayName]();

            }

            // @todo throw exception...

        }

        function _makeByMethod(depositMethod) {

            try {

                var gateway = {};
                var gatewayName = "";
                var processType = depositMethod.get('processType');

                if (processType === 'basic') {

                    gateway = new Pt.Deposit["BasicDeposit"]();
                    gatewayName = "basic";

                } else if (processType === 'bank_transfer') {

                    gateway = new Pt.Deposit["BankTransfer"]();
                    gatewayName = "bank_transfer";

                } else if (processType === 'custom') {

                    gateway = _make(depositMethod.get('id'));
                    gatewayName = depositMethod.get('methodCode');

                } else if (processType === 'offline_transfer') {

                    gateway = new Pt.Deposit["OfflineTransferDeposit"]();
                    gateway.methodId = depositMethod.get('id');
                    gatewayName = 'offline_transfer';

                } else if (processType === 'offline_qr') {

                    gateway = new Pt.Deposit["OfflineQRDeposit"]();
                    gateway.methodId = depositMethod.get('id');
                    gatewayName = 'offline_qr';
                
                } else if (processType === 'external') {

                    gateway = new Pt.Deposit["CustomDeposit"]();
                    gateway.methodId = depositMethod.get('id');
                    gatewayName = 'custom_deposit';

                } else if (processType === 'dummy_site_scratch_card') {

                    gateway = new Pt.Deposit["ScratchCard"]();
                    gateway.methodId = depositMethod.get('id');
                    depositMethod.apiType = 'dummy';
                    gatewayName = 'scratch_card';

                } else if (processType === 'scratch_card') {

                    gateway = new Pt.Deposit["ScratchCard"]();
                    gateway.methodId = depositMethod.get('id');
                    gatewayName = 'scratch_card';

                }

                if ( processType !== 'external' ) {

                    RulesHelper.extendDepositAmountRules(
                        gatewayName,
                        depositMethod.getMinimumAmount(),
                        depositMethod.getMaximumAmount()
                    );

                }

                var depositValidator = new Validator(gateway.form, RulesHelper.getMethodRules(gatewayName));

                depositValidator.destroy();

                gateway.init(
                    depositMethod,
                    depositValidator
                );

                return gateway;

            } catch (e) {

                void 0;

            }

        }

        function _getMethodName(depositMethodId) {

            return configMap[depositMethodId] || {};

        }


    }

})(
    Pt.Helpers.RulesHelper,
    Pt.Managers.Validation
);

/**
 * Created by rowen on 24/04/2017.
 */

(function(RulesHelper, Validator) {

    _.Class('Pt.Withdrawal.WithdrawalGatewayFactory', new WithdrawalGatewayFactory());

    /**
     * @namespace WithdrawalGatewayFactory
     * @memberOf Pt.Withdrawal
     * @returns {{
	 * 	makeByMethod: _makeByMethod
	 * }}
     * @constructor
     */
    function WithdrawalGatewayFactory() {

        var gatewayMap = {
            // Custom Implementation
            210602: 'OfflineWithdrawal', // api
            210601: 'NetTellerWithdrawal',
            210600: 'CreditCardWithdrawal',
            2208963: 'ScratchCard',
            2208969: 'Gamecard'
        };

        var configMap = {
            // Custom Implementation
            210602: 'offline',
            210601: 'netteller',
            210600: 'credit_card',
            2208963: 'scratch_card',
            2208969: 'gamecard'
        };

        return {
            makeByMethod: _makeByMethod
        };

        ///////////////

        function _makeByMethod(withdrawalMethod) {

            var methodClass = gatewayMap[withdrawalMethod.get('methodId')];
            var gatewayName = "";

            if (methodClass) {

                var gateway = new Pt.Withdrawal[methodClass];

                gatewayName = configMap[withdrawalMethod.get('methodId')];

                RulesHelper.extendWithdrawalAmountRules(
                    gatewayName,
                    withdrawalMethod.getMinimumAmount(),
                    withdrawalMethod.getMaximumAmount()
                );

                gateway.init(
                    withdrawalMethod,
                    new Validator(gateway.form, RulesHelper.getMethodRules(gatewayName, 'withdrawal'))
                );

                return gateway;

            }

            throw new Error('Unrecognized withdrawal method ID: ' + withdrawalMethod.get('methodId'));

        }

    }

})(
    Pt.Helpers.RulesHelper,
    Pt.Managers.Validation
);
/**
 * Abstract Freebet Controller
 * Created by isda on 07/04/2017.
 */

(function (
    Q,
    Contracts,
    Helpers,
    Widgets,
    Managers,
    Services,
    _bindTrait
) {

    'use strict';

    _.Class('Pt.Controllers.AbstractFreeBet', AbstractFreeBet);

    /**
     * @namespace Pt.Controllers.AbstractFreeBet
     * @constructor
     */
    function AbstractFreeBet() {

        this.form = '[data-js=freebet-form]';
        this.actions = [
            [ this.form, 'submit', '_onFormSubmit' ]
        ];

        this.wallets = null;

    }

    AbstractFreeBet.prototype = _.extend(_bindTrait, {

        resolve: function (next) {

            var self = this;

            var requests = [
                Services.Members.WalletService.getAll()
            ];

            Helpers.Preloader.basic(self.container);

            Q.all(requests)
                .then(function (res) {

                    self.wallets = res[0];

                })
                .fail(function () {

                    self.wallets = [];

                })
                .finally(function () {

                    next();

                });

        },

        _onFormSubmit: function(e) {

            e.preventDefault();

            var self = e.data.context;

            self.validator.validate(self._validationSuccess, self);

        },

        _validationSuccess: function (formData) {

            var self = this;

            self.secureFormRequest(self.form, true);

            Helpers.Nprogress.start();

            Services.Members.FreeBetClaimService.claim(formData)
                .then(function() {

                    Helpers.Notify.success(_.trans('funds.freebet_success'));

                    $(self.form)[0].reset();

                    EventBroker.dispatch(EventBroker.events.funds.freebet.success, formData);

                })
                .fail(function(errors) {

                    Helpers.Error.show(errors);

                })
                .finally(function() {

                    self.secureFormRequest(self.form, false);
                    Helpers.Nprogress.done();

                });

        }

    });

})(
    Q,
    Pt.Contracts,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Core.BindTrait)
);

/***********************
 * WIDGETS
 ***********************/

/**
 * @namespace Pt.Widgets
 *
 * Abstract Widget
 * Created by isda on 15/12/2016.
 */

(function ($,
           _,
           $q,
           Helpers,
           bindTrait) {

    'use strict';

    /**
     * @namespace Pt.Widgets.AbstractWidget
     */
    var AbstractWidget = _.extend(bindTrait, {


        secureFormRequest: function (form, secure, shouldResetForm ) {

            shouldResetForm = _.isBoolean(shouldResetForm) ? shouldResetForm : true;

            Helpers.Form.lockForm(form, secure);

            if (! secure && shouldResetForm ) {


                $(form)[0].reset();

            }

        }

    });

    _.Class('Pt.Widgets.AbstractWidget', AbstractWidget);

})(
    jQuery,
    _,
    Q,
    Pt.Helpers,
    _.clone(Pt.Core.BindTrait)
);


/**
 * Created by isda on 21/07/2016.
 */

(function ($,
           _,
           Settings,
           Endpoints,
           Rules,
           Managers,
           absWidget) {

    "use strict";

    _.Class('Pt.Widgets.BaseCaptcha', BaseCaptcha);

    /**
     * @namespace Pt.Widgets.BaseCaptcha
     * @constructor
     */
    function BaseCaptcha() {

        this.el = '[data-js=captcha-container]';
        this.view = {
            standard: 'widgets.captcha'
        };

        this.actions = [
            ['[data-js=refresh-captcha]', 'click', '_onRefreshCaptcha']
        ];

        this.isDownlineSignup = false;
        this.isExternal = false;

    }

    BaseCaptcha.prototype = _.extend(absWidget, {

        activate: function (isDownlineSignup, isExternal) {

            this.isExternal = isExternal || false;

            var shouldShowCaptcha = ( isExternal && Settings.captcha.external_signup ) || 
                ( ! isExternal && Settings.captcha.sign_up );

            if ( ! shouldShowCaptcha ) {

                return this;

            }

            if ( isDownlineSignup ) {
            
                this.isDownlineSignup = true;

            }

            if ($(this.el).length) {

                var url = _.str_replace_key({
                    ':type': 'default',
                    ':case': 'lc'
                }, Endpoints.urls.cms.captcha + '?v=' + _.random(1000, 9999));

                var view = Managers.Template.get(
                    ( isDownlineSignup ? 'a' : '' ) +
                    this.view.standard, {
                        path: url,
                        isEnable: shouldShowCaptcha
                    });

                _.extend(Rules.validation.signup, {

                    captcha: {
                        presence: {
                            message: "^" + _.trans('errors.captcha_required')
                        }
                    }

                });

                _.extend(Rules.validation.fastRegistration,{

                    captcha: {
                        presence: {
                            message: "^" + _.trans('errors.captcha_required')
                        }
                    }

                });

                this.render(this.el, view)
                    ._bindEvents();

            }

        },

        _onRefreshCaptcha: function (e) {

            var self = e.data.context;

            self.activate(self.isDownlineSignup, self.isExternal);

        }

    });

})(jQuery,
    _,
    Pt.Settings,
    Pt.Endpoints,
    Pt.Rules,
    Pt.Managers,
    _.clone(Pt.Widgets.AbstractWidget)
);

/**
 * Created by rowen on 11/04/2017.
 */

(function ($, Template, AbstractWidget) {

    "use strict";

    _.Class('Pt.Widgets.BaseInputPreLoader', BaseInputPreLoader);

    /**
     * @namespace Pt.Widgets.BaseInputPreLoader
     * @constructor
     */
    function BaseInputPreLoader () {

        this.$container = null;
        this.templateName = "widgets.inputPreLoader";

    }

    BaseInputPreLoader.prototype = _.extend(AbstractWidget, {

        activate: function(containerSelector) {

            this.$container = $(containerSelector);

            return this;

        },

        show: function() {

            this.$container.html(Template.get(this.templateName)).show();

        },

        destroy: function() {

            this.$container.html('');

        }


    });

})(
    jQuery,
    Pt.Managers.Template,
    _.clone(Pt.Widgets.AbstractWidget)
);
/**
 * BaseLogin Widget
 * Container: data-widget=login
 *
 * Created by isda on 21/07/2016.
 */

(function ($,
           _,
           Settings,
           Config,
           Rules,
           Helpers,
           Managers,
           Services,
           absWidget) {

    "use strict";

    _.Class('Pt.Widgets.BaseLogin', BaseLogin);

    /**
     * @namespace Pt.Widgets.BaseLogin
     * @constructor
     */
    function BaseLogin() {

        this.inProgress = false;
        this.formValidator = null;
        this.modalValidator = null;
        this.container = '[data-js=signin-container]';
        this.loginForm = '[data-js=login-form]';
        this.el = '[data-widget=login]';
        this.modalForm = this.el + ' [data-js=login-form]';
        this.formType = '';
        this.actions = [

            [this.loginForm, 'submit', "_onFormSubmit"],
            [this.modalForm, 'submit', "_onFormSubmit"]
        ];

    }

    BaseLogin.prototype = _.extend(absWidget, {

        activate: function () {

            var view = Managers.Template.get('widgets.login', {
                logo: Settings.logo,
                title: Settings.operator.name,
                livechat_link: Settings.livechat_link
            });

            this.render(this.container, view);


            if (_.urlHash().toLowerCase() === 'login') {

                $(this.el).modal('show');

            }

            if (this.formValidator !== null) {

                this.formValidator.destroy();
                this.formValidator = null;

            }

            this.formValidator = new Managers.Validation(this.loginForm, Rules.validation.login);
            this.modalValidator = new Managers.Validation(this.modalForm, Rules.validation.login);


            this.formValidator .bindInput(true) .init();
            this.modalValidator .bindInput(true) .init();


            this._clearStyles();
            this._bindEvents();

        },

        _clearStyles: function () {

            var ua = window.navigator.userAgent.toLowerCase();
            var browsers = [ 'qqbrowser', 'metasr'];

            _.find(browsers, function(browser) {

                if (ua.indexOf(browser) > - 1) {

                    $('#username, #password').removeAttr('style');

                    return true;

                }

            });

        },

        _onFormSubmit: function (e) {

            e.preventDefault();
            e.stopPropagation();
            var self = e.data.context;
            var form = this;
            self.formType = $(form).attr('data-formtype');
            self.formType === 'modal' ? self.modalValidator.validate(self._onValidationSuccess, self) :
                self.formValidator.validate(self._onValidationSuccess, self);


        },

        _onValidationSuccess: function (data, self) {

            Helpers.Nprogress.start();

            self.inProgress = true;

            Helpers.Form.lockForm(self.loginForm, true);
            Helpers.Form.lockForm(self.modalForm, true);


            var username = _.findWhere(data, { name: 'username' });
            var password = _.findWhere(data, { name: 'password' });

            Services.Members.SessionService.login(username.value, password.value)
                .then(function (result) {

                    Managers.Analytics.trackEvent(
                        Managers.Analytics.eventMap.MEMBER_ACTIONS,
                        Managers.Analytics.actionMap.LOG_IN_SUCCESS,
                        username.value
                    );

                    Managers.Cookie.set({ name: Config.tokenKey, expires: -1 , value: result.token });
                    Managers.Cookie.set({ name: Config.msSessionKey, expires: -1, value: result.sessionId });
                    Managers.Cookie.set({ name: Config.tokenKey, value: result.token, domain: Settings.main_domain });
                    Managers.Cookie.set({ name: Config.msSessionKey, value: result.sessionId, domain: Settings.main_domain });

                    var returnUrl = _.getParameterByName('url');

                    if (! _.isEmpty(returnUrl)) {

                        return location.href = returnUrl;

                    }

                    if ( Settings.force_login ) {

                        return location.href = '/';

                    }

                    location.reload();

                })
                .fail(function (e) {

                    self.inProgress = false;

                    Helpers.Form.lockForm(self.loginForm, false);
                    Helpers.Form.lockForm(self.modalForm, false);

                    if (e.length) {

                        Managers.Analytics.trackEvent(
                            Managers.Analytics.eventMap.MEMBER_ACTIONS,
                            Managers.Analytics.actionMap.LOG_IN_FAIL,
                            e[0].message
                        );

                    }

                    Helpers.Nprogress.done();

                    Helpers.Error.show(e);

                });

        },

        _showPasswordChangeNotification: function() {

            Helpers.Modal.confirm({
                text: _.trans('profile.password_change_text_message'),
                confirmButton: _.trans('profile.password_change_button_proceed'),
                cancelButton: _.trans('profile.password_change_button_cancel'),
                confirm: function() {

                    location.href = '/profile/change-password';

                },
                cancel: function() {

                    location.reload();

                }

            });

        }



    });

})(jQuery,
    _,
    Pt.Settings,
    Pt.Config,
    Pt.Rules,
    Pt.Helpers,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Widgets.AbstractWidget)
);

/**
 * BaseForgotLogin Widget
 * Container: data-widget=login
 *
 * Created by isda on 21/07/2016.
 */

(function ($,
           _,
           Settings,
           Config,
           Rules,
           Helpers,
           Managers,
           Services,
           absWidget) {

    "use strict";

    _.Class('Pt.Widgets.BaseForgotLogin', BaseForgotLogin);

    /**
     * @namespace Pt.Widgets.BaseForgotLogin
     * @constructor
     */
    function BaseForgotLogin() {

        this.inProgress = false;
        this.validator = null;
        this.container = '[data-js=forgot-login-container]';
        this.form = '[data-js=forgot-login-form]';
        this.el = '[data-widget=forgot-login]';

        this.actions = [

            [this.form, 'submit', "_onFormSubmit"]
        ];

    }

    BaseForgotLogin.prototype = _.extend(absWidget, {

        activate: function () {

            if (_.urlHash().toLowerCase() === 'forgot-login') {

                $(this.el).modal('show');

            }


            var view = Managers.Template.get('widgets.forgotLogin', {
                logo: Settings.logo,
                title: Settings.operator.name
            });

            this.render(this.container, view);




            if (this.validator !== null) {

                this.validator.destroy();
                this.validator = null;

            }

            this.validator = new Managers.Validation(this.form, Rules.validation.forgotLogin);

            this.validator.bindInput(true).init();

            this._bindEvents();

        },

        _onFormSubmit: function (e) {

            e.preventDefault();

            var self = e.data.context;

            self.validator.validate(self._onValidationSuccess, self);

        },

        _onValidationSuccess: function (data, self) {

            Helpers.Nprogress.start();

            self.inProgress = true;
            Helpers.Form.lockForm(self.form, true);

            var username = _.findWhere(data, { name: 'memberCode' });
            var email = _.findWhere(data, { name: 'email' });

            Services.Members.SessionService.forgotLogin(username.value, email.value)
                .then(function (result) {

                    Helpers.Notify.success(result.message);

                })
                .fail(function (e) {

                    Helpers.Error.show(e);

                })
                .finally(function () {

                    self.inProgress = false;

                    Helpers.Form.lockForm(self.form, false);

                    Helpers.Nprogress.done();

                });

        }

    });

})(jQuery,
    _,
    Pt.Settings,
    Pt.Config,
    Pt.Rules,
    Pt.Helpers,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Widgets.AbstractWidget)
);
/**
 * BaseSignup Widget
 * Container: data-widget=signup
 *
 * Created by isda on 21/07/2016.
 */

(function ($,
           _,
           Settings,
           Config,
           Rules,
           Helpers,
           Widgets,
           Managers,
           Services,
           absWidget) {

    "use strict";

    _.Class('Pt.Widgets.BaseSignup', BaseSignup);

    /**
     * @namespace Pt.Widgets.BaseSignup
     * @constructor
     */
    function BaseSignup() {

        this.lang = Managers.Cookie.get('lang');
        this.regType = null;
        this.regTypes = ['full', 'quick'];
        this.redirectUrl = '';

        this.inProgress = false;
        this.validator = null;
        this.validationRules = ['signup', 'fastRegistration'];
        this.signupFormContainer = '[data-js=signup-container]';
        this.signupForms = {
            modal: 'signup-form-modal',
            page: 'signup-form'
        };
        this.el = '[data-widget=signup]';
        this.elDate = '[data-js=date]';
        this.selectDays = '[data-js=select-days]';
        this.selectMonths = '[data-js=select-months]';
        this.selectYears = '[data-js=select-years]';
        this.defaultDate = moment(new Date()).subtract(18, 'years');

        this.phoneCodeText = '[data-js=phone-code-text]';
        this.phoneCode = '[data-js=phone-code]';
        this.countryCode = '[data-js=country-code]';

        this.actions = [

            [this.el, 'shown.bs.modal', "_onWidgetShown"],
            [this.el, 'hidden.bs.modal', "_onWidgetHide"],

            [this.el, 'show.bs.modal', '_onSelectMonthsChange'],
            [this.selectMonths, 'change', '_onSelectMonthsChange'],
            [this.selectYears, 'change', '_onSelectMonthsChange'],

            [this.el, 'show.bs.modal', '_dobSetDate'],
            ['[data-js*=select-]', 'change', '_dobSetDate'],

            [this.el, 'show.bs.modal', '_DOBDefaultDate'],

            [this.phoneCode, 'change','_onPhoneCodeChange' ]

        ];

        this.formContainer = '[data-js=form-container]';
        this.isExternal = false;

    }

    BaseSignup.prototype = _.extend(absWidget, {


        show: function () {

            $(this.el).modal('show');

            return this;

        },

        activate: function (isExternal) {

            this.isExternal = isExternal || false;

            var signup_type = ($(this.el).length) ? 'modal' : 'page';

            this.form = '[data-js=' + this.signupForms[signup_type] + ']';
            this.actions.push([this.form, 'submit', "_onFormSubmit"]);


            if (! $(this.signupFormContainer).length) {

                return;

            }

            var self = this;
            var rule = 'signup';

            Services.Cms.WidgetService.get('signup')
                .then(function (res) {

                    if (! res) {

                        return false;

                    }

                    var mCodes = _.map(res.countries || [], function(countryObj) {

                        return countryObj.phone_code;

                    }).filter(function(mCode) {

                        return mCode;

                    });

                    var countryObj = res['countries'];

                    res = res[self.isDownlineSignup ? 'membersite' : Pt.Settings.site.toLowerCase()];

                    self.regType = self.regTypes[res.registration_type];

                    self.redirectUrl = res.redirect_url;

                    rule = self.validationRules[res.registration_type];

                    var view = Managers.Template.get(
                        (self.isDownlineSignup ? 'awidgets.' : 'widgets.') +
                        self.regTypes[res.registration_type] +
                        'Signup', {
                            logo: Settings.logo,
                            title: Settings.operator.name,
                            livechat_link: Settings.livechat_link,
                            currencies: res.currencies,
                            countries: res.countries,
                            countryObj: countryObj,
                            form: self.signupForms[signup_type],
                            mCodes: mCodes
                        });

                    if (signup_type === 'page') {

                        $('[data-js=signup-btn-link]')
                            .removeAttr('data-toggle')
                            .attr('target', '_self')
                        ;

                    }

                    render(view);

                });

            function render(view) {

                if ( ! self.isExternal ) {

                    self.render(self.signupFormContainer, view);
                
                }

                Widgets.Captcha.activate(self.isDownlineSignup, self.isExternal);

                if (self.validator !== null) {

                    self.validator.destroy();
                    self.validator = null;

                }

                self.validator = new Managers.Validation(self.form, Rules.validation[rule]);

                self._initForm()
                    ._bindEvents();

                self.validator
                    .bindInput(true)
                    .init();

                if ( self.isExternal ) {

                    $(self.formContainer).removeClass('hide');

                }

            }

        },


        _initForm: function () {

            var defaultDate = this.defaultDate;

            Helpers.DatePicker.activate('[data-js=date]', {
                endDate: defaultDate._d,
                language: Managers.Cookie.get('lang'),
                defaultViewDate: defaultDate.format('YYYY/MM/DD')
            }, Config.datePickerLocale[this.lang]);

            var referralId = Managers.Cookie.get('affiliateid') || this.referralId;

            if (referralId) {

                $('[data-js=affiliate-field-container]').addClass('hide');
                $('input[name=affiliateId]').val(referralId);

            }

            if (_.urlHash().toLowerCase() === 'signup') {

                this.show();

            }

            this._onSelectMonthsChange(null, this);
            this._dobSetDate(null, this);

            $(this.selectDays).val(defaultDate.format('DD'));
            $(this.selectMonths).val(defaultDate.format('MM'));

            return this;

        },

        _DOBDefaultDate: function (e) {

            var self = e.data.context;
            var defaultDate = self.defaultDate;

            $(self.selectDays).val(defaultDate.format('DD'));
            $(self.selectMonths).val(defaultDate.format('MM'));
            $(self.selectYears).val(defaultDate.format('YYYY'));

        },

        _onFormSubmit: function (e) {
            
            e.preventDefault();

            var self = e.data.context;
            var frm = $(this);
            var mobile = frm.find('input[name=mobile]');
            var fullName = frm.find('#firstName');

            mobile.val(mobile.val().replace(/^0+/, ''));
            fullName.val(fullName.val().trim());

            self.validator.validate(self._onValidationSuccess, self);

        },

        _onValidationSuccess: function (data, self) {

            if (self.inProgress) {

                return self;

            }

            self.inProgress = true;
            self.secureFormRequest(self.form, true);


            Helpers.Nprogress.start();

            var affiliateObj = _.find(data, function(dataItem) {

                return dataItem.name === "affiliateId";

            });

            var affiliateid = ( affiliateObj && affiliateObj.value ? affiliateObj.value : '' );

            var referBy = _.isEmpty(Managers.Cookie.get('referrerId')) || ! _.isEmpty(affiliateid) ? "" : Managers.Cookie.get('referrerId');

            if (self.isDownlineSignup) {

                data.push({ name: "affiliateId", value: self.referralId });

            }

            data.push({ name: "operatorId", value: Settings.operator.msId });
            data.push({ name: "referBy", value: referBy });

            var serviceMethod = self.regType === 'full' ? 'create' : 'quick';
            
            if ( self.isExternal ) {

                data.push({ name: "external", value: true });

            }


            Services.Members.MemberService[serviceMethod](data)
                .then(function (result) {

                    if (result.shouldVerify) {

                        self._showVerificationMessage();

                        return true;

                    }

                    Managers.Analytics.trackGoal(Managers.Analytics.goalMap.SIGN_UP_SUCCESS);

                    if ( self.isExternal) {

                        $(self.formContainer).addClass('hide');
                        $('[data-js=message-container]').removeClass('hide')

                    } else if ( ! self.isDownlineSignup ) {

                        Managers.Cookie.set({ name: Config.tokenKey, value: result.token, expires: -1 });
                        Managers.Cookie.set({ name: Config.msSessionKey, value: result.sessionId, expires: -1});

                        Managers.Cookie.set({ name: Config.tokenKey, value: result.token, domain: Settings.main_domain });
                        Managers.Cookie.set({ name: Config.msSessionKey, value: result.sessionId, domain: Settings.main_domain});

                        Services.Members.SessionService.verifySession({ session: result.sessionId })
                            .finally(function () {

                                if ( ! _.isEmpty(Managers.Cookie.get('referrerId')) ) {

                                    Managers.Cookie.remove({ name: 'referrerId'});

                                }

                                if ( ! _.isEmpty(Managers.Cookie.get('affiliateid')) ) {

                                    Managers.Cookie.remove({ name: 'affiliateid'});
                                    Managers.Cookie.remove({ name: 'affiliateid', domain: Settings.main_domain});

                                }

                                if ( ! _.isEmpty(Managers.Cookie.get('landingpageid')) ) {

                                    Managers.Cookie.remove({ name: 'landingpageid'});

                                }

                                location.href = self.redirectUrl;


                            });

                    } else {

                        var view = Managers.Template.get('aweb.affiliateSignupSuccess', {
                            message: _.trans('affiliate.downlineCreateMemberSuccess')
                        });

                        Helpers.Modal.info(
                            _.trans('affiliate.signup_success_header'), view, null, {
                                dialogClass: 'affiliate-signup-success',
                                confirmButton: _.trans('affiliate.signup_success_confirm_button')
                            }
                        );

                    }

                    self.secureFormRequest(self.form, false);

                })
                .fail(function (e) {

                    if (_.has(e, 'ErrorMessage')) {

                        Managers.Analytics.trackEvent(
                            Managers.Analytics.eventMap.MEMBER_ACTIONS,
                            Managers.Analytics.actionMap.SIGN_UP_FAIL,
                            e['ErrorMessage']
                        );

                    }

                    Helpers.Nprogress.done();
                    Helpers.Error.show(e);
                    self.secureFormRequest(self.form, false, false);

                }).finally(function () {

                    self.inProgress = false;
                    Helpers.Nprogress.done();
                    Widgets.Captcha.activate(self.isDownlineSignup, self.isExternal);

                })
            ;

        },

        _onWidgetShown: function () {

            $('html').css({ 'overflow-y': 'hidden' });

        },

        _onWidgetHide: function (e) {

            $('html').css({ 'overflow-y': 'auto' });

            Helpers.Form.lockForm(e.data.context.form, false);

        },

        _showVerificationMessage: function () {

            var self = this;

            Services.Cms.WidgetService.get('signup_verification_message')
                .then(function (res) {

                    $(self.el).modal('hide');

                    Pt.Helpers.Modal.generic(res.check_email_message);

                });

        },

        _getDaysInMonth: function (year, month, selectedDay) {

            var self = this;
            var defaultDate = self.defaultDate;

            if( month === undefined && year === undefined ) {

                month = defaultDate.format('MM');
                year = defaultDate.format('YYYY');

            }

            var count = moment(year + '-' + month, 'YYYY-MM').daysInMonth();
            var days = [];

            for (var i = 0; i < count; i++) {

                days.push(moment().month(month - 1).year(year).date(i + 1));

            }

            $('option', $(self.selectDays)).remove();

            _.each(days, function (day) {

                $(self.selectDays).append($('<option>', {
                    value: day.format('DD'),
                    text: day.format('D'),
                    selected: selectedDay  === day.format('DD')
                }));

            });

        },

        _onSelectMonthsChange: function (e, self) {

            if ( ! _.isNull(e) ) {

                self = e.data.context;

            }

            self._getDaysInMonth($(self.selectYears).val(), $(self.selectMonths).val(), $(self.selectDays).val());

        },

        _dobSetDate: function (e, self) {

            if ( ! _.isNull(e) ) {

                self = e.data.context;

            }

            if ( $(self.elDate).val() === '' || $(self.elDate).val() === undefined ) {

                $(self.elDate).val(self.defaultDate.format('YYYY/MM/DD'));

            } else {

                $(self.elDate).val($(self.selectYears).val() + '/' + $(self.selectMonths).val() + '/' + $(self.selectDays).val());

            }

        },

        _onPhoneCodeChange: function(e) {

            var self = e.data.context;
            var country = $(this.options[this.selectedIndex]).data('country');
            var phone = $(this.options[this.selectedIndex]).val();

            // change phone text
            $(self.phoneCodeText).text('+' + phone);

            // change country code
            $(self.countryCode).val(country);

		}

    });

})(jQuery,
    _,
    Pt.Settings,
    Pt.Config,
    Pt.Rules,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Widgets.AbstractWidget)
);

/**
 * BaseBanners Widget
 * Container: data-widget=banner
 *
 * Created by isda on 21/07/2016.
 */

(function ($,
           _,
           Settings,
           Config,
           Managers,
           Services,
           Helpers,
           absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseBanners', BaseBanners);

    /**
     * @namespace Pt.Widgets.BaseBanners
     * @constructor
     */
    function BaseBanners () {

        this.view = {
            _default: "widgets.banner_default",
            _affiliate: "awidgets.banner_default"
        };

        this.el = '[data-widget=banner]';

        this.bannerItems = [];

        this.bannerContainer = '[data-js="banners-container"]';

        this.bannerLoader = '[data-js=banner-loader]';

        this.initialBannerId = null;

    }

    BaseBanners.prototype = _.extend(absWidget, {

        activate: function (params) {

            var self = this;

            if (! $(this.el).length) {
                return;

            }

            self.initialBannerId = $(this.el).find('img').data('banner-id');

            Services.Cms.BannerService.get(params.banner_page)
                .then(function (res) {

                    self.bannerItems = res;

                    var initializedBannerIndex = _.pluck(self.bannerItems,'_id').indexOf(self.initialBannerId);

                    if(initializedBannerIndex > -1)
                    {
                        self.bannerItems.splice(initializedBannerIndex,1);
                    }

                    var template = self.view[Settings.site === 'MemberSite' ? '_default' : '_affiliate'];

                    var view = Managers.Template.get(template, {
                        bannerItems: self.bannerItems
                    });

                    self.render(self.bannerContainer, view, {behavior: 'append'})
                        .activateSlider(params)
                    ;

                });

        },

        activateSlider: function () {

            var self = this;

            var hero = $(this.el).find('.hero');

            if (hero.length) {

                $(self.bannerLoader).removeClass('hide');

                _.delay(function () {

                    hero.find('img').css('display', 'block');

                    hero.slick(Config.slickOptions);

                    $('.hero-slide').removeClass('hide');

                    $(self.bannerLoader).remove();

                }, 1000);

            }

        }

    });

})(jQuery,
    _,
    Pt.Settings,
    Pt.Config,
    Pt.Managers,
    Pt.Services,
    Pt.Helpers,
    _.clone(Pt.Widgets.AbstractWidget)
);
/**
 * Abstract Balance Widget
 * Created by isda on 06/04/2017.
 */

(function (
    Q,
    Config,
    Helpers,
    Settings,
    Services,
    absWidget
) {

    'use strict';

    _.Class('Pt.Widgets.AbstractBalance', AbstractBalance);

    var walletsWithBalance = null;
    var hasOngoingRequest = false;

    /**
     * @namespace Pt.Widgets.AbstractBalance
     * @constructor
     */
    function AbstractBalance() {

        this.wallets = null;

    }

    AbstractBalance.prototype = _.extend(absWidget, {

        hasOngoingRequest: function () {

            return hasOngoingRequest;

        },

        refreshWalletBalance: function () {

            walletsWithBalance = null;
            this.activate();

        },

        setWallets: function (wallets) {

            this.wallets = wallets;

            return this;

        },

        computeTotalBalance: function (wallets, currency) {

            currency = currency.toUpperCase();

            if (! wallets) {

                return _.toCurrency(0);

            }

            var memo = 0;

            _.each(wallets, function (wallet) {

                var walletCurrencyMap = Config.wallets.currency['wallet_' + wallet.id];

                if (typeof walletCurrencyMap === 'undefined') {

                    memo += _.toFloat(wallet.balance);

                } else {

                    if (walletCurrencyMap ===  currency) {

                        memo += _.toFloat(wallet.balance);

                    }

                }

            });

            return _.toCurrency(memo);

        },

        getBalances: function (force) {
            
            var defer = Q.defer();

            if (hasOngoingRequest) {

                var tOut = null;

                var onBalanceReady = function () {

                    if (! hasOngoingRequest ) {

                        clearInterval(tOut);

                        defer.resolve(walletsWithBalance);

                    }

                };

                tOut = setInterval(onBalanceReady, 800);

                return defer.promise;

            }

            if( force ) {

                walletsWithBalance = null;

            }

            if ( walletsWithBalance !== null ) {

                defer.resolve(walletsWithBalance);

            } else {

                hasOngoingRequest = true;

                var self = this;

                self.promises = [
                    Services.Members.WalletService.getWalletsWithBalance()
                ];

                if ( Settings.has_rewards ) {

                    self.promises.push(Services.Members.MemberService.rewards());

                }

                Q.all(self.promises).then( function ( res ) { 
                    
                    walletsWithBalance = res;

                })
                .fail(function() {

                        defer.resolve([]);

                    })
                    .finally(function () {

                        hasOngoingRequest = false;

                        defer.resolve(walletsWithBalance);

                    })
                ;

            }

            return defer.promise;

        }

    });



})(
    Q,
    Pt.Config,
    Pt.Helpers,
    Pt.Settings,
    Pt.Services,
    _.clone(Pt.Widgets.AbstractWidget)
);
/**
 * MainBalance Widget
 * Container: data-widget=header-balance
 *
 * Created by isda on 16/03/2017.
 */

(function (
    Settings,
    Helpers,
    Managers,
    _absBalance
) {

    "use strict";

    _.Class('Pt.Widgets.BaseMainBalance', MainBalance);


    var indicatorTpl = '<span data-js="wallet-indicator" class="fade in data-icon :arrow:"></span>';

    /**
     * @namespace Pt.Widgets.MainBalance
     * @return {Class}
     * @constructor
     */
    function MainBalance () {

        this.balanceContainer = '[data-widget=main-balance]';
        this.itemContainer = '[data-js=wallet-item-container]';
        this.transferFrom = null;
        this.transferTo = null;

        this.actions = [
            ['[data-js=btn-refresh-balance]', 'click', 'onRefreshBalanceClick']
        ];

        this.subscription = [
            EventBroker.subscribe(EventBroker.events.funds.transfer.walletSelect, '_onWalletSelected', this),
            EventBroker.subscribe(EventBroker.events.funds.transfer.complete, 'refreshWalletBalance', this),
            EventBroker.subscribe(EventBroker.events.funds.freebet.success, 'refreshWalletBalance', this)
        ];

    }

    MainBalance.prototype = _.extend(_absBalance, {

        preRender: function (container) {

            container = container || this.balanceContainer;

            var view = Managers.Template.get('widgets.mainBalance', {
                wallets: this.wallets,
                totalBalance: '',
                loadClass: 'loading-wallet'
            });

            this.render(container, view);

            return this;

        },

        /**
         * @param container
         */
        activate: function (container) {

            var self = this;

            this.preRender(container);

            this.getBalances()
                .then(function (res) {

                    var view = Managers.Template.get('widgets.walletItems', {
                        wallets: res[0],
                        totalBalance: self.computeTotalBalance(res[0], Settings.member.currency),
                        loadClass: ''
                    });

                    self.render(self.itemContainer, view)
                        ._bindEvents()
                        ._showWalletIndicator();

                });

        },

        onRefreshBalanceClick: function (e) {

            var self = e.data.context;

            self.refreshWalletBalance();

        },

        _onWalletSelected: function (obj) {

            try {

                var key = Object.keys(obj)[0];

                this[key] = obj[key];

            } catch (e) {}

            var indicator = $('[data-js=wallet-indicator]');

            var fromEl = $('[data-js=wallet-value-' + this.transferFrom + ']' );
            var toEl = $('[data-js=wallet-value-' + this.transferTo + ']' );

            indicator.remove();

            fromEl.after(_.str_replace_key({
                ':arrow:': 'icon-arrow-up'
            }, indicatorTpl));

            toEl.after(_.str_replace_key({
                ':arrow:': 'icon-arrow-down'
            }, indicatorTpl));

        },

        reformat_amount: function(res) {

            var temp = res;
            _.each(temp, function(elem, key) {

                temp[key].balance = _.toCurrency(elem.balance === '-' ? 0 : elem.balance);


            });

            return temp;

        },

        _showWalletIndicator: function() {

            this._onWalletSelected();

        },

        clearWalletIndicator: function() {

            this.transferFrom = null;
            this.transferTo = null;
            this._onWalletSelected();

            return this;

        }


    });



})(
    Pt.Settings,
    Pt.Helpers,
    Pt.Managers,
    new Pt.Widgets.AbstractBalance
);
/**
 * BaseHeaderBalance Widget
 * Container: data-widget=header-balance
 *
 * Created by isda on 16/03/2017.
 */

(function (
    Settings,
    Helpers,
    Managers,
    _absBalance
) {

    "use strict";

    _.Class('Pt.Widgets.BaseHeaderBalance', BaseHeaderBalance);

    /**
     * @namespace Pt.Widgets.BaseHeaderBalance
     * @return {Class}
     * @constructor
     */
    function BaseHeaderBalance () {

        this.balanceContainer = '[data-widget=header-balance]';
        this.force = false;
        this.activated = false;

    }

    BaseHeaderBalance.prototype = _.extend(_absBalance, {
        /**
         * @param container
         */
        activate: function (container) {

            if (! Settings.member.isLoggedIn) {

                return this;

            }

            container = container || this.balanceContainer;

            var self = this;

            if ( ! self.activated || self.force ) {

                Helpers.Preloader.small(container);

            }

            self.getBalances(self.force)
                .then(function (res) {

                    var view = Managers.Template.get('widgets.headerBalance', {
                        wallets: res[0],
                        totalBalance: self.computeTotalBalance(res[0], Settings.member.currency),
                        rewardsPoint: res[1] ? res[1].getPointsBalance() : [],
                        rewardsUrl: self._getRewardsSite()
                    });

                    self.attachTotal(res[0]);
                    self.render(container, view);
                    self.activated = true;

                });

        },

        _getRewardsSite: function() {

            var rewards_url = [];
            var memberDomainMap = _.propertyValue(Settings.domain, 'membersite', []);

            _.each(memberDomainMap, function(mapItem) {

                if ( window.location.hostname === mapItem.member_domain ) {

                    var url = _.isEmpty(mapItem.rewards_domain) ?  '//rewards.' + Settings.app_domain : '//' + mapItem.rewards_domain;

                    rewards_url.push(window.location.protocol + url);

                }

            });

            return rewards_url;
        },

        attachTotal: function (wallets) {

            $('[data-js=total-wallet-balance]').html(this.computeTotalBalance(wallets, Settings.member.currency));

        },

        setForce: function ( value ) {

            this.force = false;

            if ( value ) {

                this.force = true;

            }

            return this;

        }

    });


})(
    Pt.Settings,
    Pt.Helpers,
    Pt.Managers,
    new Pt.Widgets.AbstractBalance
);
/**
 * Balance Widget
 * Container: data-widget=header-balance
 *
 * Created by isda on 16/03/2017.
 */

(function (
    Widgets
) {

    "use strict";

    _.Class('Pt.Widgets.BaseBalance', BaseBalance);

    var headerBalanceInstance = null;
    var mainBalanceInstance = null;

    /**
     * @namespace Pt.Widgets.Balance
     * @return {{headerBalance: headerBalance}}
     * @constructor
     */
    function BaseBalance () { }

    BaseBalance.prototype = {

        headerBalance: function () {

            if (headerBalanceInstance) {

                return headerBalanceInstance;

            }

            var ins = new Widgets.HeaderBalance();

            headerBalanceInstance = ins;

            return ins;

        },

        mainBalance: function () {

            if (mainBalanceInstance) {

                return mainBalanceInstance;

            }

            var ins = new Widgets.MainBalance();

            mainBalanceInstance = ins;

            return ins;

        }

    };



})(
    Pt.Widgets
);
/**
 * Created by rowen on 22/09/2016.
 */
(function (
    $,
    Q,
    BonusCodeService,
    Template,
    WidgetService,
    AbstractWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseBonusCodeRadio', BaseBonusCodeRadio);

    /**
     * @namespace Pt.Widgets.BaseBonusCodeRadio
     * @constructor
     */
    function BaseBonusCodeRadio () {

        this.view = "widgets.bonusCodeRadio";

        this.actions = [
            [ '[data-js=promo-code-selection]', 'click', '_selectBonusCode' ]
        ];

        this.bonusCodesContainer = null;
        this.promoCodeInputContainer = null;
        this.subscription = [];

    }

    BaseBonusCodeRadio.prototype = _.extend(AbstractWidget, {

        activate: function (bonusCodesContainer, promoCodeInputContainer) {

            this.bonusCodesContainer = $(bonusCodesContainer);
            this.promoCodeInputContainer = $(promoCodeInputContainer);

            this.subscription.push(
                EventBroker.subscribe(EventBroker.events.funds.transfer.walletSelect, '_onWalletSelected', this),
                EventBroker.subscribe(EventBroker.events.funds.transfer.complete, '_clearBonusCodeList', this)
            );

            this._bindEvents();

        },


        /***************************************************
         * EVENT HANDLERS
         ***************************************************/

        _onWalletSelected: function (data) {

            if ('transferFrom' in data ) {

                if (data.transferFrom === 0) {

                    this._showBonusCodeList();

                } else {

                    this._clearBonusCodeList();

                }

            }

        },

        _showBonusCodeList: function() {

            var self = this;

            self.promoCodeInputContainer.removeClass('hide');

            EventBroker.dispatch(EventBroker.events.funds.transfer.bonusCodeFetchStart);

            var promises = [
                WidgetService.get('fund_transfer_promo_grouping'),
                BonusCodeService.getAll()
            ];

            Q.allSettled(promises).then(function(res) {

                var groupSettings = res[0].state === 'fulfilled' ? res[0].value : {};
                var bonusCodes = res[1].state === 'fulfilled' ? res[1].value : [];
                var codes = self._groupBonusCodes(groupSettings, bonusCodes);

                var view = Template.get(self.view, {
                    bonusCodes: codes
                });

                self.bonusCodesContainer.html(view).show();
                self.activated = true;

            });
        },

        _groupBonusCodes: function (grouping, codes) {

            _.each(grouping, function (group, key) {

                group.promos = _.filter(codes, function (code) {

                    if (code.promoType === 2) {

                        return null;

                    }

                    if (key === 'all') {

                        return code;

                    }

                    if (key === 'new_member' && code.promoType === 3) {

                        return code;

                    }

                    if (typeof group.product_code !== 'undefined' &&
                        code.promoType !== 3 &&
                        group.product_code.indexOf(code.productCode) > - 1 ) {

                        return code;

                    }

                });

            });

            return grouping;

        },

        _selectBonusCode: function() {

            var $this = $(this);
            var bonusCode = $this.val();
            var walletId = $this.data('wallet-id') || null;

            var $promoCode = $('[data-js=promo-code-input]');

            $promoCode.val(bonusCode);

            EventBroker.dispatch(EventBroker.events.funds.transfer.bonusCodeSelect, {
                bonusCode: bonusCode,
                walletId: walletId
            });

        },

        _clearBonusCodeList: function() {

            this.bonusCodesContainer.hide();
            this.promoCodeInputContainer.addClass('hide').find('input').val("");

        }

    });

})(
    jQuery,
    Q,
    Pt.Services.Members.BonusCodeService,
    Pt.Managers.Template,
    Pt.Services.Cms.WidgetService,
    _.clone(Pt.Widgets.AbstractWidget)
);
/**
 * Created by rowen on 22/09/2016.
 */
(function (
    $,
    BonusCodeService,
    Template,
    AbstractWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseBonusCode', BaseBonusCode);

    /**
     * @namespace Pt.Widgets.BaseBonusCode
     * @constructor
     */
    function BaseBonusCode () {

        this.view = "widgets.bonusCode";

        this.actions = [
            [
                '[data-js=promo-code-selection]', 'change', '_selectBonusCode'
            ]
        ];

        this.$container = null;

        this.subscription = [];

    }

    BaseBonusCode.prototype = _.extend(AbstractWidget, {

        activate: function (bonusCodeContainer) {

            this.$container = $(bonusCodeContainer);

            this.subscription.push(
                EventBroker.subscribe(EventBroker.events.funds.transfer.walletSelect, '_onWalletSelected', this),
                EventBroker.subscribe(EventBroker.events.funds.transfer.complete, '_clearBonusCodeList', this)
            );

            this._bindEvents();

        },


        /***************************************************
         * EVENT HANDLERS
         ***************************************************/

        _onWalletSelected: function (data) {

            if ('transferFrom' in data ) {

                if (data.transferFrom === 0) {

                    this._showBonusCodeList();

                } else {

                    this._clearBonusCodeList();

                }

            }

        },

        _showBonusCodeList: function() {

            var self = this;

            EventBroker.dispatch(EventBroker.events.funds.transfer.bonusCodeFetchStart);

            BonusCodeService.getAll()
                .then(function(bonusCodes) {

                    var template = Template.get(self.view, {
                        bonusCodes: bonusCodes
                    });

                    self.$container.html(template).show();
                    self.activated = true;

                })
                .finally(function() {

                    EventBroker.dispatch(EventBroker.events.funds.transfer.bonusCodeFetchEnd);

                });

        },

        _selectBonusCode: function() {

            var $this = $(this);
            var bonusCode = $this.val();
            var walletId = $this.find(":selected").data('wallet-id') || null;

            var $promoCode = $('[data-js=promo-code-input]');
            var $promoCodeContainer = $('[data-js=promo-code-input-container]');

            if (bonusCode === 'other') {

                $promoCode.val("");
                $promoCodeContainer.show();

            } else {

                $promoCode.val(bonusCode);
                $promoCodeContainer.hide();

            }

            EventBroker.dispatch(EventBroker.events.funds.transfer.bonusCodeSelect, {
                bonusCode: bonusCode,
                walletId: walletId
            });

        },

        _clearBonusCodeList: function() {

            this.$container.hide();

            $('[data-js=promo-code-input]').val("");

        }

    });

})(
    jQuery,
    Pt.Services.Members.BonusCodeService,
    Pt.Managers.Template,
    _.clone(Pt.Widgets.AbstractWidget)
);
/**
 * BaseLanguage Widget
 * Container: data-widget=language
 *
 * Created by isda on 21/07/2016.
 */

(function ($,
           _,
           absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseLanguage', BaseLanguage);

    /**
     * @namespace Pt.Widgets.BaseLanguage
     * @constructor
     */
    function BaseLanguage () {

        this.view = {
            _default: "web.banner"
        };

        this.el = '[data-widget=language]';

    }

    BaseLanguage.prototype = _.extend(absWidget, {

        activate: function (opts) {



        }

    });

})(jQuery,
    _,
    _.clone(Pt.Widgets.AbstractWidget)
);
/**
 * BaseAnnouncements Widget
 * Container: data-widget=announcements
 *
 * Created by isda on 21/07/2016.
 */

(function ($,
           _,
           Settings,
           Config,
           Template,
           Managers,
           Services,
           Modal,
           absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseAnnouncements', BaseAnnouncements);

    /**
     * @namespace Pt.Widgets.BaseAnnouncements
     * @constructor
     */
    function BaseAnnouncements () {

        this.announcements = null;
        this.announcementCategories = null;
        this.type = 'marquee';
        this.view = 'widgets.announcementsMarquee';
        this.modal = 'widgets.announcementsNotification';
        this.cashier = 'widgets.cashier';
        this.el = '[data-widget=announcements]';
        this.elModal = '[data-widget=notifications]';
        this.elModalContent = '[data-js=notifications-content]';
        this.notificationEl = '[data-js=announcements-notification]';
        this.unreadEl = '[data-js=announcements-unread]';

        this.readAnnouncementsKey = 'member.readAnnouncements';
        this.readAnnouncements = [];
        this.unreadAnnouncements = [];

        this.actions = [
            ['[data-js=announcement-btn]',  'click', '_onAnnouncementBtnClick'],
            ['[data-js=announcement-item]',  'click', '_onAnnouncementItemClick'],
            ['[data-js=announcement-container]',  'click', '_onAnnouncementItemClick'],
            ['[data-js=announcements-notification]',  'click', '_onAnnouncementNotificationClick'],
            ['[data-js=ca-pop-check]',  'click', '_onCaPopCheck']
        ];

    }

    BaseAnnouncements.prototype = _.extend(absWidget, {

        activate: function () {

            Services.Members.AnnouncementService.getAnnouncements()
                .then( _.bind(this._onAnnouncementReady, this) );

        },

        _onAnnouncementReady: function (res) {

            EventBroker.dispatch(EventBroker.events.announcements.ready, res);

            this.announcements = res.announcement_list || [];
            this.announcementCategories = res.category_list;

            var markUp = Template.get(this.view, {
                announcements: res.announcement_list
            });


            this.modalTabs = _.map(this.announcementCategories, function (item) {

                return {

                    key: Config.announcements['cat_id_' + item.id],
                    cat_id: item.id

                };

            });

            this.render(this.el, markUp)
                ._bindEvents();

            var marqueeEl = $('[data-js=marquee]');

            if ( marqueeEl.length ) {

                var marqueeWrapperEl = $('[data-js=marquee-wrapper]');
                var marqueeSpeed = 55;
                var marqueeWidth = marqueeEl[0].getBoundingClientRect().width;
                var marqueeWrapperWidth = marqueeWrapperEl[0].getBoundingClientRect().width;
                var marqueeLoopTime = ( marqueeWidth + marqueeWrapperWidth ) / marqueeSpeed;

                // animation
                marqueeEl.css({
                    'animation-name': 'loop-scroll',
                    'animation-duration': marqueeLoopTime + 's',
                    'animation-timing-function': 'linear',
                    'animation-iteration-count': 'infinite'
                });

            }

            if ( ! _.isEmpty(res)) {

                var hasRead = Managers.Cache.get('notifyHasRead');

                if (! hasRead) {

                    $('[data-js=announcements-notify]').addClass('in');

                }

            }

            this.activateNotifications();

            this.removeCashierCookiesOnLogout();

            this.updateNotification();

        },

        _onAnnouncementItemClick: function (e) {

            var self = e.data.context;
            var el = $(this);
            var ids = el.data('id').split('|');
            var tabs = _.map(self.announcementCategories, function (item) {

                return {

                    key: Config.announcements['cat_id_' + item.id],
                    cat_id: item.id

                };

            });

            var view = Template.get(self.modal, {

                ids: {
                    cat_id: ids[0],
                    id: ids[1]
                },
                tabs: tabs,
                announcements: self.announcements

            });

            self.render(self.elModalContent, view);
            $(self.elModal).modal('show');
            self.flagAnnouncementsAsRead();

        },

        _onAnnouncementBtnClick: function (e) {

            e.preventDefault();

            var self = e.data.context;

            var tabs = _.map(self.announcementCategories, function (item) {

                return {

                    key: Config.announcements['cat_id_' + item.id],
                    cat_id: item.id

                };

            });

            if (_.isEmpty(tabs)) {

                return;

            }


            var view = Template.get(self.modal, {

                ids: {
                    cat_id: tabs[0].cat_id
                },
                tabs: tabs,
                announcements: self.announcements

            });

            Modal.generic(view, {
                additionalClass: 'announcements'
            });

            Managers.Cache.set('notifyHasRead', true, {
                TTL: 3600000
            });

            $('[data-js=announcements-notify]').removeClass('in');

        },

        activateCashier: function (category) {

            var caPop = Managers.Cookie.get('_ca_' + category);

            if (Settings.module === 'Funds' && _.isEmpty(caPop) ) {

                Services.Members.AnnouncementService.getCashierAnnouncements()
                    .then( _.bind(this._onCashierAnnouncementReady, this, category) );

            }

        },

        _onCashierAnnouncementReady: function (categ, res) {

            var elModal = $(this.elModal);
            var map = {
                deposit: "9",
                fund_transfer: "10",
                withdrawal: "11"

            };

            if ( ! _.isEmpty (_.where(res, { announcementCatId: map[categ] }))) {

                var markUp = Template.get(this.cashier, {
                    announcements: res,
                    category: map[categ],
                    category_key: categ
                });

                this.render(this.elModalContent, markUp)
                    ._bindEvents();

                elModal.modal('show');

            }

        },

        _onCaPopCheck: function () {

            var  el = $(this);

            if (el.prop('checked')) {

                Managers.Cookie.set({
                    name: '_ca_' + el.val(),
                    value: 1
                });

            } else {

                Managers.Cookie.remove({
                    name: '_ca_' + el.val()
                });

            }

        },

        removeCashierCookiesOnLogout: function() {

            var map = {
                deposit: "_ca_deposit",
                fund_transfer: "_ca_fund_transfer",
                withdrawal: "_ca_withdrawal"
            };

            _.find( map, function ( val ) {

                var caCookie = Managers.Cookie.get(val);

                if ( ! Settings.member.isLoggedIn && caCookie > 0 && caCookie !== undefined ) {

                    Managers.Cookie.remove({

                        name: val

                    });
                }

            });

        },

        _onAnnouncementNotificationClick: function(e) {

            e.preventDefault();
            var self = e.data.context;

            var ids = {
                cat_id: self.announcements[0] ? self.announcements[0].category_id : '',
                id: self.announcements[0] ? self.announcements[0].id : ''
            };

            var view = Template.get(self.modal, {
                ids: ids,
                tabs: self.modalTabs,
                announcements: self.announcements
            });

            self.render(self.elModalContent, view);
            self.announcements.length > 0 ? $(self.elModal).modal('show') : '' ;
            self.flagAnnouncementsAsRead();

        },

        activateNotifications: function() {

            var notif = $(this.notificationEl);

            if ( notif.length ) {

                var self = this;

                this.readAnnouncements = Managers.Cache.get(this.readAnnouncementsKey) || [];
                this.unreadAnnouncements = _.filter(this.announcements, function(announcement) {

                    return ! ~ self.readAnnouncements.indexOf(announcement.id);

                });

                this.updateNotification();

                $(self.elModal).on('hidden.bs.modal', function(e) {

                    self.unreadAnnouncements = [];
                    self.updateNotification();

                });

            }

        },

        updateNotification: function() {

            var notif = $(this.notificationEl);
            var count = $(this.unreadEl);
            var marquee = $(this.el);

            if ( this.unreadAnnouncements.length ) {

                count.text(this.unreadAnnouncements.length);
                count.removeClass('hide');
                notif.addClass('blue');
                notif.removeClass('disabled');
                marquee.removeClass('disabled');

            } else if ( this.announcements.length ) {

                notif.removeClass('blue');
                count.addClass('hide');

            } else {

                notif.removeClass('blue');
                notif.addClass('disabled');
                marquee.addClass('disabled');
                count.addClass('hide');

            }

        },

        flagAnnouncementsAsRead: function() {

            var self = this;

            if ( self.unreadAnnouncements.length ) {

                _.each(self.unreadAnnouncements, function(announcement) {

                    self.readAnnouncements.push(announcement.id);

                });

                Managers.Cache.set(self.readAnnouncementsKey, self.readAnnouncements);

            }

        }
    });

})(jQuery,
    _,
    Pt.Settings,
    Pt.Config,
    Pt.Managers.Template,
    Pt.Managers,
    Pt.Services,
    Pt.Helpers.Modal,
    _.clone(Pt.Widgets.AbstractWidget)
);

/**
 * BaseJackpot Widget
 * Container: data-widget=jackpot
 *
 * Created by isda on 21/07/2016.
 */

(function ($,
           _,
           Settings,
           Managers,
           Template,
           Services,
           absWidget,
           Helpers
) {

    "use strict";

    _.Class('Pt.Widgets.BaseJackpot', BaseJackpot);

    /**
     * @namespace Pt.Widgets.BaseJackpot
     * @constructor
     */
    function BaseJackpot () {

        this.view = 'widgets.jackpot';
        this.el = '[data-widget=jackpot_:type]';
        this.valueEl = '[data-js=jackpot-value-:type]';

        this.jackpotObject = Settings.jackpot;

        this.actions = [
            [window, 'unload', '_onWindowUnload'],
            ['[data-js=jackpot-data-url]', 'click', '_redirect']
        ];

    }

    BaseJackpot.prototype = _.extend(absWidget, {

        activate: function () {

            var self = this;

            _.each(this.jackpotObject, function (item) {

                var view = Template.get(self.view, item);

                var el =  _.str_replace_key({
                    ':type': item.type
                }, self.el);

                self.render(el, view);

            });

            this._bindEvents();

            this.loadJackpot();

        },

        _onWindowUnload: function (e) {

            var self = e.data.context;

            Managers.Cache.set('jackpot', self.jackpotObject);

        },

        loadJackpot: function () {

            var self = this;

            var instances = {};

            _.each(this.jackpotObject, function (item) {

                var jackpotEl = _.str_replace_key({
                    ':type': item.type
                }, self.valueEl);

                jackpotEl = $(jackpotEl);

                if (jackpotEl.length) {

                    instances[item.type] = new Odometer({
                        el: jackpotEl[0],
                        theme: 'default',
                        value: _.toCurrency(item.jackpot_amount),
                        format: '(,ddd).dd'
                    });

                }

            });

            /***************************************
             * Loop to all instance of Odometer
             * and update value
             * @param type
             * @param obj
             ***************************************/
            function updateJackpot(type, obj) {

                if (! instances[type]) {

                    return;
                    
                }

                obj.jackpot_amount = + obj.jackpot_amount + Math.random();

                instances[type].update(_.toCurrency(obj.jackpot_amount));

                /***********************************
                 * Random Timeout from 1 to 3s
                 * before update
                 **********************************/

                setTimeout(function() {

                    updateJackpot(type, obj);

                }, Math.random() * 3000 );

            }

            _.each(this.jackpotObject, function (item) {

                updateJackpot(item.type, item);

            });

        },

        _redirect: function(evt) {

            evt.preventDefault();

            var href =  $(this).attr('href');

            if (href === location.pathname) {

                return this;

            }

            window.location = href;

        }


    });

})(jQuery,
    _,
    Pt.Settings,
    Pt.Managers,
    Pt.Managers.Template,
    Pt.Services,
    _.clone(Pt.Widgets.AbstractWidget),
    Pt.Helpers
);
/**
 * BaseFeaturedGame Widget
 * Created by bespino on 11/10/2017.
 */

(function(
    Managers,
    Services,
    Settings,
    absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseFeaturedGame', BaseFeaturedGame);

    /**
     * @namespace Pt.Widgets.BaseJackpot
     * @constructor
     */
    function BaseFeaturedGame () {

        this.cardTemplate = 'widgets.featuredGame';
        this.container = 'widgets.featuredGameContainer';
        this.actions = [];
        this.featured_games = [];
        this.featuredGameCard = '[data-js=featuredGameCard]';
        this.featuredLauncher = '[data-js=featuredLauncher]';
        this.closeFeaturedCard = '[data-js=closeFeaturedCard]';
        this.cardContainer = '[data-js=cardContainer]';
        this.behaviorAttriMapping = {

            game_launcher: 'data-hook=launch-if-auth',
            link: 'data-hook=link'

        };
        this.actions = [
            [this.closeFeaturedCard, 'click', '_closeFeaturedCard'],
            [this.featuredGameCard + ' .card', 'click', '_onGameLaunch']
        ];

        this.displayInterval = null;
        this.index = 0;
        this.gameList = [];
        this.game = null;

    }

    BaseFeaturedGame.prototype = _.extend(absWidget, {

        activate: function () {

            var _self = this;
            Services.Cms.FeaturedGameService.fetch().then(function(featured_games) {

                _self.featured_games = featured_games.games;
                if ( _.size(_self.featured_games) ) {

                    _self.init({
                        interval: featured_games.interval,
                        animation_duration: featured_games.animation_duration,
                        behavior: featured_games.behavior || 'random'
                    });
                    var container = Managers.Template.get(_self.container);
                    $('body').append(container);

                }



            });

            this._bindEvents();


        },
        init: function(options) {

            var _self = this;

            _self.displayInterval = setInterval(function() {

                if( options.behavior === 'random') {
                    _self.displayFeaturedGame(_self.random(), options);
                } else {
                    _self.displayFeaturedGame(_self.sequence(), options);
                    _self.index++;
                }

            }, options.interval * 1000);

        },

        random: function() {

            var _self = this;

            _self.gameList = _.sample( _self.featured_games,  _self.featured_games.length );
            _self.game = _self.gameList[0] == _self.game ? _self.gameList[1] : _self.gameList[0];

            return _self.game;
        },

        sequence: function() {

            var _self = this;

            _self.index = _self.index < _self.featured_games.length ? _self.index : 0;

            return _self.featured_games[_self.index];

        },

        displayFeaturedGame: function(game_details, options) {

            var _self = this;
            var view = Managers.Template.get(_self.cardTemplate, {

                attribute: _self.behaviorAttriMapping[game_details.type],
                game_details: game_details

            });


            $(_self.featuredGameCard).removeClass('slide-out').addClass('slide-in');
            setTimeout(function() {

                $(_self.cardContainer).html(view);
                $(_self.featuredGameCard).removeClass('slide-in').addClass('slide-out');

            }, options.animation_duration * 1000);

        },
        _closeFeaturedCard: function(e) {

            var _self = e.data.context;
            $(_self.featuredGameCard).removeClass('slide-out').addClass('slide-in');

            clearInterval(_self.displayInterval);

        },
        _onGameLaunch: function(e) {

            e.stopPropagation();

            if (! Settings.member.isLoggedIn) {
                return;
            }

            var id = this.dataset.gameId
                , vendor = this.dataset.gameVendor;

            if (id && vendor) {
                Services.Members.SlotGameHistoryService
                    .addToHistory(id, vendor)
                    .then(function(response) {
                        EventBroker.dispatch(EventBroker.events.games.launchRealPlay, {
                            gameId: response.gameId,
                            vendor: response.productCode
                        });
                    });
            }
        }
    });

})(
    Pt.Managers,
    Pt.Services,
    Pt.Settings,
    _.clone(Pt.Widgets.AbstractWidget)
);

/**
 * BaseFeaturedGame Widget
 * Created by bespino on 11/10/2017.
 */

(function(
    Managers,
    Services,
    absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseHotGames', BaseHotGames);

    /**
     * @namespace Pt.Widgets.BaseJackpot
     * @constructor
     */
    function BaseHotGames () {

        this.view = 'widgets.hotGamesList';
        this.container = '[data-widget=hotGames]';
        this.actions = [

        ];

    }

    BaseHotGames.prototype = _.extend(absWidget, {

        activate: function () {

            var _self = this;
            Services.Cms.HotGamesService.fetch().then(function(hot_games) {

                _self.hot_games = hot_games.game_list;
                if ( _.size(_self.hot_games) ) {

                    _self.displayHotGames( _self.hot_games) ;

                }



            });

            this._bindEvents();


        },

        displayHotGames: function(game_list) {

            var _self = this;
            var view = Managers.Template.get(_self.view, {

                game_list: game_list

            });
            _self.render(_self.container, view);








        }

    });

})(
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Widgets.AbstractWidget)
);

/**
 * BaseFeaturedGame Widget
 * Created by bespino on 30/10/2017.
 */

(function(
    Managers,
    Services,
    absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseWinnersNotification', BaseWinnersNotification);

    /**
     * @namespace Pt.Widgets.BaseWinnersNotification
     * @constructor
     */
    function BaseWinnersNotification () {

        this.cardTemplate = 'widgets.winnerCard';
        this.container = 'widgets.winnersContainer';
        this.winner_list = [];
        this.winnersContainer = '[data-js=winnersContainer]';
        this.winnerCardContainer = '[data-js=winnerCardContainer]';
        this.closeWinnerCard = '[data-js=closeWinnerCard]';
        this.actions = [
            [this.closeWinnerCard, 'click', '_closeWinnerCard']
        ];

        this.index= 0;

    }

    BaseWinnersNotification.prototype = _.extend(absWidget, {

        activate: function () {

            var _self = this;
            Services.Cms.WinnersService.fetch().then(function(response) {

                _self.winner_list = response.winners_list;
                if ( _.size(_self.winner_list) ) {

                    _self.init({
                        interval: response.configuration.in_between_notifications_duration,
                        animation_duration: response.configuration.notifications_stay_duration,
                        behavior: response.configuration.behavior || 'random',
                    });
                    var container = Managers.Template.get(_self.container);
                    $('body').append(container);

                }

            });

            this._bindEvents();


        },

        init: function(options){
            
            var _self = this; 

            setInterval(function (){

                if (options.behavior === 'random') {

                        _self.displayWinnerCard(_self.random(), options);

                } else {

                    _self.displayWinnerCard(_self.sequence(), options);
                    _self.index++;

                }

            }, options.interval);


        },

        sequence: function() {

            var _self = this;

            _self.index = _self.index < _self.winner_list.length ? _self.index : 0;

            return _self.winner_list[_self.index];
        },

        random: function() {

            var _self = this;

            _self.winner_list = _.sample( _self.winner_list,  _self.winner_list.length );
            _self.winnerRandom = _self.winner_list[0] == _self.winnerRandom ? _self.winner_list[1] : _self.winner_list[0];

            return _self.winnerRandom;

        },


        displayWinnerCard: function(winner_details, options) {

            var _self = this;
            var view = Managers.Template.get(_self.cardTemplate, {

                winner_message: _.str_replace_key({
                    ':username': winner_details.username,
                    ':currency': winner_details.currency,
                    ':amount': winner_details.amount,
                    ':game_name': winner_details.game_name
                }, _.trans('global.winner_message'))

            });

            $(_self.winnersContainer).removeClass('slide-out').addClass('slide-in');
            setTimeout(function() {

                $(_self.winnerCardContainer).html(view);
                $(_self.winnersContainer).removeClass('slide-in').addClass('slide-out');

            }, options.animation_duration);

        },
        _closeWinnerCard: function(e) {

            var _self = e.data.context;
            $(_self.winnersContainer).removeClass('slide-out').addClass('slide-in');

        }


    });

})(
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Widgets.AbstractWidget)
);

/**
 * Created by - on 17/10/2017.
 */

(function ($,
           _,
           Settings,
           Config,
           Template,
           Managers,
           Services,
           absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseSplash', BaseSplash);

    /**
     * @namespace Pt.Widgets.BaseSplash
     * @constructor
     */
    function BaseSplash () {

        this.modal = 'widgets.splash';
        this.contentModalContainer = '[data-js=splash-modal-content]';
        this.elModal   = '[data-widget=splash-modal]';
        this.showPopChecked = '[data-js=splash-pop-check]';

        this.actions = [
            [this.showPopChecked,  'click', '_onSplashPopCheck']
        ];

    }

    BaseSplash.prototype = _.extend(absWidget, {

        activate: function () {

            Services.Cms.WidgetService.get('splash_messages')
                .then( _.bind(this._onSplashReady, this) );

        },

        _onSplashReady: function (res) {

            var self = this;

            var splashPop = Managers.Cookie.get('splash_' + _.snakeCaseUri(window.location.pathname) + location.hash);

            if ( _.isEmpty(splashPop)  && _.has(res, 'splash_group') ) {

                var splash = _.findWhere(res.splash_group, { page_url: window.location.pathname + location.hash } );

                self._showSplash(splash);

            }

        },

        _showSplash: function(splash) {

            var self = this;

            var duration = splash.duration;

            if ( duration === '0' ) {

                return;

            }

            var view = Template.get(self.modal, {

                image: splash.image,
                redirectURL: splash.redirect_url,
                behavior: splash.behavior

            });

            self.render(self.contentModalContainer, view);

            $('.modal').modal('hide');

            $(self.elModal).modal('show');

            if ( duration !== '' &&  duration !== null ) {

                setTimeout(function () {

                    $(self.elModal).modal('hide');

                }, + duration );

            }

            self._bindEvents();


        },

        _onSplashPopCheck: function () {


            var  el = $(this);

            if (el.prop('checked')) {

                Managers.Cookie.set({
                    name: 'splash_' + _.snakeCaseUri(window.location.pathname) + location.hash,
                    value: 1
                });

            } else {

                Managers.Cookie.remove({
                    name: 'splash_' + _.snakeCaseUri(window.location.pathname) + location.hash
                });

            }

        }

    });

})(jQuery,
    _,
    Pt.Settings,
    Pt.Config,
    Pt.Managers.Template,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Widgets.AbstractWidget)
);
/**
 * Winners List Widget
 * Created by mike on March 21, 2018
 */

(function(
    WidgetService,
    Template,
    Preloader,
    absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseWinnersList', BaseWinnersList);

    /**
     * @namespace Pt.Widgets.BaseWinnersList
     * @constructor
     */
    function BaseWinnersList () {

        this.view = 'widgets.winnersList';
        this.widgetContainer = 'widget[controller|=WinnersList]';
        this.carouselSelector = '[data-js=winners-list-carousel]';
        this.carouselElement = null;
        this.carouselSlidesToShow = 3;

        this.actions = [
            ['[data-js=winners-list-carousel] .slick-arrow', 'mouseenter', '_onArrowsHover'],
            ['[data-js=winners-list-carousel] .slick-arrow', 'mouseleave', '_onArrowsHoverOut'],
        ];

        this.slickOptions = {
            infinite: true,
            slidesToShow: this.carouselSlidesToShow,
            vertical: true,
            autoplay: true,
            speed: 2000,
            autoplaySpeed: 0,
            cssEase: 'linear',
            pauseOnFocus: false,
            pauseOnHover: false,
            prevArrow: '<a href="#" class="data-icon icon-angle-up prev"></a>',
            nextArrow: '<a href="#" class="data-icon icon-angle-down next"></a>'
        }

    }

    BaseWinnersList.prototype = _.extend(absWidget, {

        activate: function () {

            var self = this;

            Preloader.basic(self.widgetContainer);

            WidgetService.get('winners_list').then(function(res) {

                var view = Template.get(self.view, {
                    heading: res.heading || '',
                    items: res.list_items || [],
                    slidesToShow: self.carouselSlidesToShow || 3
                });

                self.render(self.widgetContainer, view);
                self.carouselElement = $(self.widgetContainer).find(self.carouselSelector);
                self.initializeCarousel(self.carouselElement);
                self._bindEvents();

            });

        },

        initializeCarousel: function(carouselElement) {

            var self = this;
            carouselElement.slick(self.slickOptions);

        },

        _onArrowsHover: function(e) {

            var self = e.data.context;
            $(self.carouselElement).slick('slickPause');
            $(self.carouselElement).slick('slickSetOption', _.extend({}, self.slickOptions, {
               speed: 300 
            }));

        },

        _onArrowsHoverOut: function(e) {

            var self = e.data.context;
            $(self.carouselElement).slick('slickPlay');
            $(self.carouselElement).slick('slickSetOption', self.slickOptions);

        }


    });

})(
    Pt.Services.Cms.WidgetService,
    Pt.Managers.Template,
    Pt.Helpers.Preloader,
    _.clone(Pt.Widgets.AbstractWidget)
);

/**
 * Floating Sidenav Widget
 * Created by mike on March 21, 2018
 */

(function(
    absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseFloatingSideNav', BaseFloatingSideNav);

    /**
     * @namespace Pt.Widgets.BaseFloatingSideNav
     * @constructor
     */
    function BaseFloatingSideNav () {

        this.container = '[data-js=floating-sidenav]';

    }

    BaseFloatingSideNav.prototype = _.extend(absWidget, {

        activate: function () {}

    });

})(
    _.clone(Pt.Widgets.AbstractWidget)
);

/**
 * CMS Widget Renderer
 * Created by mike on May 17, 2018
 */

(function(
    WidgetService,
    Preloader,
    absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.CmsWidget', CmsWidget);

    /**
     * @namespace Pt.Widgets.CmsWidget
     * @constructor
     */
    function CmsWidget () {

        this.widgetContainer = 'widget[controller|=CmsWidget]';

    }

    CmsWidget.prototype = _.extend(absWidget, {

        activate: function () {

            var self = this;
            var widgetId = $(self.widgetContainer).data('widget');
            var widgetProperty = $(self.widgetContainer).data('widget-property') || 'content';

            if ( widgetId ) {

                Preloader.basic(self.widgetContainer);

                WidgetService.get(widgetId).then(function(res) {

                    self.render(self.widgetContainer, res[widgetProperty] || '<div class="widget-prop-missing"></div>');

                }).fail(function(fail) {

                    void 0;

                    self.render(self.widgetContainer, '<div class="widget-failed"></div>');

                });

            }

        }

    });

})(
    Pt.Services.Cms.WidgetService,
    Pt.Helpers.Preloader,
    _.clone(Pt.Widgets.AbstractWidget)
);

/**
 * BaseFreezeTimer Widget
 * Created by bespino on 20/10/2017.
 */

(function (
           Cache,
           absWidget) {

    "use strict";

    _.Class('Pt.Widgets.BaseFreezeTimer', BaseFreezeTimer);

    /**
     * @namespace Pt.Widgets.BaseFreezeTimer
     * @constructor
     */
    function BaseFreezeTimer() {

        this.windowName = 'wndw'+ _.random(1, 1000);

    }

    BaseFreezeTimer.prototype = _.extend(absWidget, {

        freezeTime: function (launchedWindow) {

            var self = this;

            Cache.set('lastActionTime', moment().add(30, 'days'));

            self._addActiveWindow();

            self.onWindowClose(launchedWindow);

            return true;

        },

        onWindowClose: function(launchedWindow){

            var self = this;

            $(launchedWindow).on("beforeunload", function() {

                self._removeFromActiveWindows(self);

                if(!self.hasActiveWindows()){

                    Cache.set('lastActionTime', moment());

                }

            });

        },

        _addActiveWindow: function (){

            var activeWindows = JSON.parse(Cache.get('activeWindows')) || [];

            activeWindows.push(this.windowName);

            if(activeWindows.length > 0)
            {
                Cache.set('activeWindows', JSON.stringify(activeWindows));
            }

        },

        _removeFromActiveWindows: function(self){

            if ( ! _.isEmpty(Cache.get('activeWindows')) ) {

                var activeWindows = JSON.parse(Cache.get('activeWindows')) || [];

                var index = activeWindows.indexOf(self.windowName);

                activeWindows.splice(index, 1);

                Cache.set('activeWindows', JSON.stringify(activeWindows));

            }

        },

        hasActiveWindows: function(){

            var activeWindows = JSON.parse(Cache.get('activeWindows')) || [];

            return activeWindows.length > 0;

        }

    });

})(
    Pt.Managers.Cache,
    _.clone(Pt.Widgets.AbstractWidget)
);

/**
 * BaseIdleCheck Widget
 * Created by bespino on 20/10/2017.
 */

(function (Managers,
           Services,
           Modal,
           NProgress,
           Cache,
           absWidget) {

    "use strict";

    _.Class('Pt.Widgets.BaseIdleCheck', BaseIdleCheck);

    /**
     * @namespace Pt.Widgets.BaseIdleCheck
     * @constructor
     */
    function BaseIdleCheck() {

        this.view = 'widgets.idleDialog';
        this.countDownContainer = '[data-js=countDownContainer]';
        this.intervalCounter = '';
        this.countDownInterval = '';
        this.lastActionTime = moment();
        this.max_idle_time = 0;
        this.check_interval = 0;
        this.autoLogoutCountdown = 0;
        this.activateOnGames = false;

        this.config = {};

        this.noIdleLinks = [
            'launcher'
        ];


    }

    BaseIdleCheck.prototype = _.extend(absWidget, {

        activate: function () {

            this._getCMSConfiguration();

            if(!this.activateOnGames && this._onNoIdleCheckingLink())
            {
                var instance = window;

                Pt.Widgets.FreezeTimer.freezeTime(instance);

            }else
            {
                //from single instance game launcher opening a non-launcher page
                var activeWindows = JSON.parse(Cache.get('activeWindows')) || [];

                if(activeWindows.length === 0)
                {
                    Cache.set('lastActionTime', moment());
                }

            }

            this._bindEvents();

        },

        _onNoIdleCheckingLink: function(){

            var self = this;

            var currentLoc = window.location.pathname.split('/');

            return _.intersection(currentLoc, self.noIdleLinks).length > 0;

        },
        
        _initializeIntervalChecking: function () {

            var _self = this;

            _self.intervalCounter = setInterval(function () {

                var max_idle_period = moment(Cache.get('lastActionTime')).add(_self.max_idle_time, 'seconds');
                var idle_time_difference = moment().diff(max_idle_period, 'seconds');

                if (+ idle_time_difference > 0) {

                    _self._showIdleDialog();
                    _self._stopIdleTimer();
                    return false;

                }

            }, _self.check_interval);

        },
        
        _getCMSConfiguration: function () {

            var _self = this;

            Services.Cms.IdleTimeService.getConfig()
                .then(function (config) {

                    if(_.size(config) === 0)
                    {
                        return false;
                    }

                    _self.max_idle_time = (config.maximum_idle_time_in_minutes * 60);
                    _self.max_idle_param = config.maximum_idle_time_in_minutes;
                    _self.check_interval = (config.checking_frequency_in_seconds * 1000);
                    _self.autoLogoutCountdown = (config.logout_after_prompt_in_seconds * 1000);
                    _self._initializeIntervalChecking();

                });

        },
        
        _resetIdleTimer: function (action) {

            var _self = this;
            Cache.set('lastActionTime', action === 'navigation' ? moment() : moment().add(30, 'days'));
            clearInterval(_self.countDownInterval);
            clearInterval(_self.intervalCounter);
            _self._initializeIntervalChecking();

        },
        
        _stopIdleTimer: function () {

            var _self = this;
            clearInterval(_self.intervalCounter);

        },
        
        _showIdleDialog: function () {

            var _self = this;
            var message = _.str_replace_key({
                ':count_down_timer': '<span data-js="countDownContainer">' + (_self.autoLogoutCountdown / 1000) + '</span>',
                ':max_idle_time': _self.max_idle_time / 60
            }, _.trans('global.idle_message'));

            var confirmButton = '<span data-js="btnStayLoggedIn">' +  _.trans('global.stay_logged_in') + "</span>";
            Modal.info('', message, function (cb) {

                    _self._stayLoggedInCallback('navigation');

                }, {
                    backdrop: 'static',
                    keyboard: false,
                    showCancel: true,
                    confirmButton: confirmButton,
                    cancelButton: _.trans('global.btn_logout')
                }, function () {

                    NProgress.start();
                    location.href = '/logout';

                }
            );
            _self._initializeCountDownTimer(Cache.get('lastActionTime'));

        },
        
        _showPlayingDialog: function () {

            var _self = this;
            var message = _.str_replace_key({
                ':max_idle_time': _self.max_idle_time / 60
            }, _.trans('global.playing_too_long_message'));

            var confirmButton = '<span data-js="keepPlaying">' +  _.trans('global.keep_playing') + "</span>";
            Modal.info('', message, function (cb) {

                    _self._stayLoggedInCallback('ingame');

                }, {
                    backdrop: 'static',
                    keyboard: false,
                    showCancel: true,
                    confirmButton: confirmButton,
                    cancelButton: _.trans('global.btn_logout')
                }, function () {

                    NProgress.start();
                    location.href = '/logout';

                }
            );

        },
        
        _initializeCountDownTimer: function (lastActionTime) {

            var _self = this;
            var currentCountDownVal = + $(_self.countDownContainer).html();
            _self.countDownInterval = setInterval(function () {

                if (Cache.get('lastActionTime') !== lastActionTime) {

                    $('[data-js=btnStayLoggedIn]').trigger('click');
                    _self._resetIdleTimer();

                }
                if (currentCountDownVal >= 0) {

                    $(_self.countDownContainer).html(currentCountDownVal);
                    currentCountDownVal --;

                } else {

                    clearInterval(_self.countDownInterval);
                    NProgress.start();
                    location.href = "/logout";


                }

            }, 1000);


        },
        
        _stayLoggedInCallback: function (action) {

            var _self = this;
            _self._resetIdleTimer(action);

        },

        _onVendorSite: function(){

            var activeWindows = Managers.Cache.get('activeWindows');

            void 0;
        }


    });

})(
    Pt.Managers,
    Pt.Services,
    Pt.Helpers.Modal,
    Pt.Helpers.Nprogress,
    Pt.Managers.Cache,
    _.clone(Pt.Widgets.AbstractWidget)
);


(function(
    Settings,
    WidgetService,
    Template,
    Preloader,
    absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.FeaturedGamesSection', FeaturedGamesSection);

    function FeaturedGamesSection () {

        this.widgetContainer = 'widget[controller|=FeaturedGamesSection]';
        this.section = "";
        this.carousel = null;

    }

    FeaturedGamesSection.prototype = _.extend(absWidget, {

        activate: function () {

            var self = this;

            Preloader.basic(self.widgetContainer);

            WidgetService.get('featured_games_section').then(function(res) {

                if ( ! _.isEmpty(res) ) {

                    if (self.carousel) {

                        self.carousel.slick('unslick');

                    }

                    var view = Template.get('widgets.featuredGamesSection', res);

                    self.render(self.widgetContainer, view);

                    _.each(res.sections, function(section) {

                        if (section.games.length > 4 && section.style === '1') {

                            self.runCarousel((section.section_heading).toLowerCase());

                        }

                    });

                    return;

                }

                self.render(self.widgetContainer, '<div class="widget-missing"></div>');

            }).fail(function(fail) {

                void 0;

                self.render(self.widgetContainer, '<div class="widget-failed"></div>');

            });

        },

        runCarousel: function (section) {

            var car = $('[data-js=featured-'+ section +'-carousel]');
            car.find('.hide').removeClass('hide');
            this.carousel = car.slick({
                slidesToShow: 4,
                slidesToScroll: 4,
                dots: false,
                arrows: true,
                prevArrow: $('[data-js='+ section +'-btn-prev]'),
                nextArrow: $('[data-js='+ section +'-btn-next]'),
                autoplay: true,
                vertical: false,
                verticalSwiping: false,
                pauseOnHover: true,
                pauseOnFocus: false,
                autoplaySpeed: parseInt(Settings.banner_interval, 10)
            });


        }

    });

})(
    Pt.Settings,
    Pt.Services.Cms.WidgetService,
    Pt.Managers.Template,
    Pt.Helpers.Preloader,
    _.clone(Pt.Widgets.AbstractWidget)
);

/**
 * BaseSportsMatch Widget
 * Container: data-widget=sportsMatch
 *
 * Created by isda on 21/07/2016.
 */

(function ($,
           _,
           Settings,
           Managers,
           Template,
           Services,
           absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseSportsMatch', BaseSportsMatch);

    /**
     * @namespace Pt.Widgets.BaseSportsMatch
     * @constructor
     */
    function BaseSportsMatch () {

        this.container = '[data-widget=sportsMatch]';
		this.items = [];
        this.carousel = null;
		this.tickers = '[data-js=ticker-instance]';
		this.tickerIntervals = [];

    }

    BaseSportsMatch.prototype = _.extend(absWidget, {

        activate: function (container) {

            var self = this;

            container = container || this.container;

            Services.Cms.WidgetService.get('sports_match')
                .then(function (res) {

                    if (self.carousel) {

                        self.carousel.slick('unslick');

                    }

                    self.items = _.filter(res.match_items, function(match) {

						var matchDate = moment(new Date(match.match_date));
						var now = moment();

						return matchDate > now;

					});

                    var view = Managers.Template.get('widgets.sportsMatch', {
                        matches: self.items
                    });

                    self.render(container, view).startTickers();

                    if (self.items.length > 1) {

                        self.runCarousel();

                    }

                });

        },

		startTickers: function() {

			var self = this;
            var tickers = $(this.tickers);

			tickers.each(function(index, ticker) {

				var remaining = moment.duration($(ticker).data('remaining'));
				var days = $(ticker).find('[data-js=ticker-days]');
				var hours = $(ticker).find('[data-js=ticker-hours]');
				var minutes = $(ticker).find('[data-js=ticker-minutes]');
				var asDays = moment.duration($(ticker).data('remaining')).asDays();

				days.text(Math.floor(asDays));
				hours.text(remaining.hours());
				minutes.text(remaining.minutes());

			});

		},

        runCarousel: function () {

            var car = $('[data-js=sports-match-carousel]');
            car.find('.hide').removeClass('hide');
            this.carousel = car.slick({
                dots: true,
                arrows: false,
                autoplay: true,
                vertical: false,
                verticalSwiping: false,
                pauseOnHover: true,
                pauseOnFocus: false,
                autoplaySpeed: parseInt(Settings.banner_interval, 10)
            });


        }

    });

})(jQuery,
    _,
    Pt.Settings,
    Pt.Managers,
    Pt.Managers.Template,
    Pt.Services,
    _.clone(Pt.Widgets.AbstractWidget)
);
/**
 * BaseSportsLiveFeed Widget
 * Container: data-widget=sportsLiveFeed
 *
 * Created by isda on 21/07/2016.
 */

(function ($,
           _,
           $q,
           Helpers,
           Settings,
           Managers,
           Template,
           Services,
           absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseSportsLiveFeed', BaseSportsLiveFeed);

    /**
     * @namespace Pt.Widgets.BaseSportsLiveFeed
     * @constructor
     */
    function BaseSportsLiveFeed () {

        this.container = '[data-widget=sportsLiveFeed]';
        this.items = [];
        this.carousel = null;
        this.tickers = '[data-js=ticker-instance]';
        this.tickerIntervals = [];

        this.slickOptions = {
            dots: false,
            arrows: true,
            prevArrow: $('[data-js=live-btn-prev]'),
            nextArrow: $('[data-js=live-btn-next]'),
            autoplay: true,
            vertical: false,
            verticalSwiping: false,
            pauseOnHover: true,
            pauseOnFocus: false,
            autoplaySpeed: parseInt(Settings.banner_interval, 10)
        };

        this.paginationOptions = {
            current : 'current',
            total : 'total',
            paginationClass : 'slick-counter',
            open : ' ',
            close : ' ',
            separator : '/'
        };

        this.actions = [
            ['[data-js=close]', 'click', 'onClose']
        ];

    }

    BaseSportsLiveFeed.prototype = _.extend(absWidget, {

        activate: function (container) {

            var self = this;

            container = container || this.container;

            $q.all([
                Services.Cms.WidgetService.get('sports_live_feed'),
                Services.Members.HotMatchFeedService.get()
            ])

            .then(function (res) {

                if (self.carousel) {

                    self.carousel.slick('unslick');

                }

                var data = res[0];

                if (! _.isEmpty(res[0]) ) {

                    self.items = _.filter(res[1], function(match) {

                        var matchDate = moment(new Date(match.GameDate));
                        var now = moment();

                        return matchDate > now;

                    });

                    self.items = _.sortBy(self.items, 'GameDate');

                    var view = Template.get('widgets.sportsLiveFeed', {
                        matches: self.items,
                        title: data.title,
                        link: data.launcher_link,
                        behavior: data.behavior
                    });

                    self.render(container, view).startTickers();

                    if (self.items.length > 1) {

                        self.runCarousel();

                    }

                }

            });

            this._bindEvents();

        },

        startTickers: function() {

            var self = this;
            var tickers = $(this.tickers);

            tickers.each(function(index, ticker) {

                var remaining = moment.duration($(ticker).data('remaining'));
                var days = $(ticker).find('[data-js=ticker-days]');
                var hours = $(ticker).find('[data-js=ticker-hours]');
                var minutes = $(ticker).find('[data-js=ticker-minutes]');
                var asDays = moment.duration($(ticker).data('remaining')).asDays();

                days.text(Math.floor(asDays));
                hours.text(remaining.hours());
                minutes.text(remaining.minutes());


            });

        },

        runCarousel: function () {

            var container = $('[data-js=sports-livefeed-carousel]');

            if (container.length ) {

                container.find('.hide').removeClass('hide');

                this.slickOptions.prevArrow = $('[data-js=live-btn-prev]');
                this.slickOptions.nextArrow = $('[data-js=live-btn-next]');

                Helpers.SlickPaginationHelper.generate(container, this.paginationOptions, this.slickOptions);

            }

        },

        onClose: function (e) {

            e.preventDefault();

            var self = e.data.context;
            $(self.container).remove();

        }

    });

})(jQuery,
    _,
    Q,
    Pt.Helpers,
    Pt.Settings,
    Pt.Managers,
    Pt.Managers.Template,
    Pt.Services,
    _.clone(Pt.Widgets.AbstractWidget)
);
/**
 * BaseMiniBanner Widget
 * Container: data-widget=miniBanner
 *
 */

(function ($,
           _,
           Settings,
           Managers,
           Template,
           Services,
           absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseMiniBanner', BaseMiniBanner);

    /**
     * @namespace Pt.Widgets.BaseMiniBanner
     * @constructor
     */
    function BaseMiniBanner () {

        this.container = '[data-widget=miniBanner]';

        this.carousel = null;

    }

	BaseMiniBanner.prototype = _.extend(absWidget, {

        activate: function (container) {

            var self = this;

            container = container || this.container;

            Services.Cms.WidgetService.get('mini_banner')
                .then(function (res) {

                    if (self.carousel) {

                        self.carousel.slick('unslick');

                    }

                    var items = res.items || [];
                    var behavior = res.items.behavior || '';

                    var view = Managers.Template.get('widgets.miniBanner', {
                    	banners: items
                    });

                    self.render(container, view);

                    if (items.length > 1) {

                        self.runCarousel();

                    }

                });

        },

        runCarousel: function () {

            var car = $('[data-js=mini-banner-carousel]');
            car.find('.hide').removeClass('hide');
            this.carousel = car.slick({
                dots: true,
                arrows: false,
                autoplay: true,
                vertical: false,
                verticalSwiping: false,
                pauseOnHover: true,
                pauseOnFocus: false,
                autoplaySpeed: parseInt(Settings.banner_interval, 10)
            });


        }

    });

})(jQuery,
    _,
    Pt.Settings,
    Pt.Managers,
    Pt.Managers.Template,
    Pt.Services,
    _.clone(Pt.Widgets.AbstractWidget)
);
(function ($,
    _,
    Q,
    Settings,
    Config,
    Managers,
    Services,
    Helpers,
    absWidget
) {

"use strict";

_.Class('Pt.Widgets.AccountVerification', AccountVerification);

    /**
    * @namespace Pt.Widgets.AccountVerification
    * @constructor
    */
    function AccountVerification () {

        this.widgetContainer = 'widget[controller|=AccountVerification]';
        this.smsContainer = '[data-js=sms-verification-container]';
        this.emailContainer = '[data-js=email-verification-container]';
        this.smsSendBtn = '[data-js=send-sms-verification-code]';
        this.emailSendBtn = '[data-js=send-email-verification-code]';
        this.verifyEmail = '[data-js=verifyEmail]';
        this.verifySms = '[data-js=verifySms]';
        this.addBankDetails = '[data-js=add-bankdetails]';
        this.updateProfile = '[data-js=update-profile]'
        this.isProfileVerified = false;
        this.isEmailVerified = false;
        this.isSmsVerified = false;
        this.isBankVerified = false;
        this.profileAmount = null;
        this.mobileAmount = null;
        this.emailAmount = null;
        this.bankAmount = null;
        this.isFreebetClaimed = false;
        this.minimumWithdrawal = null;
        this.totalClaimableAmount = null;

        this.popOverOptions = {
            html : true,
            placement : 'top',
            trigger : 'hover',
            title : 'popover'
        };

        this.actions = [
            [this.smsSendBtn , 'click', '_onSendSmsVerificationCode'],
            [this.emailSendBtn, 'click', '_onSendEmailVerificationCode'],
            [this.verifyEmail, 'click', '_onVerifyEmail'],
            [this.verifySms, 'click', '_onVerifySms'],
            [this.addBankDetails, 'click', '_onAddBankDetails'],
            [this.updateProfile, 'click', '_onUpdateProfile']
        ];

        this.subscription = [
            EventBroker.subscribe(EventBroker.events.profileUpdated, 'activate', this),
            EventBroker.subscribe(EventBroker.events.bankDetailsUpdated, 'activate', this)

        ];

    }

    AccountVerification.prototype = _.extend(absWidget, {

        activate: function () {
            var self = this;
            
            if (! Settings.account_verification) return;

            self.promises = [
                Services.Members.VerificationService.safetyRating(),
                Services.Members.MemberService.getMember(),
                Settings.has_rewards ? Services.Members.MemberService.rewards() : null
            ];

            Helpers.Preloader.basic(self.widgetContainer);

            Q.all(self.promises).then( function ( res ) {  

                var response = res[0],
                    label = response.getProfileCompleteness().label,
                    safetyRatingLabel = _.trans('accountverification.account_safety') +' '+  _.trans('accountverification.' + label),
                    rewards = res[2];         
                
        

                var view = Managers.Template.get('widgets.verification', {
                    safetyRating : response,
                    currency : Settings.member.currency,
                    safetyRatingLabel : safetyRatingLabel,
                    isFreebetClaimed : response.claimed,
                    claimAmoutLabel : response.claimed ? _.trans('accountverification.claimed_amount') : _.trans('accountverification.locked_amount'),
                    rewardsPoint : Settings.has_rewards ? rewards.getPointsBalance() : 0,
                    rewardsUrl: self._getRewardsSite()
                });

                self.render(self.widgetContainer, view);
                self._bindEvents();
                self.profileAmount = response.profileCompletedAmount;
                self.emailAmount = response.emailVerifiedAmount;
                self.mobileAmount = response.phoneVerifiedAmount;
                self.bankAmount = response.bankDetailCompletedAmount;
                self.isFreebetClaimed = response.claimed;
                self.minimumWithdrawal = response.getMinimumWithdrawal();
                self.minimumDeposit = response.getMinimumDeposit();
                self.totalClaimableAmount = response.getTotalClaimableAmount();
                self._setSafetyRating(response);
                self.member = res[1];

                if ( $('#claimableAmount').length ) {

                    $('#claimableAmount').text(response.getTotalClaimableAmount());
                }

            }).fail(function(error) {

                Helpers.Error.show(error); 

            });

        },

        _setSafetyRating : function (SafetyRating) {

            var obj = SafetyRating.getProfileCompleteness(),
                badge = $('.av-badge'),
                self = this;

            if (badge.length) {

                badge.removeClass('level-0');
                badge.addClass('level-' + obj.level);


            }

            if (SafetyRating.isBankDetailsVerified()) {

                $('.av-bank-details').find('span').removeClass('av-cash-bonus').addClass('av-verified');
                self.isBankVerified = SafetyRating.isBankDetailsVerified();
            }

            if (SafetyRating.isProfileVerified()) {

                $('.av-profile').find('span').removeClass('av-cash-bonus').addClass('av-verified');
                self.isProfileVerified = SafetyRating.isProfileVerified();
            }

            if (SafetyRating.isEmailVerified()) {

                self.isEmailVerified = SafetyRating.isEmailVerified();
                $('.av-email').find('span').removeClass('av-cash-bonus').addClass('av-verified');

            }

            if (SafetyRating.isSmsVerified()) {

                self.isSmsVerified = SafetyRating.isSmsVerified();
                $('.av-sms').find('span').removeClass('av-cash-bonus').addClass('av-verified');

            }

            self._addPopOvers();


        },

        _addPopOvers : function () {

            var self = this;

            self.popOverOptions.container = '.av-container';

            $('.av-profile').popover(_.extend(self.popOverOptions, 
                {
                    template : Managers.Template.get('widgets.profilePopOver', {
                        header : self.isProfileVerified ? _.trans('accountverification.profile_verified') :
                            _.trans('accountverification.popover_profile'),
                        verified : self.isProfileVerified,
                        amount : self.profileAmount,
                        currency : Settings.member.currency
                    })
                }
            ));

            $('.av-bank-details').popover(_.extend(self.popOverOptions, 
                {
                    template : Managers.Template.get('widgets.bankdetailsPopOver', {
                        header : self.isBankVerified ? _.trans('accountverification.bank_details_verified') :
                            _.trans('accountverification.popover_bankdetails'),
                        verified : self.isBankVerified,
                        amount : self.bankAmount,
                        currency: Settings.member.currency
                    })
                }
                
            ));

            $('.av-sms').popover(_.extend(self.popOverOptions,

                {
                    template : Managers.Template.get('widgets.smsPopOver', {
                        header : self.isSmsVerified ? _.trans('accountverification.sms_verified') :
                            _.trans('accountverification.popover_sms'),
                        verified : self.isSmsVerified,
                        amount : self.mobileAmount,
                        currency : Settings.member.currency
                    })
                }
            
            ));

            $('.av-email').popover(_.extend(self.popOverOptions,
                {
                    template : Managers.Template.get('widgets.emailPopOver', {
                        header : self.isEmailVerified ? _.trans('accountverification.email_verified') :
                            _.trans('accountverification.popover_email'),
                        verified : self.isEmailVerified,
                        amount : self.emailAmount,
                        currency :  Settings.member.currency
                    })
                }
                
            ));

            if (! self.isFreebetClaimed ) {
                var freebetMsg = _.str_replace_key({
                    ':withdrawal': self.minimumWithdrawal,
                    ':deposit': self.minimumDeposit,
                    // support for operator that do not have minimum deposit
                    ':amount': self.minimumWithdrawal,
                    ':currency': Settings.member.currency,
                }, _.trans('accountverification.freebet_msg'));

                $('.av-balance').popover(_.extend(self.popOverOptions,
                    {
                        template : Managers.Template.get('widgets.freeBetMessagePopOver', {
                            message : freebetMsg
                        })
                    }
                ));

            }

        },

        _onAddBankDetails : function (e) {

            return window.location.href = '/profile/banking-details';
        },

        _onUpdateProfile : function (e) {

            return window.location.href = '/profile/edit';
        },

        _onVerifyEmail : function (e) {

            var self = e.data.context,
                member = Settings.member.code,
                secondTry = Managers.Cookie.get('verifyemail2' + btoa(member)),
                firstTry = Managers.Cookie.get('verifyemailexpiration'),
                userCookie = secondTry ? atob(secondTry) : undefined;

            
            if (self.isEmailVerified) return;

            if ( firstTry ) {

                window.location.href = '/profile/verify-email';

                return;
            }
            
            if ( userCookie === member ) {

                var view = Managers.Template.get('widgets.verficationSent',
                        { 
                            message : _.trans('accountverification.max_tries_email'),
                            type : self.type,
                            isClose : true                
                        });

                Helpers.Modal.generic(view);


                return;

            }

            var message = _.trans('accountverification.send_email_verification_code_label') +' '+
                _.maskString(self.member.email,3,4, _.trans('accountverification.mobile_mask'));

            var view = Managers.Template.get('widgets.verifyAccount',
                { 
                    message : message,
                    type:'email',
                    header : _.trans('accountverification.verify_email' ) 
                });

            Helpers.Modal.generic(view);


        },

        _onVerifySms : function (e) {

            var self = e.data.context,
                member = Settings.member.code,
                secondTry = Managers.Cookie.get('verifysms2' + btoa(member)),
                firstTry = Managers.Cookie.get('verifysmsexpiration'),
                userCookie = secondTry ? atob(secondTry) : undefined;
            

            if (self.isSmsVerified) return;

            if ( firstTry ) {

                window.location.href = '/profile/verify-sms';

                return;
            }

            if ( userCookie === member ) {

                var view = Managers.Template.get('widgets.verficationSent',
                        { 
                            message : _.trans('accountverification.max_tries_sms'),
                            type : 'sms',
                            isClose : true                
                        });

                Helpers.Modal.generic(view);

                return;

            };

            var message = _.trans('accountverification.send_sms_verification_code_label') +' '+
                _.maskString(self.member.mobile,3,2, _.trans('accountverification.mobile_mask'));

            var view = Managers.Template.get('widgets.verifyAccount',
                { 
                    message : message,
                    type :'sms',
                    header : _.trans('accountverification.verify_sms' ) 
            
                });


            Helpers.Modal.generic(view);

        },

        _onSendSmsVerificationCode: function (e){

            var self = this;

            Helpers.Nprogress.start();

            Services
                .Members
                .VerificationService
                .verifySms()
                .then(function(response) {

                    var expiration = new Date( new Date().getTime() + 3 * 60 * 1000);

                    Managers.Cookie.set({ name : 'verifysms', value: '1', expires: expiration });
                    Managers.Cookie.set({ name : 'verifysmsexpiration', value: expiration, expires: expiration});

                    var view = Managers.Template.get('widgets.verficationSent',
                        { 
                            message : _.trans('accountverification.verification_2nd_sms'),
                            type : 'sms',
                            isClose : false                 
                        });

                    Helpers.Modal.generic(view, {});
                    
                    Helpers.Nprogress.done();

                }).fail(function(error) {

                    Helpers.Error.show(e);

                }).finally(function() {

                    Helpers.Nprogress.done();

                });

        },

        _onSendEmailVerificationCode : function () {

            var self = this;

            Helpers.Nprogress.start();

            Services
                .Members
                .VerificationService
                .verifyEmail()
                .then(function(response) {

                    var expiration = new Date( new Date().getTime() + 3 * 60 * 1000);

                    Managers.Cookie.set({ name : 'verifyemail', value: '1',expires: expiration });
                    Managers.Cookie.set({ name : 'verifyemailexpiration', value: expiration, expires: expiration});

                    var view = Managers.Template.get('widgets.verficationSent',
                        { 
                            message : _.trans('accountverification.verification_2nd_email'),
                            type : 'email',
                            isClose : false                
                        });

                    Helpers.Modal.generic(view, {});
                    
                    Helpers.Nprogress.done();

                }).fail(function(error) {

                    Helpers.Error.show(e);

                }).finally(function() {

                    Helpers.Nprogress.done();

                });
          
        },

        _getRewardsSite: function() {

            var rewards_url = [];
            var memberDomainMap = _.propertyValue(Settings.domain, 'membersite', []);

            _.each(memberDomainMap, function(mapItem) {

                if ( window.location.hostname === mapItem.member_domain ) {

                    var url = _.isEmpty(mapItem.rewards_domain) ?  '//rewards.' + Settings.app_domain : '//' + mapItem.rewards_domain;

                    rewards_url.push(window.location.protocol + url);

                }

            });

            return rewards_url;
        }


    }, Pt.Core.Extend('Widgets.AccountVerification'));

})(jQuery,
_,
Q,
Pt.Settings,
Pt.Config,
Pt.Managers,
Pt.Services,
Pt.Helpers,
_.clone(Pt.Widgets.AbstractWidget)
);
(function (
    Q,
    Template,
    BannerService,
    LeaderboardService,
    absWidget
) {

"use strict";

_.Class('Pt.Widgets.Leaderboard', Leaderboard);

    function Leaderboard () {

        this.widgetContainer = 'widget[controller|=Leaderboard]';
        this.club = undefined;
        this.sort = undefined;
        this.max = undefined;

    }

    Leaderboard.prototype = _.extend(absWidget, {

        activate: function () {

            var self = this;

            var club = $(this.widgetContainer).data('type') || 'casino';
            var limit = $(this.widgetContainer).data('limit') || 30;
            var sort = {
                by: $(this.widgetContainer).data('sort-by') || 'rank',
                order: $(this.widgetContainer).data('sort-order') || 'asc'
            }

            var promises = [
                BannerService.get('leaderboard_' + club),
                LeaderboardService.getLeaderboard(club)
            ];

            Q.allSettled(promises).then(function(res) {

                var banner = res[0].state === 'fulfilled' && res[0].value.length ? 
                    res[0].value[0].image.uri : null;
                    
                var leaderboardData = res[1].state === 'fulfilled' ? 
                    res[1].value : {};

                var view = Template.get('widgets.leaderboard', {
                    banner: banner,
                    leaderboardData: leaderboardData,
                    sort: sort,
                    limit: limit
                });

                self.render(self.widgetContainer, view);

            }).fail(function(fail) {

                void 0;

            });

        }

    }, Pt.Core.Extend('Widgets.Leaderboard'));

})(
    Q,
    Pt.Managers.Template,
    Pt.Services.Cms.BannerService,
    Pt.Services.Members.LeaderboardService,
    _.clone(Pt.Widgets.AbstractWidget)
);
(function ($,
    _,
    Helpers,
    Settings,
    Managers,
    Services,
    absWidget
) {

"use strict";

_.Class('Pt.Widgets.NewFeaturedGamesSection', NewFeaturedGamesSection);

/**
* @namespace Pt.Widgets.NewFeaturedGamesSection
* @constructor
*/
function NewFeaturedGamesSection () {

    this.widgetContainer = 'widget[controller|=NewFeaturedGamesSection]';
    this.slickOptions = {
        dots: false,
        arrows: true,
        autoplay: true,
        vertical: false,
        verticalSwiping: false,
        pauseOnHover: true,
        pauseOnFocus: false,
        nextArrow: '<a href="#" class="slider-next"><span class="data-icon icon-chevron-right"></span></a>',
        prevArrow: '<a href="#" class="slider-prev"><span class="data-icon icon-chevron-left"></span></a>',
        autoplaySpeed: parseInt(Settings.banner_interval, 10)
    };

    this.paginationOptions = {
        current : 'current',
        total : 'total',
        paginationClass : 'slick-counter',
        open : '[',
        close : ']',
        separator : '/'
    };

    this.sliderMap = {
        main : 'main',
        kygaming : 'kygaming',
        casino : 'casino',
        games : 'games'
    };

}

NewFeaturedGamesSection.prototype = _.extend(absWidget, {

    activate: function () {

     var self = this;

     Services.Cms.WidgetService.get('new_featured_games_section')
         .then(function (res) {

            var view = Managers.Template.get('widgets.newFeaturedGamesSection', {
                featured_games : res.main_featured_game.image_settings,
                fund_management : res.fund_management,
                other_games : res.other_featured_games,
                games : res.games.games_image_settings
            });

            self.render(self.widgetContainer, view);
            
            _.each(self.sliderMap, function (key) {
                self.runCarousel(key);
            });

         });

    },
    runCarousel: function (key) {

        
        var container = $('[data-js=' + key + ']');

        if (container.length ) {

            container.find('.hide').removeClass('hide');

            this.paginationOptions.current = key + '-current';
            this.paginationOptions.total = key + '-total';

            Helpers.SlickPaginationHelper.generate(container, this.paginationOptions, this.slickOptions);

        }
    }
});

})(jQuery,
_,
Pt.Helpers,
Pt.Settings,
Pt.Managers,
Pt.Services,
_.clone(Pt.Widgets.AbstractWidget)
);
(function (
    Q,
    Settings,
    Rules,
    Contracts,
    Helpers,
    Managers,
    Services,
    absWidget
    ) {

    'use strict';

    _.Class('Pt.Widgets.BaseBankDetails', BankDetails);

    /**
     * @namespace Pt.Controllers.BankDetails
     * @constructor
     */
    function BankDetails() {

        this.widgetContainer = 'widget[controller|=BankDetails]';
        this.bankingDetailsWrapper = '[data-js=banking-details]';
        this.provinceSelection = '[data-js=province-selection]';
        this.citySelection = '[data-js=city-selection]';
        this.districtSelection = '[data-js=district-selection]';
        this.bankNameWrapper = '[data-js=bank-name-native-wrapper]';
        this.bankNameNative = '[data-js=bank-name-native]';
        this.bankName = '[data-js=bank-name]';
        this.bankSelection = '[data-js=bank-selection]';
        this.bankingDetails = {};
        this.provinces = [];
        this.cities = [];
        this.districts = [];
        this.banks = [];
        this.currency = Settings.member.currency;
        this.cityLabel = _.trans('profile.label_select_city');
        this.districtLabel = _.trans('profile.label_select_district');
        this.otherBankValue = 'OTHER';
        this.bankAddressId = '[data-js=bank-address-id]';
        this.bankAddress = '[data-js=bank-address]';
        this.bankAccountNumberIrregular = '[data-js=bank-account-number-irregular]';
        this.radioPreferred = '[data-js=radio-preferred]';
        this.form = '[data-js=banking-details-form]';
        this.formEdit = '[data-js=banking-details-form-edit]';

        this.actions = [
            [ this.provinceSelection, 'change', '_onProvinceChange' ],
            [ this.citySelection, 'change', '_onCityChange' ],
            [ this.districtSelection, 'change', '_onDisctrictChange' ],
            [ this.bankSelection, 'change', '_onBankChange' ],
            [ this.bankNameNative, 'change', '_onBankNameNativeChange' ],
            [ this.bankAccountNumberIrregular, 'change', '_onBankAccountNumberIrregularChange' ],
            [ '[data-js=bank-account-edit]', 'click', '_onBankAccountEdit' ],
            [ '[data-js=bank-account-edit-cancel]', 'click', '_onBankAccountEditCancel' ],
            [ '[data-js=bank-account-delete]', 'click', '_onBankAccountDelete' ],
            [ this.radioPreferred, 'change', '_onRadioPreferredChange' ],
            [ this.form, 'submit', '_onFormSubmit' ],
            [ this.formEdit, 'submit', '_onFormSubmitEdit' ]
        ];

        this.addFormSelector = '';
        this.editFormSelector = '';
        this.editFormCounter = 0;
        this.deleteAccountId = null;

        this.modalConfig = {
            text: _.trans('profile.alert_delete_bank'),
            confirmButton: _.trans('funds.button_proceed'),
            cancelButton: _.trans('funds.button_cancel'),
            confirm: this._onConfirmBankAccountDelete
        };

    }

    BankDetails.prototype = _.extend(absWidget, {

        activate: function () {
            var self = this;
            Q.all( [
                Services.Members.BankService.getBankingList(),
                Services.Members.BankingAddressService.getProvinces(),
                Services.Members.BankService.getBanks(),
                Services.Members.MemberService.getMember()
            ] ).then( function ( response ) {

                self.bankingDetails = response[ 0 ];
                self.provinces = response[ 1 ];
                self.banks = response[ 2 ];
                self.member = response[ 3 ];


                // refresh banks
                self._refreshBankList();

                // check currency for bank rules
                if ( self.currency !== 'RMB' && self.currency !== 'VND' ) {

                    Rules.validation.bankDetail.bankProvince = {};
                    Rules.validation.bankDetail.bankCity = {};
                    Rules.validation.bankDetail.bankDistrict = {};

                }

                if ( self.currency === 'VND' ) {

                    Rules.validation.bankDetail.bankDistrict = {};

                }

            } ).fail( function () {

                Helpers.Notify.error( _.trans( 'errors.unknown_error_notification' ) );

            } ).finally( function () {


            } );


        },

        _onProvinceChange: function(e) {

            var self = e.data.context;
            var selected = _.findWhere( self.provinces, { id: + $(this).val() } );

            var citySelector = '[data-city-id=city-' + $(this).closest('[data-js=address-group]').data('target') + ']';
            var districtSelector = '[data-district-id=district-' + $(this).closest('[data-js=address-group]').data('target') + ']';

            self._renderSelectionMarkup( [], citySelector, self.cityLabel );
            self._renderSelectionMarkup( [], districtSelector, self.districtLabel );

            self._fetchAndRender({
                element: citySelector,
                type: 'cities',
                service: selected,
                label: self.cityLabel
            });

            // build bankAddressId
            self._setbankAddressId(this);

        },

        _onCityChange: function(e) {

            var self = e.data.context;
            var selected = _.findWhere(self.cities, { id: + $(this).val() });

            var districtSelector = '[data-district-id=district-' + $(this).closest('[data-js=address-group]').data('target') + ']';

            self._renderSelectionMarkup( [], districtSelector, self.districtLabel);

            if ( Settings.member.currency != 'VND' ) {

                self._fetchAndRender({
                    element: districtSelector,
                    type: 'districts',
                    service: selected,
                    label: self.districtLabel
                });

            }

            // build bankAddressId
            self._setbankAddressId(this);

        },

        _onDisctrictChange: function(e) {

            var self = e.data.context;

            // build bankAddressId
            self._setbankAddressId(this);

        },

        _onBankChange: function ( e ) {

            var self = e.data.context;
            var value = $(this).val();

            // condition for rules validation
            if ( value === self.otherBankValue ) {

                Rules.validation.bankDetail.bankNameNative = {
                    presence: {
                        message: "^" + _.trans('errors.bankName_required')
                    },
                    length: {
                        maximum: 100,
                        tooLong: "^" + _.trans('errors.max_bankName')
                    }
                };

                // show bank name
                $(this).closest('form').find(self.bankNameWrapper).removeClass('hide');

                // change bank native name
                $(this).closest('form').find(self.bankNameNative).val('');
                $(this).closest('form').find(self.bankName).val('');

            } else {
                
                Rules.validation.bankDetail.bankNameNative = {};

                // hide bank name
                $(self.bankNameWrapper).addClass('hide');

                // change bank native name
                $(this).closest('form').find(self.bankNameNative).val($(this).find(':selected').text());
                $(this).closest('form').find(self.bankName).val($(this).find(':selected').text());

            }

        },

        _onBankNameNativeChange: function ( e ) {

            // sync bank name field
            var self = e.data.context;
            $(self.bankName).val($(this).val());

        },

        _onBankAccountNumberIrregularChange: function( ) {

            // sync closest bank-account-name
            $(this).closest('[data-js=banking-details-form]').find('[data-js=bank-account-name]').val($(this).val());

        },

        _onBankAccountDelete: function( e ) {

            e.preventDefault();

            var self = e.data.context;
            self.modalConfig.accountId = $(this).data('account-id');
            self.modalConfig.self = self;
            Helpers.Modal.confirm(self.modalConfig);

        },

        _onConfirmBankAccountDelete: function( e ) {

            var self = this.self;
            var accountId = this.accountId;

            Helpers.Nprogress.start();

            Services.Members.BankService.deleteBankAccount(accountId)
                .then(function (res) {

                    Helpers.Notify.success(_.trans('profile.remove_bank_detail_success_message'));

                    // refresh banks
                    self._refreshBankList(true, res);

                })
                .fail(function (e) {

                    Helpers.Error.show(e);

                })
                .finally(function () {

                    Helpers.Nprogress.done();

                });

        },

        _fetchAndRender: function( options ) {

            var self = this;

            $(options.element).prop('disabled', true);

            options.service['get' + _.ucfirst(options.type) ]()
                .then(function( data ) {

                    self[options.type] = data;
                    self._renderSelectionMarkup( data, options.element, options.label );

                    $(options.element).prop('disabled', false);

                });

        },

        _renderSelectionMarkup: function( selection, wrapper, placeholder) {

            this.render( wrapper, Managers.Template.get('widgets.addressSelections', {

                selections: selection,
                placeholder: placeholder

            }));

        },

        _setbankAddressId: function( selectObj ) {
        
            var provinceText = $(selectObj).closest('form').find(this.provinceSelection).find(':selected').text();
            var cityText = $(selectObj).closest('form').find(this.citySelection).find(':selected').text();
            var districtText = $(selectObj).closest('form').find(this.districtSelection).find(':selected').text();
        
            var provinceVal = $(selectObj).closest('form').find(this.provinceSelection).val();
            var cityVal = $(selectObj).closest('form').find(this.citySelection).val();
            var districtVal = $(selectObj).closest('form').find(this.districtSelection).val();

            if ( provinceVal && cityVal && districtVal && Settings.member.currency === 'RMB' ) {

                $(selectObj).closest('form').find(this.bankAddressId).val(provinceVal + '|' + cityVal + '|' + districtVal );
                $(selectObj).closest('form').find(this.bankAddress).val(provinceText + ', ' + cityText + ', ' + districtText );

            } else if ( provinceVal && cityVal && Settings.member.currency === 'VND' ) {

                $(selectObj).closest('form').find(this.bankAddressId).val(provinceVal + '|' + cityVal );
                $(selectObj).closest('form').find(this.bankAddress).val(provinceText + ', ' + cityText );

            } else {

                $(selectObj).closest('form').find(this.bankAddressId).val('');
                $(selectObj).closest('form').find(this.bankAddress).val('');

            }

        },

        _onFormSubmit: function( e ) {

            e.preventDefault();
            var self = e.data.context;
            
            self.addFormSelector = '[data-id=' + $(this).data('id') + ']';

            var validator = new Managers.Validation( self.addFormSelector, Rules.validation[$(this).data('validator')] );
            validator.bindInput(true).init();
            validator.validate(self._onValidationSuccess, self);

        },

        _onValidationSuccess: function( data, self ) {

            var bankCodeObj = _.findWhere(data, { name: "bankCode" }) || {};

            if ( bankCodeObj.value === 'MOMO' ) {

                Helpers.Modal.confirm({
                    text: _.trans('profile.alert_mpay_confirm'),
                    confirmButton: _.trans('funds.button_proceed'),
                    cancelButton: _.trans('funds.button_cancel'),
                    confirm: this.onConfirmMPayAccount,
                    self: self,
                    data: data
                });

                return false;

            }

            self.addBankAccount(data);

        },

        addBankAccount: function(data) {

            var self = this;

            Helpers.Nprogress.start();
            self.secureFormRequest(self.addFormSelector, true);

            Services.Members.BankService
                .addBankAccount(data)
                .then(function (res) {

                    Helpers.Notify.success(_.trans('profile.edit_bank_detail_success_message'));

                    Services
                        .Members
                        .BankService
                        .getBankingList()
                        .then(function(response) {

                            self.bankingDetails = response;
                            self._renderBankList();

                            if ( Settings.account_verification ) {

                                EventBroker.dispatch(EventBroker.events.bankDetailsUpdated,true);

                            }

                            
                        })
                        .catch(function(error) {

                            Helpers.Error.show(e);

                        });


                })
                .fail(function (e) {

                    Helpers.Error.show(e);

                })
                .finally(function () {

                    self.secureFormRequest(self.addFormSelector, false);
                    Helpers.Nprogress.done();

                });

        },

        _refreshBankList: function( reFetchData, response ) {

            var self = this;

            if ( reFetchData ) {

                self.bankingDetails = Services.Members.BankService.banksToModel(response);
                self._renderBankList();

            } else {

                this._renderBankList();

            }

        },

        _renderBankList: function() {

            try {
                var view = Managers.Template.get('widgets.bankingDetails', {
                    bankingDetails: this.bankingDetails,
                    provinces: this.provinces,
                    currency: this.currency,
                    banks: this.banks,
                    member: this.member
                });
                
                this.render( this.widgetContainer, view )
                    ._bindEvents();
            }catch(e) { void 0;}
            

        },

        _onBankAccountEdit: function( e ) {
            e.preventDefault();

            var self = e.data.context;
            var accountId = $(this).data('account-id');
            var targetWrapper = '[data-form-wrapper-id=' + $(this).data('form-wrapper-target') + ']';

            Helpers.Nprogress.start();

            // fetch bank details
            Services.Members.BankService.getBankAccount(accountId)
                .then(function (res) {
                    var bankAccountData = res.data;

                    // check if address, then fetch data
                    if ( bankAccountData.bankAddressId && bankAccountData.bankAddressId.indexOf('|') > - 1 ) {
                        // fetch address first
                        var addressArr = bankAccountData.bankAddressId.split('|');
                        var addressProvince = addressArr[0];
                        var addressCity = addressArr[1];
                        var addressDistrict = addressArr[2] || null;

                        Q.all( [
                            Services.Members.BankingAddressService.getCities(addressProvince),
                            addressDistrict ? Services.Members.BankingAddressService.getDistricts(addressCity) : null
                        ] ).then( function ( response ) {

                            var cities = response[0];
                            var districts = response[1];
                            
                            self._renderEditForm(targetWrapper, {
                                account: bankAccountData,
                                provinces: self.provinces,
                                cities: cities,
                                districts: districts,
                                selectedProvince: addressProvince,
                                selectedCity: addressCity,
                                selectedDistrict: addressDistrict
                            });

                        });


                    } else {

                        self._renderEditForm(targetWrapper, {
                            account: bankAccountData,
                            provinces: self.provinces,
                            cities: [],
                            districts: [],
                            selectedProvince: null,
                            selectedCity: null,
                            selectedDistrict: null
                        });

                    }

                })
                .finally( function() {

                    Helpers.Nprogress.done();

                });
            
        },

        _renderEditForm: function( target, options ) {

            this.editFormCounter = this.editFormCounter + 1;

            var obj = _.extend(options, {
                banks: this.banks,
                currency: this.currency,
                member: this.member,
                unique: this.editFormCounter
            });

            var view = Managers.Template.get('widgets.bankingDetailsEdit', obj);

            this.render( target, view )
                ._bindEvents();

            // check for other bank
            if ( $(target).find(this.bankSelection).val() === this.otherBankValue ) {

                $(target).find(this.bankNameWrapper).removeClass('hide');

            }

        },

        _onFormSubmitEdit: function( e ) {

            e.preventDefault();
            var self = e.data.context;
            self.editFormSelector = '[data-edit-form-id=' + $(this).data('edit-form-id') + ']';
            var validator = new Managers.Validation( self.editFormSelector, Rules.validation[$(this).data('validator')] );

            validator.bindInput(true).init();
            validator.validate(self._onValidationSuccessEdit, self);

        },

        _onValidationSuccessEdit: function( data, self ) {

            Helpers.Nprogress.start();
            self.secureFormRequest(self.editFormSelector, true);

            Services.Members.BankService.editBankAccount(data)
                .then(function (res) {

                    Helpers.Notify.success(_.trans('profile.edit_bank_detail_success_message'));

                    Services
                    .Members
                    .BankService
                    .getBankingList()
                    .then(function(response) {

                        self.bankingDetails = response;
                        self._renderBankList();

                    })
                    .catch(function(error) {

                        Helpers.Error.show(e);

                    });

                })
                .fail(function (e) {

                    Helpers.Error.show(e);

                })
                .finally(function () {

                    Helpers.Nprogress.done();
                    self.secureFormRequest(self.editFormSelector, false);

                })
            ;

        }, 

        _onBankAccountEditCancel: function( e ) {

            var self = e.data.context;

            // remove form
            $(this).closest(self.formEdit).remove();

        },

        _onRadioPreferredChange: function( e ) {

            var self = e.data.context;
            var id = $(this).data('account-id');
            var data = [];
            var regularAccounts = _.propertyValue(self.bankingDetails, 'regular.accounts') || [];
            var details = _.findWhere(regularAccounts, { bankAccountId: '' + id } ) || {};

            // flatten into array of objects
            _.each(details, function(value, key) {

                data.push({
                    name: key,
                    value: key === "isPreferred" ? true : value
                });

            });

            EventBroker.dispatch('withdrawalBankSelected',data);

        },

        onConfirmMPayAccount: function(e) {

            var self = this.self;
            var data = this.data;
            var code = (_.findWhere(data, { name: 'phoneCode' }) || {}).value;
            var number = (_.findWhere(data, { name: 'phoneNumber' }) || {}).value;
            var accountNumber = code + number.substring(1);
            
            data.push({
                name: 'bankAccountNumber',
                value: accountNumber
            });
            
            data.push({
                name: 'bankAccountName',
                value: accountNumber
            });

            self.addBankAccount(data);

        }


    });

})(
    Q,
    Pt.Settings,
    Pt.Rules,
    Pt.Contracts,
    Pt.Helpers,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Widgets.AbstractWidget)
);
/**
 * BaseAnnouncements Widget
 * Container: data-widget=search
 *
 */

(function ($,
    _,
    Settings,
    Config,
    Template,
    Managers,
    Services,
    absWidget
) {

"use strict";

_.Class('Pt.Widgets.BaseSearch', BaseSearch);

/**
* @namespace Pt.Widgets.BaseSearch
* @constructor
*/
function BaseSearch () {

    this.widgetContainer = 'widget[controller|=Search]';
    this.container = 'widgets.search';
    this.el = '[data-widget=search]';
    this.search = '[data-js=filter-search]';

    this.actions = [
        [this.search,  'submit', '_onSearchFormSubmit']
    ];

}

BaseSearch.prototype = _.extend(absWidget, {

    activate: function () {

        var _self = this;

        if ($(this.widgetContainer).length) {

            var view = Managers.Template.get(_self.container);

            this.render(this.widgetContainer, view)._bindEvents();

        }

    },

    _onSearchFormSubmit: function (e) {

        e.preventDefault();

        var query = $(this).find('input').val().toLowerCase();
        var item = $('[data-js=filter-item]');

        if ( ! _.isEmpty(query) ) {

            item.hide().filter(function () {
                return this.title.toLowerCase().indexOf(query) != -1;
            }).show();

        } else {

            item.show();

        }

        if (item.find(':visible').length === 0) {

            $('.no_result').show();

        } else {

            $('.no_result').hide();

        }

 }

});

})(jQuery,
_,
Pt.Settings,
Pt.Config,
Pt.Managers.Template,
Pt.Managers,
Pt.Services,
_.clone(Pt.Widgets.AbstractWidget)
);
/**
 * BaseOverlayPromoBanner Widget
 * Container: data-widget=overlay-promo-banner
 */
(function(
    $,
    Services,
    Managers,
    absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseOverlayPromoBanner', BaseOverlayPromoBanner);

    /**
     * @namespace Pt.Widgets.BaseOverlayPromoBanner
     * @constructor
     */
    function BaseOverlayPromoBanner() {

        this.el = '[data-widget=overlay-promo-banner]';

    }

    BaseOverlayPromoBanner.prototype = _.extend(absWidget, {

        activate: function() {

            var self = this;

            if (! $(self.el).length) {
                return;
            } else {
                $(self.el).hide();
            }

            Services.Cms.WidgetService
                .get('overlay_promo_banner')
                .then(function(res) {

                    var view = Managers.Template.get('widgets.overlayPromoBanner', {
                        banner: {
                            image: res.banner,
                            link: _.isEmpty(res.link) ? '#' : res.link,
                            target: ! _.isEmpty(res.target) ? res.target : '_self',
                            position: res.position
                        }
                    });

                    self.render(self.el, view);

                    $(self.el).addClass(res.position).show();
                });
        }

    });

})(
    jQuery,
    Pt.Services,
    Pt.Managers,
    _.clone(Pt.Widgets.AbstractWidget)
);

(function ($,
    _,
    Helpers,
    Settings,
    Managers,
    Services,
    absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseMediaGallery', BaseMediaGallery);

/**
* @namespace Pt.Widgets.BaseMediaGallery
* @constructor
*/
function BaseMediaGallery () {

    this.widgetContainer = 'widget[controller|=MediaGallery]';
    this.container = '[data-js=media-gallery]';
    this.galleryContainer = '[data-js=gallery-container]';
    this.mediaPlayer = '[data-js=media-player]';
    this.mediaThumbnail = '[data-js=media-thumb]';
    this.mediaSettings = [];
    this.activeMedia = {};
    this.sponsorVideo = {};
    this.playPromise = undefined;

    this.actions = [
        [ '[data-js=media-thumbnail]', 'click', '_onPlayMedia' ],
        [ '[data-js=image-gallery-thumbnail]', 'click', '_onImageGalleryThumbnailClick' ],
        [ '[data-js=gallery-thumb]', 'click', '_onGalleryThumbClick' ],
        [ '.sponsorship [data-widget=generic-modal]', 'hidden.bs.modal', '_onHideGenModal' ],
        [ '[data-js=video]', 'play', '_onPlayPause'],
        [ '[data-js=play-media]', 'click', '_playMedia'],
        ['[data-js=play-sponsor-video]', 'click', '_playSponsorVideo']

    ];

    this.slickOptions = {
        dots: false,
        infinite: true,
        draggable : false,
        arrows: true,
        autoplay: true,
        vertical: false,
        verticalSwiping: false,
        pauseOnHover: true,
        pauseOnFocus: false,
        nextArrow: '<a href="#" class="slider-next" style="right:0;"><span class="data-icon icon-caret-right"></span></a>',
        prevArrow: '<a href="#" class="slider-prev" ><span class="data-icon icon-caret-left"></span></a>',
        autoplaySpeed: parseInt(Settings.banner_interval, 10),
        slidesToShow: 4,
        slidesToScroll: 1
    };

    this.imageGalleryMapping = {};


    }

    BaseMediaGallery.prototype = _.extend(absWidget, {

    activate: function () {
        var self = this;

        Services.Cms.WidgetService.get('media_gallery')
            .then(function (res) {

                self.mediaSettings = res.media_settings;

                var view = Managers.Template.get('widgets.mediaGallery', {
                    mediaSettings : res.media_settings,
                    title : res.title
                });

                self.render(self.widgetContainer, view);

                $('#mediaGalleryVideo').attr('poster', res.media_settings[0].media_thumbnail_upload);


                self.activeMedia = res.media_settings[0];

                $(self.container).slick(self.slickOptions);

                self._bindEvents();
            });

        Services.Cms.WidgetService.get('image_gallery')
            .then(function (res) {
                self.imageGalleryMapping = res.image_mapping;
                var gallery = [];

                _.each(self.imageGalleryMapping, function(item) {

                    gallery.push({
                        image: item.slideshow_images[0].primary_image,
                        video: item.video
                    });

                });

                self.sponsorVideo = _.find(self.imageGalleryMapping, function(gallery) {
                    return ! _.isNull(gallery.video);
                });

                var view = Managers.Template.get('widgets.imageGallery', {
                    gallery : gallery,
                });

                self.render(self.galleryContainer, view);

                $('#tileGalleryVideo').attr('poster', self.sponsorVideo.video_thumbnail);

                self._bindEvents();
            });

    },

    _onPlayMedia : function(e) {

        e.preventDefault();
        var self = e.data.context;
        var id = $(this).attr('class');

        if ( ! id ) return;

        var media = self.mediaSettings[ parseInt(id, 10) ];

        if (! _.isUndefined(media) ) {

            if ( ! _.isUndefined(self.playPromise) ) {

                self.playPromise
                    .then(function() {
                        $('#mediaGalleryVideo').get(0).pause();
                        $('#mediaGalleryVideo').attr('src', '');
                    })
                    .catch(function(err) {
                        void 0;
                    });
            }

            self.activeMedia = {};
            self.activeMedia = media;
            $('#mediaGalleryVideo').attr('poster', media.media_thumbnail_upload);
            $('[data-js=play-media]').show();
        }
    },

    _onGalleryThumbClick : function(e) {

        e.preventDefault();
        var self = e.data.context;
        var src = $(this).attr('data-primaryImage');

        $('[data-js=primary-image-container]').attr('src', src);


    },
    _onHideGenModal : function() {

        $('[data-widget=generic-modal]',this).removeClass("sponsor-gallery");

    },

    _onImageGalleryThumbnailClick: function(e){

        var self = e.data.context;
        var id = $(this).attr('id');
        var gallery_mapping = self.imageGalleryMapping[id];
        var view = Managers.Template.get('widgets.imageGalleryModal', {
            images : gallery_mapping.slideshow_images,
        });
        
        setTimeout(function() {
        $('[data-js=imageGalleryContainer]').slick(self.slickOptions);
        $('[data-js=primaryGallery]').slick({
            dots: false,
            infinite: true,
            arrows: true,
            autoplay: false,
            vertical: false,
            verticalSwiping: false,
            pauseOnHover: true,
            pauseOnFocus: false,
            nextArrow: '<a href="#" class="slider-next" style="right:0;"><span class="data-icon icon-caret-right"></span></a>',
            prevArrow: '<a href="#" class="slider-prev" ><span class="data-icon icon-caret-left"></span></a>',
            autoplaySpeed: parseInt(Settings.banner_interval, 10),
            slidesToShow: 1,
            slidesToScroll: 1
        });
    }, 500);    

        Helpers.Modal.generic(view);
        $('.sponsorship [data-widget=generic-modal]').addClass("sponsor-gallery");
        self._bindEvents();

    },

    _onPlayPause: function(e) {

        e.preventDefault();

        $('[data-js=video]').not(this).each(function () {
            $(this).get(0).pause();
        });


    },

    _playMedia: function(e) {
        var self = e.data.context;
        var activeMedia = self.activeMedia;

        var src = self._generateSrc(activeMedia.embedded_media);
        
        if ( ! _.isUndefined(self.playPromise) ) { 

            self.playPromise
            .then(function() {
                $('#tileGalleryVideo').get(0).pause();
                self._playHlsVideo(src, 'mediaGalleryVideo');
            })
            .catch(function(err){
                void 0;
            });
       
        } else {

            self._playHlsVideo(src, 'mediaGalleryVideo');

        }
       
        $('[data-js=play-media]').hide();

    },

    _playSponsorVideo: function(e) {
        var self = e.data.context;
        var sponsor = self.sponsorVideo;
       
        var src = self._generateSrc(sponsor.video);

        if ( ! _.isUndefined(self.playPromise) ) {

            self.playPromise
                .then(function() {
                    $('#mediaGalleryVideo').get(0).pause();
                    self._playHlsVideo(src, 'tileGalleryVideo');
                })
                .catch(function(err){
                    void 0;
                });
        } else {
            self._playHlsVideo(src, 'tileGalleryVideo');
        }
       

        $('[data-js=play-sponsor-video]').hide();
    },

    _playHlsVideo : function(src, elem) {
        var isHls = src.indexOf('.m3u8') === -1 ? false : true;
        var element = document.getElementById(elem);
        var self = this;

        if (isHls && Hls.isSupported()) {
            var _hls = new Hls();

            _hls.attachMedia(element);
            _hls.on(Hls.Events.MEDIA_ATTACHED,function() {

                _hls.loadSource(src);
                _hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
                    self.playPromise = element.play();
                });
            });
                
        } else {
            $(element).attr('src', src);
            self.playPromise = $(element).get(0).play();
        }
    },

    _generateSrc : function(src) {

        var hostName = window.location.hostname;
        var protocol = window.location.protocol;
        var vidSrc = src.replace(/^((http|https):\/\/domain)/g,'');

        return protocol + '//' + hostName + vidSrc;
    }


});

})(jQuery,
    _,
    Pt.Helpers,
    Pt.Settings,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Widgets.AbstractWidget)
);
(function (
    $,
    _,
    Helpers,
    Managers,
    Settings,
    Services,
    Config,
    Widgets,
    Rules,
    Components,
    _absBalance,
    _absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseQuickFundTransfer', BaseQuickFundTransfer);

    /**
     * @namespace Pt.Widgets.BaseQuickFundTransfer
     * @constructor
     */
    function BaseQuickFundTransfer() {

        this.mainBalance = Widgets.Balance.mainBalance();
        this.headerBalance = Widgets.Balance.headerBalance();
        this.wallets = null;
        this.mainBalanceContainer = '[data-widget=main-balance]';
        this.modal = '[data-js=quick-fund-transfer]';
        this.container = '[data-js=quick-fund-transfer-container]';
        this.balanceFromWallet = '[data-js=balance-from-wallet]';
        this.balanceToWallet = '[data-js=balance-to-wallet]';
        this.walletFrom = '[data-js=quick-wallet-from]';
        this.walletTo = '[data-js=quick-wallet-to]';
        this.transferAmount = '[data-js=transferAmount]';
        this.validator = null;
        this.force = false;
        this.fundTransferForm = '[data-js=fund-transfer-form]';
        this.quickForm = '[data-js=quick-fund-transfer-form]';
        this.walletLists = [];
        
        this.actions = [
            [ this.modal, 'show.bs.modal', '_onQuickTransferModalShow' ],
            [ this.modal, 'hide.bs.modal', '_onQuickTransferModalHide' ],
            [ this.walletFrom, 'change', '_onWalletSelect' ],
            [ this.walletTo, 'change', '_onWalletSelect' ],
            [ this.quickForm, 'submit', '_onFormSubmit' ]
        ];

    }

    BaseQuickFundTransfer.prototype = _.extend(_absWidget, {

        activate: function (container) {

            var self = this;

            container = container || self.container;

            if ( ! Settings.member.isLoggedIn ) {

                return this;

            }

            Helpers.Preloader.small(container);

            _absBalance.getBalances(self.force)
                .then(function (wallets) {

                    var view = Managers.Template.get('widgets.quickFundTransfer', {
                        wallets: wallets
                    });

                    self.walletLists = wallets;

                    self.render(container, view);

                    self.validator = new Managers.Validation(self.quickForm, Rules.validation.fundTransfer);
                    self.validator.bindInput(true);
                    self.validator.init();

                    self._bindEvents();

                });

        },

        _onWalletSelect: function(e) {

            var self = e.data.context;
            var otherWalletSelector = this.name === 'transferFrom' ? self.walletTo : self.walletFrom;

            // Enable the currently disabled wallet and disable the newly selected
            $(otherWalletSelector)
                .find('[disabled]')
                .attr('disabled', false)
                .end()
                .find('option[value="' + this.value + '"]')
                .prop( ! _.isNull(this.value) ? 'disabled' : '', this.value);

            self.updateWalletFieldsDisplay(this.name, parseInt(this.value, 10));

        },

        updateWalletFieldsDisplay: function(name, value) {

            var self = this;

            _.each(self.walletLists, function(wallet) {

                var balanceField = name === 'transferFrom' ? self.balanceFromWallet : self.balanceToWallet;

                if ( wallet.id === value ) {

                    if ( wallet.balance === '-' ) {

                        $(balanceField).val('0.00');

                    } else {

                        $(balanceField).val(wallet.balance);

                    }

                }

                if ( _.isEmpty(value) && _.isNaN(value) && ! _.isNull(value) ) {

                    $(balanceField).val('0.00');

                }

            });

        },

        _onQuickTransferModalShow: function(e) {

            var self = e.data.context;

            if ( self.validator === null ) {

                self.validator = new Managers.Validation(self.quickForm, Rules.validation.fundTransfer);
                self.validator.bindInput(true);
                self.validator.init();

            }
            
        },

        _onQuickTransferModalHide: function(e) {

            var self = e.data.context;

            $(self.quickForm)[0].reset();
            $(self.balanceFromWallet).val('');
            $(self.balanceToWallet).val('');

            if ( self.validator !== null ) {

                self.validator.destroy();
                self.validator = null;

            }
            
        },

        _onFormSubmit: function(e) {

            e.preventDefault();

            var self = e.data.context;

            self.validator.validate(self._validationSuccessfulHandler, self);

        },

        _validationSuccessfulHandler: function(formData) {

            var self = this;

            self.secureFormRequest(self.quickForm, true);

            Helpers.Nprogress.start();

            self._sendFundTransferRequest(formData);

        },

        _sendFundTransferRequest: function (formData) {

            var self = this;

            Services.Members.FundTransferService.transfer(formData)
                .then(function() {

                    Helpers.Notify.success(_.trans('funds.success_message_fund_transfer'));

                    EventBroker.dispatch(EventBroker.events.funds.transfer.complete, formData);

                })
                .fail(function(errors) {

                    Helpers.Error.show(errors);

                })
                .finally(function() {

                    self.secureFormRequest(self.quickForm, false);

                    Helpers.Nprogress.done();

                    if ( $(self.mainBalanceContainer).length && Settings.module.toLowerCase() === 'funds' ) {

                        $(self.fundTransferForm)[0].reset();
                        self.mainBalance.clearWalletIndicator();
                        self.mainBalance.activate();

                    }                   
                    
                    // refresh header balance
                    self.headerBalance
                        .setForce(true)
                        .activate();

                    self.activate(self.container);

                });

        }

    });

})(
    jQuery,
    _,
    Pt.Helpers,
    Pt.Managers,
    Pt.Settings,
    Pt.Services,
    Pt.Config,
    Pt.Widgets,
    Pt.Rules,
    Pt.Components,
    new Pt.Widgets.AbstractBalance,
    _.clone(Pt.Widgets.AbstractWidget)
);


/**

 * BaseConfetti Widget

 * Created by bespino on 01/14/2019.

 */



(function (Managers,

           Services,

           Helpers,

           $q,

           absWidget) {



    "use strict";



    _.Class('Pt.Widgets.BaseConfetti', BaseConfetti);



    /**

     * @namespace Pt.Widgets.BaseConfetti

     * @constructor

     */

    function BaseConfetti() {



        this.container = '[data-js="confetti-container"]';

        this.envelopeModal = 'widgets.envelopeModal';

        this.modalElem = '[data-js=red-packet-modal]';

        this.actions = [



            ['[data-hook=launch-promo]', 'click', '_onSelectConfetti'],

            ['[data-js=confetti-container]', 'click', '_onSelectConfetti'],

            ['[data-js=confetti-container]', 'click', '_onSelectConfetti'],

            ['[data-js=open-envelope]', 'click', '_onOpenEnvelope'],

            [this.modalElem, 'hidden.bs.modal', '_onCloseEnvelope'],



        ];

        this.params = {



            claimCode: 0,

            transferTo: 0,

            amount: 0,

            displayAmount: 0,

            expiry: 30

        };

        this.claimCacheKey = 'claim-flag-key';

        this.claimInProgress = false;

        this.tnc = '';



    }



    BaseConfetti.prototype = _.extend(absWidget, {



        activate: function () {





            if (location.pathname.indexOf('/cashier') > -1 ||

                location.pathname.indexOf('/launcher') > -1 ||

                Managers.Cookie.get('confetti-session-rendered') === Managers.Cookie.get('s') ||

                Managers.Cookie.get('red-packet-not-eligible') === Pt.Settings.member.code ) {



                return false;



            }



            var _self = this;



            $q.all([

                Services.Members.CustomPromotionService.checkRedEnvelopeEligibility('red-packet'),

                Services.Cms.WidgetService.get('red_packet_tnc')

            ])

                .then(function (res) {

                    if (! res[0].hasClaimed && (moment() >= moment(res[0].startDate)) && moment() <= moment(res[0].endDate)) {



                        var expiration = moment(res[0].endDate).diff(moment(),'days');



                        _self.params = {



                            claimCode: res[0].claimCode,

                            transferTo: res[0].walletId,

                            amount: res[0].amount,

                            displayAmount: res[0].amount,

                            expiry: expiration ? expiration : 1



                        };

                        _self.tnc = res[1];

                        _self.init();



                    }







                })





        },



        init: function () {



            var _self = this;



            _self.params.expiry = _self.params.expiry ? _self.params.expiry : 1;



            if (! $(_self.container).length) {



                $('body').append(Managers.Template.get('widgets.confettiContainer'));

                $('[data-widget="generic-modal"]').attr('data-js', 'red-packet-modal').addClass('confetti');



            }



            for (var i = 0; i < 100; i ++) {



                _self.create(i);



            }



            this._bindEvents();



        },

        create: function (i) {



            var _self = this;

            var width = Math.random() * 110;

            var height = width * 0.5;



            $(Managers.Template.get('widgets.confetti', {



                increment: i



            })).css({

                "width": width + "px",

                "height": height + "px",

                "top": - Math.random() * 20 + "%",

                "left": Math.random() * 100 + "%",

                "opacity": Math.random() + 0.5,

                "transform": "rotate(" + Math.random() * 90 + "deg)"

            }).appendTo('[data-js=confetti-container]');



            _self.drop(i);



        },

        drop: function (x) {



            var _self = this;

            $('[data-js=confetti-elem-' + x + ']').animate({

                top: "100%",

                left: "+=" + Math.random() * 15 + "%"

            }, Math.random() * 3000 + 3000, function () {



                _self.reset(x);



            });



        },

        reset: function (x) {



            var _self = this;

            $('[data-js=confetti-elem-' + x + ']').animate({

                "top": - Math.random() * 20 + "%",

                "left": "-=" + Math.random() * 15 + "%"

            }, 0, function () {



                _self.drop(x);



            });



        },

        _onSelectConfetti: function (e) {





            var self = e.data.context;



            Managers.Cookie.set({



                name: 'confetti-session-rendered',

                value: Managers.Cookie.get('s'),

                expires: self.params.expiry



            });





            self.params.isConsolation = _.isEmpty(self.params.claimCode);

            self.params.displayAmount =  self.params.isConsolation ? _.trans('global.red_packet_consolation_message') : self.params.amount ;

            var view = Managers.Template.get(self.envelopeModal, {

                

                

                promoDetails: self.params,

                tnc: self.tnc



            });

            

            Helpers.Modal.generic(view);









        },

        _onOpenEnvelope: function (e) {



            var self = e.data.context;

            var elem = this;

            if (self.claimInProgress) {



                return false;



            }



            Helpers.Nprogress.start();

            self.claimInProgress = true;

            Services.Members.CustomPromotionService.claim('red-packet', self.params)

                .then(function (res) {



                    $(self.modalElem).addClass('red-packet-open');





                }).fail(function (err) {





                var error_obj = _.isArray(err) && ! _.isUndefined(err[0]) ? err[0].message : _.trans('errors.unknown_error');

                var error_message = '';



                try {



                    error_message = JSON.parse(error_obj)['error'];



                } catch (e) {



                    error_message = _.trans('errors.unknown_error');



                }



                try {

                    var temp_obj = JSON.parse(error_obj);



                    if ( _.isObject(temp_obj) && temp_obj.code) {



                        error_obj = {

                            code: temp_obj.code,

                            statusCode: temp_obj.statusCode

                        };



                        error_message = temp_obj.error;

                    }

                } catch (e) {



                }

                



                 var errorCodes = ['100', '103'];



                 if ( _.indexOf(errorCodes, error_obj.code + '') > -1 && error_obj.statusCode === 422 ) {



                    self.params.displayAmount = _.trans('global.red_packet_consolation_message');

                    self.params.isConsolation = true;

                    var view = Managers.Template.get(self.envelopeModal, {



                        promoDetails: self.params,

                        tnc: self.tnc



                     });



                     $(self.modalElem).addClass('red-packet-open');



                    $('.confetti .modal-body').html(view);



                 } else {



                     Helpers.Notify.error(error_message);



                 }



            }).finally(function () {





                self.claimInProgress = false;

                Helpers.Nprogress.done();



            });





        },



        _onCloseEnvelope: function (e) {



            var self = e.data.context;



            $(this).removeClass('confetti red-packet-open');

            $(self.container).remove();



        }



    });



})(

    Pt.Managers,

    Pt.Services,

    Pt.Helpers,

    Q,

    _.clone(Pt.Widgets.AbstractWidget)

);


/**
 * Created by isda on 01/08/2016.
 */


(function (_baseCaptcha) {

    "use strict";

    _.Class('Pt.Widgets.Captcha', new Captcha ());

    /** @namespace Pt.Widgets.Captcha **/
    function Captcha () {

        function Class () {

            _baseCaptcha.call(this);

        }

        Class.prototype = Object.create(_baseCaptcha.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

        }, Pt.Core.Extend('Widgets.Captcha'));


        return new Class();

    }



})(
    Pt.Widgets.BaseCaptcha
);
/**
 * Created by rowen on 11/04/2017.
 */

(function (BaseInputPreLoader) {

    "use strict";

    _.Class('Pt.Widgets.InputPreLoader', InputPreLoader);

    /**
     * @namespace Pt.Widgets.InputPreLoader
     **/
    function InputPreLoader () {

        function Class () {

            BaseInputPreLoader.call(this);

        }

        Class.prototype = Object.create(BaseInputPreLoader.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Widgets.InputPreLoader'));

        return new Class();

    }


})(
    Pt.Widgets.BaseInputPreLoader
);
/**
 * Login Widget
 * Container: data-widget=login
 *
 * Created by isda on 16/03/2017.
 */

(function (_baseLogin) {

    "use strict";

    _.Class('Pt.Widgets.Login', new Login ());

    /** @namespace Pt.Widgets.Login **/
    function Login () {

        function Class () {

            _baseLogin.call(this);

        }

        Class.prototype = Object.create(_baseLogin.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

        }, Pt.Core.Extend('Widgets.Login'));


        return new Class();

    }



})(
    Pt.Widgets.BaseLogin
);
/**
 * ForgotLogin Widget
 * Container: data-widget=login
 *
 * Created by isda on 16/03/2017.
 */

(function (_baseForgotLogin) {

    "use strict";

    _.Class('Pt.Widgets.ForgotLogin', new ForgotLogin ());

    /** @namespace Pt.Widgets.ForgotLogin **/
    function ForgotLogin () {

        function Class () {

            _baseForgotLogin.call(this);

        }

        Class.prototype = Object.create(_baseForgotLogin.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

        }, Pt.Core.Extend('Widgets.ForgotLogin'));


        return new Class();

    }



})(
    Pt.Widgets.BaseForgotLogin
);
/**
 * Signup Widget
 * Container: data-widget=signup
 *
 * Created by isda on 16/03/2017.
 */

(function (_baseSignup) {

    "use strict";

    _.Class('Pt.Widgets.Signup', new Signup);

    /** @namespace Pt.Widgets.Signup **/
    function Signup () {

        function Class () {

            _baseSignup.call(this);

        }

        Class.prototype = Object.create(_baseSignup.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

        }, Pt.Core.Extend('Widgets.Signup'));


        return new Class();

    }



})(
    Pt.Widgets.BaseSignup
);
/**
 * Banner Widget
 * Container: data-widget=banner
 *
 * Created by isda on 21/07/2016.
 */

(function (_baseBanners) {

    "use strict";

    _.Class('Pt.Widgets.Banners', new Banners ());

    /** @namespace Pt.Widgets.Banners **/
    function Banners () {

        function Class () {

            _baseBanners.call(this);

        }

        Class.prototype = Object.create(_baseBanners.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

        }, Pt.Core.Extend('Widgets.Banners'));


        return new Class();

    }



})(
    Pt.Widgets.BaseBanners
);
(function (
    Settings,
    Managers,
    _baseMainBalance
    ) {

    "use strict";

    _.Class('Pt.Widgets.MainBalance', MainBalance);

    /**
     * @namespace Pt.Widgets.MainBalance
     * @return {Class}
     * @constructor
     */
    function MainBalance () {

        function Class () {

            _baseMainBalance.call(this);

        }

        Class.prototype = Object.create(_baseMainBalance.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

            preRender: function (container) {

                container = container || this.balanceContainer;
                var view = Managers.Template.get('widgets.mainBalance', {
                    wallets: this.wallets,
                    totalBalance: '',
                    loadClass: 'loading-wallet'
                });
    
                this.render(container, view);
                return this;
    
            },
    
            /**
             * @param container
             */

            activate: function (container) {
                var self = this;
    
                this.preRender(container);

                this.getBalances()
                    .then(function (res) {

                        var idx = _.findIndex(res[0], {id: 16});
                        
                        if (idx !== -1) {
                            res[0][idx].currency = 'RMB';
                        }

                        var view = Managers.Template.get('widgets.walletItems', {
                            wallets: res[0],
                            totalBalance: self.computeTotalBalance(res[0], Settings.member.currency),
                            loadClass: ''
                        });
    
                        self.render(self.itemContainer, view)
                            ._bindEvents()
                            ._showWalletIndicator();
    
                    });
    
            },
            

        }, Pt.Core.Extend('Widgets.MainBalance'));


        return new Class();

    }



})(
    Pt.Settings,
    Pt.Managers,
    Pt.Widgets.BaseMainBalance
);
/**
 * HeaderBalance Widget
 * Container: data-widget=header-balance
 *
 * Created by isda on 16/03/2017.
 */

(function (
    Settings,
    Helpers,
    Managers,
    _baseHeaderBalance
) {

    "use strict";

    _.Class('Pt.Widgets.HeaderBalance', HeaderBalance);

    /**
     * @namespace Pt.Widgets.HeaderBalance
     * @return {Class}
     * @constructor
     */
    function HeaderBalance () {

        function Class () {

            _baseHeaderBalance.call(this);

        }

        Class.prototype = Object.create(_baseHeaderBalance.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

            activate: function (container) {
                var self = this;

                if (! Settings.member.isLoggedIn) {
                    return this;
                }

                container = container || this.balanceContainer;

                if ( ! self.activated || self.force ) {
                    Helpers.Preloader.small(container);
                }

                self.getBalances(self.force)
                    .then(function (res) {

                        var view = Managers.Template.get('widgets.headerBalance', {
                            wallets: res[0],
                            totalBalance: self.computeTotalBalance(res[0], Settings.member.currency),
                            rewardsPoint: res[1] ? res[1].getPointsBalance() : [],
                            rewardsUrl: self._getRewardsSite()
                        });

                        self.attachTotal(res[0]);
                        self.render(container, view);
                        self.activated = true;
                        self.force = false;
                    });
            }

        }, Pt.Core.Extend('Widgets.HeaderBalance'));

        return new Class();
    }
})(
    Pt.Settings,
    Pt.Helpers,
    Pt.Managers,
    Pt.Widgets.BaseHeaderBalance
);

/**
 * Balance Widget
 *
 * Created by isda on 21/07/2016.
 */

(function (_baseBalance) {

    "use strict";

    _.Class('Pt.Widgets.Balance', new Balance ());

    /** @namespace Pt.Widgets.Balance **/
    function Balance () {

        function Class () {

            _baseBalance.call(this);

        }

        Class.prototype = Object.create(_baseBalance.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

        }, Pt.Core.Extend('Widgets.Balance'));


        return new Class();

    }



})(
    Pt.Widgets.BaseBalance
);
/**
 * Created by rowen on 10/04/2017.
 */

(function (BaseBonusCode) {

    "use strict";

    _.Class('Pt.Widgets.BonusCode', new BonusCode());

    /** @namespace Pt.Widgets.BonusCode **/
    function BonusCode () {

        function Class () {

            BaseBonusCode.call(this);

        }

        Class.prototype = Object.create(BaseBonusCode.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Widgets.BonusCode'));

        return new Class();

    }

})(
    Pt.Widgets.BaseBonusCode
);
/**
 * Banner Widget
 * Container: data-widget=language
 *
 * Created by isda on 21/07/2016.
 */

(function (_baseLanguage) {

    "use strict";

    _.Class('Pt.Widgets.Language', new Language ());

    /** @namespace Pt.Widgets.Language **/
    function Language () {

        function Class () {

            _baseLanguage.call(this);

        }

        Class.prototype = Object.create(_baseLanguage.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

        }, Pt.Core.Extend('Widgets.Language'));


        return new Class();

    }



})(
    Pt.Widgets.BaseLanguage
);
/**
 * Announcements Widget
 * Container: data-widget=announcements
 *
 * Created by isda on 16/03/2017.
 */

(function (_baseAnnouncements) {

    "use strict";

    _.Class('Pt.Widgets.Announcements', new Announcements ());

    /** @namespace Pt.Widgets.Announcements **/
    function Announcements () {

        function Class () {

            _baseAnnouncements.call(this);

            this.announcementNotifyIcon = '[data-js=announcement-notify-icon]';

        }

        Class.prototype = Object.create(_baseAnnouncements.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

            updateNotification: function() {

                var notifyIcon = $(this.announcementNotifyIcon);

                if ( this.unreadAnnouncements.length ) {

                    notifyIcon.removeClass('hide');
                    $(this.el).removeClass('disabled');
                    $(this.notificationEl).removeClass('disabled');

                } else if ( this.announcements.length ) {

                    notifyIcon.addClass('hide');

                } else {

                    notifyIcon.addClass('hide');
                    $(this.el).addClass('disabled');
                    $(this.notificationEl).addClass('disabled');

                }

            }

        }, Pt.Core.Extend('Widgets.Announcements'));


        return new Class();

    }



})(
    Pt.Widgets.BaseAnnouncements
);
/**
 * Jackpot Widget
 * Container: data-widget=jackpot
 *
 * Created by isda on 16/03/2017.
 */

(function (_baseJackpot) {

    "use strict";

    _.Class('Pt.Widgets.Jackpot', new Jackpot ());

    /** @namespace Pt.Widgets.Jackpot **/
    function Jackpot () {

        function Class () {

            _baseJackpot.call(this);

        }

        Class.prototype = Object.create(_baseJackpot.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

        }, Pt.Core.Extend('Widgets.Jackpot'));


        return new Class();

    }



})(
    Pt.Widgets.BaseJackpot
);
/**
 * FeaturedGame Widget
 *
 * Created by bespino on 30/10/2017.
 */

(function (_baseFeaturedGame) {

    "use strict";

    _.Class('Pt.Widgets.FeaturedGame', new FeaturedGame ());

    /** @namespace Pt.Widgets.WinnersNotification **/
    function FeaturedGame () {

        function Class () {

            _baseFeaturedGame.call(this);

        }

        Class.prototype = Object.create(_baseFeaturedGame.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

        }, Pt.Core.Extend('Widgets.FeaturedGame'));


        return new Class();

    }



})(
    Pt.Widgets.BaseFeaturedGame
);
/**
 * HotGames Widget
 *
 * Created by bespino on 30/10/2017.
 */

(function (_baseHotGames) {

    "use strict";

    _.Class('Pt.Widgets.HotGames', new HotGames ());

    /** @namespace Pt.Widgets.HotGames **/
    function HotGames () {

        function Class () {

            _baseHotGames.call(this);

        }

        Class.prototype = Object.create(_baseHotGames.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

        }, Pt.Core.Extend('Widgets.HotGames'));


        return new Class();

    }



})(
    Pt.Widgets.BaseHotGames
);
/**
 * WinnersNotification Widget
 *
 * Created by bespino on 30/10/2017.
 */

(function (_baseWinnersNotification) {

    "use strict";

    _.Class('Pt.Widgets.WinnersNotification', new WinnersNotification ());

    /** @namespace Pt.Widgets.WinnersNotification **/
    function WinnersNotification () {

        function Class () {

            _baseWinnersNotification.call(this);

        }

        Class.prototype = Object.create(_baseWinnersNotification.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

        }, Pt.Core.Extend('Widgets.WinnersNotification'));


        return new Class();

    }



})(
    Pt.Widgets.BaseWinnersNotification
);
/**
 * Splash Widget
 * Container: data-widget=splash
 *
 * Created by - on 19/10/2017.
 */

(function (_baseSplash) {

    "use strict";

    _.Class('Pt.Widgets.Splash', new Splash ());

    /** @namespace Pt.Widgets.Splash **/
    function Splash () {

        function Class () {

            _baseSplash.call(this);

        }

        Class.prototype = Object.create(_baseSplash.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

        }, Pt.Core.Extend('Widgets.Splash'));


        return new Class();

    }



})(
    Pt.Widgets.BaseSplash
);
/**
 * Floating Sidenav Widget
 * Created by mike on March 21, 2018
 */

(function (_baseFloatingSideNav) {

    "use strict";

    _.Class('Pt.Widgets.FloatingSideNav', new FloatingSideNav ());

    /** @namespace Pt.Widgets.FloatingSideNav **/
    function FloatingSideNav () {

        function Class () {

            _baseFloatingSideNav.call(this);

        }

        Class.prototype = Object.create(_baseFloatingSideNav.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

            activate: function() {}

        }, Pt.Core.Extend('Widgets.FloatingSideNav'));


        return new Class();

    }



})(
    Pt.Widgets.BaseFloatingSideNav
);
/**
 * SportsMatch Widget
 * Container: data-widget=sportsMatch
 *
 * Created by - on 12/02/2019.
 */

(function (
	Managers,
	Template,
	Services,
	_baseSportsMatch) {

	"use strict";

	_.Class('Pt.Widgets.SportsMatch', new SportsMatch ());

	/** @namespace Pt.Widgets.SportsMatch **/
	function SportsMatch () {

		function Class () {

			_baseSportsMatch.call(this);

		}

		Class.prototype = Object.create(_baseSportsMatch.prototype);
		Class.prototype.constructor = Class;

		_.extend( Class.prototype, {

		}, Pt.Core.Extend('Widgets.SportsMatch'));

		return new Class();

	}



})(
	Pt.Managers,
	Pt.Managers.Template,
	Pt.Services,
	Pt.Widgets.BaseSportsMatch
);
/**
 * SportsMatch Widget
 * Container: data-widget=sportsLiveFeed
 *
 * Created by - on 12/02/2019.
 */

(function (
    $q,
    Managers,
    Template,
    Services,
    _baseSportsLiveFeed) {

    "use strict";

    _.Class('Pt.Widgets.SportsLiveFeed', new SportsLiveFeed ());

    /** @namespace Pt.Widgets.SportsLiveFeed **/
    function SportsLiveFeed () {

        function Class () {

            _baseSportsLiveFeed.call(this);

        }

        Class.prototype = Object.create(_baseSportsLiveFeed.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

            activate: function (container) {

                var self = this;

                container = container || this.container;

                $q.all([
                    Services.Cms.WidgetService.get('sports_live_feed'),
                    Services.Members.HotMatchFeedService.get()
                ])

                .then(function (res) {

                    if (self.carousel) {

                        self.carousel.slick('unslick');

                    }

                    var data = res[0];

                    if (! _.isEmpty(res[0]) ) {

                        self.items = _.filter(res[1], function(match) {

                            var matchDate = moment(new Date(match.GameDate));
                            var now = moment();

                            return matchDate > now;

                        });

                        self.items = _.sortBy(self.items, 'GameDate');

                        var view = Template.get('widgets.sportsLiveFeed', {
                            matches: self.items,
                            title: data.title,
                            link: data.launcher_link,
                            behavior: data.behavior
                        });

                        self.render(container, view).startTickers();

                        if (self.items.length > 1) {

                            self.runCarousel();

                        }

                    }

                });

                this._bindEvents();

            }

        }, Pt.Core.Extend('Widgets.SportsLiveFeed'));

        return new Class();

    }



})(
    Q,
    Pt.Managers,
    Pt.Managers.Template,
    Pt.Services,
    Pt.Widgets.BaseSportsLiveFeed
);



/***********************
 * COMPONENTS
 ***********************/

/**
 * Abstract Component
 * Created by isda on 08/02/2017.
 */


(function ($,
           _,
           $q,
           bindTrait) {

    'use strict';

    /**
     * @namespace Pt.Components.AbstractComponent
     */
    var AbstractComponent = _.extend(bindTrait, {

    });

    _.Class('Pt.Components.AbstractComponent', AbstractComponent);

})(
    jQuery,
    _,
    Q,
    _.clone(Pt.Core.BindTrait)
);


/**
 * Base Header Component
 * Created by isda on 08/02/2017.
 */

(function (
    Settings,
    Config,
    Widgets,
    Managers,
    PrivateMessageService,
    absComponent
) {

    'use strict';

    _.Class('Pt.Components.BaseHeader', Header);

    /**
     * @namespace Pt.Components.BaseHeader
     * @constructor
     */
    function Header() {

        this.themingOngoing = false;

        this.headerBalance = Widgets.Balance.headerBalance();

        this.defaultDateFormat = 'DD/MM/YYYY HH:mm:ss [GMT] ZZ';

        this.actions = [
            ['[data-js=btn-header-balance]', 'show.bs.dropdown', 'onHeaderBalanceShow'],
            ['[data-js=theme-selection]', 'click', 'onThemeSelect'],
            ['[data-js=language-selection]', 'click', 'onLanguageSelect'],
            ['[data-js=btn-refresh-balances]', 'click', '_onBtnRefreshBalanceClick'],
            ['[data-js=mobile-view]', 'click', '_onMobileView']
        ];

        EventBroker.subscribe(EventBroker.events.privateMessage.read, '_onPrivateMessageRead', this);
        EventBroker.subscribe(EventBroker.events.privateMessage.refresh, 'onPrivateMessageRefresh', this);

    }

    Header.prototype = _.extend(absComponent, {

        preRender: function () {

            var riskCatId = Settings.member.riskCategoryId ? Settings.member.riskCategoryId : '';

            var view = Managers.Template.get('widgets.top_header_component', {
                logo: Settings.logo,
                app: Settings.app,
                isLoggedIn: Settings.member.isLoggedIn,
                module: Settings.module,
                memberCode: Settings.member.code,
                riskCatId :  riskCatId,
                mobile_url: this.getMobile()
            });

            this.renderComponent('top-header-component', view);

        },

        init: function () {

            this.preRender();
            this._loadThemeSelection();
            this._loadLanguageSelection();
            this._loadMenuHover();
            this._loadTimer();
            this._privateMessageNotifications();
            this._bindEvents();


        },

        onHeaderBalanceShow: function (e) {

            var self = e.data.context;

            if (! Settings.member.isLoggedIn) {

                return self;

            }

            self.headerBalance.activate();

        },

        onThemeSelect: function (e) {

            e.preventDefault();

            var self = e.data.context;

            if (self.themingOngoing || ! Pt.Themes) {

                return self;

            }

            self.themingOngoing = true;

            var el = $(this);
            var cssRef = $('[data-js=css-reference]');
            var theme = el.data('theme');

            if (theme === 'default') {

                Managers.Cookie.remove({ name: 'theme' });

            } else {

                Managers.Cookie.set({
                    name: 'theme',
                    value: theme
                });

            }

            var handlers = {

                ie: function () {

                    cssRef.attr('href', Pt.Themes[theme]);

                    self.themingOngoing = false;

                    self._loadThemeSelection();

                    $('[data-js=dropdown-menu]').css('list-style', 'none');

                },

                other: function () {

                    var elTheme = cssRef.clone();

                    elTheme.attr('href', Pt.Themes[theme]);

                    cssRef.after(elTheme);

                    elTheme.on('load', function () {

                        cssRef.remove();

                        self.themingOngoing = false;

                        self._loadThemeSelection();

                        $('[data-js=dropdown-menu]').css('list-style', 'none');

                    });

                }
            };

            handlers[ _.isIe() ? 'ie' : 'other' ]();

        },

        onLanguageSelect: function (e) {

            e.preventDefault();

            var lang = $(this).data('lang');

            Managers.Cookie.set({
                name: 'lang',
                value: lang,
                expires: -1
            });

            Managers.Cookie.set({
                name: 'lang',
                value: lang,
                domain: Settings.main_domain
            });

          location.reload();

        },

        _loadThemeSelection: function () {

            var container = '[data-js=theme-selection-container]';

            if (! $(container).length) {

                return this;

            }

            var theme = Managers.Cookie.get('theme') || 'default';

            var map = {
                indicator: {
                    'default': 'gray-dark',
                    'light': 'gray-lighter'
                },
                title: {
                    'default': _.trans('global.theme_dark'),
                    'light':  _.trans('global.theme_light')
                }
            };

            var view = Managers.Template.get('web.themeSelection', {
                theme: map.title[theme],
                themeIndicator: map.indicator[theme]
            });

            this.render(container, view);

        },

        _loadLanguageSelection: function () {

            var container = '[data-widget=language-selection-container]';

            if (! $(container).length) {

                return this;

            }

            var lang = Managers.Cookie.get('lang') || 'zh-hans';
            var langObj = Config.languages[lang];
            var supportedLanguages = Settings.supported_language || [];
            var languages = [];

            if ( supportedLanguages.length ) {

                languages = _.filter(Config.languages, function(configLanguage) {

                    var supported = false;

                    _.each(supportedLanguages, function(supportedLanguage) {

                        if ( configLanguage.key === supportedLanguage.code ) {

                            supported = true;

                        }

                    });

                    return supported;

                });

            }

            var view = Managers.Template.get('web.languageSelection', {
                activeLang: lang,
                activeLangLabel: langObj.label,
                activeLangIcon: langObj.key,
                languages: languages
            });

            this.render(container, view);

        },

        _loadMenuHover: function () {

            if ($('[data-js=menu-thumb],[data-js=menu-basic]').length) {

                /***********************
                 * Menu Hover Thumb
                 ***********************/
                $('.main-nav .dropdown, .navbar-nav .dropdown').hover(function () {

                    $(this).addClass('open').trigger('show.bs.dropdown');

                }, function () {

                    $(this).removeClass('open');

                });

            }

            if ($('[data-js=menu-basic]').length) {

                /***********************
                 * Menu Hover Basic
                 ***********************/
                $('.main-nav .dropdown').hover(function () {

                    $(this).addClass('open');

                }, function () {

                    $(this).removeClass('open');

                });

            }

        },

        _loadTimer: function () {

            /**********************
             * Application Timer
             ********************/
            var self = this;

            var timerElement = $('[data-js=app-timer]');

            var timerFormat = timerElement.data('time-format') || self.defaultDateFormat;

            if ( timerElement.length ) {

                var _runClock = function () {

                    var newDate = new Date();

                    var date = window.moment(newDate, timerFormat, true);

                    var displayDateTime = self._customDateDisplay(date.format(timerFormat));

                    timerElement.html(displayDateTime);

                    setTimeout( function() {

                        _runClock();

                    }, 800);

                };

                _runClock();

            }

        },

        _onBtnRefreshBalanceClick: function( e ) {

            var self = e.data.context;
            self.headerBalance
                .setForce(true)
                .activate();

        },

        _privateMessageNotifications: function(force) {

            var self = this;
            var notif = $('[data-js=private-messages-notification]');

            if ( notif.length ) {

                PrivateMessageService.getUnread(force).then(function (res) {

                    if ( res.unread ) {

                        notif.addClass('in');
                        self.render(notif, res.unread.toString());

                    } else {

                        notif.removeClass('in');

                    }

                });

            }

        },

        _onPrivateMessageRead: function() {

            this._privateMessageNotifications(true);

        },

        _customDateDisplay: function(date){

            //can be change through cms override
            return date;

        },

        onPrivateMessageRefresh: function() {

            this._privateMessageNotifications(true);

        },

        getMobile: function() {

            var mobile_url = [];

            if ( Settings.site === 'MemberSite' ) {

                var memberDomainMap = _.propertyValue(Settings.domain, 'membersite', []);

                _.each(memberDomainMap, function(mapItem) {

                    if ( window.location.hostname === mapItem.member_domain ) {

                        mobile_url.push(window.location.protocol + '//' + mapItem.mobile_domain);

                    }

                });

            }

            return mobile_url;
        },

        _onMobileView: function(e) {

            e.preventDefault();

            if ( ! _.isEmpty(Managers.Cookie.get('fw')) ) {

                Managers.Cookie.remove({ name: 'fw', domain: Settings.main_domain });

            }
            
            location.href = $(this).attr('href');

        }



    }, Pt.Core.Extend('Components.BaseHeader'));

})(
    Pt.Settings,
    Pt.Config,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services.Members.PrivateMessageService,
    _.clone(Pt.Components.AbstractComponent)
);
/**
 * Created by rowen on 11/04/2017.
 */

(function (
    Modal,
    Settings,
    Helpers,
    Managers,
    BonusCodeService,
    absComponent
) {

    'use strict';

    _.Class('Pt.Components.BaseFundTransferConfirm', FundTransferConfirm);

    /**
     * @namespace Pt.Components.BaseFundTransferConfirm
     * @constructor
     */
    function FundTransferConfirm() {

        this.actions = [];
        this.params = {
            walletId: '',
            bonusCode: '',
            amount: ''
        };

        this.modalConfig = {
            confirmButton: _.trans('funds.button_proceed'),
            cancelButton: _.trans('funds.button_cancel'),
            confirm: undefined,// action if proceed
            cancel: undefined // action if cancelled
        };

        this.promoActions = {
            valid: undefined,
            invalid: undefined
        };

    }

    FundTransferConfirm.prototype = _.extend(absComponent, {

        init: function () {

        },

        confirm: function(walletId, bonusCode, amount) {

            var self = this;

            BonusCodeService.getBonusCodeStatus(walletId, bonusCode, amount)
                .then(function(status) {

                    if (status.get('code') > 0 ) {

                        self.modalConfig.text = status.get('message');
                        self.modalConfig.confirmButton = _.trans('funds.button_proceed_without_promo');

                        self.modalConfig.confirm = self.promoActions.invalid;

                    } else {

                        self.modalConfig.confirmButton = _.trans('funds.button_proceed_with_promo');
                        self.modalConfig.text = _.str_replace_key(
                            {
                                ':currency': Settings.member.currency,
                                ':amount': _.toCurrency(status.get('rolloverAmount'))
                            },
                            _.trans('funds.rollover_notification_message')
                        );

                        self.modalConfig.confirm = self.promoActions.valid;

                    }

                    Modal.confirm(self.modalConfig);

                });

        },

        onPromoValid: function (action) {

            this.promoActions['valid'] = action;

            return this;

        },

        onPromoInvalid: function (action) {

            this.promoActions['invalid'] = action;

            return this;

        },

        onCancel: function (action) {

            this.modalConfig['cancel'] = action;

            return this;

        }

    });

})(
    Pt.Helpers.Modal,
    Pt.Settings,
    Pt.Helpers,
    Pt.Managers,
    Pt.Services.Members.BonusCodeService,
    _.clone(Pt.Components.AbstractComponent)
);

/**
 * GPI Header
 * Created by isda on 27/02/2017.
 */


(function (
    _baseHeaderComponent,
    PrivateMessageService
) {

        _.Class('Pt.Components.Header', new Header());

        /**
         * @namespace Pt.Components.Header
         * @return {Class}
         * @constructor
         */
        function Header() {

            function Class() {

                _baseHeaderComponent.call(this);

            }

            Class.prototype = Object.create(_baseHeaderComponent.prototype);
            Class.prototype.constructor = Class;

            _.extend(Class.prototype, {

                _privateMessageNotifications: function(force) {

                    var self = this;
                    var notif = $('[data-js=private-messages-notification]');

                    if ( notif.length ) {
                        PrivateMessageService.getUnread(force).then(function (res) {
                            if ( res.unread && ! notif.hasClass('in') ) {
                                notif.addClass('in');
                            } else if ( ! res.unread && notif.hasClass('in') ) {
                                notif.removeClass('in');
                            }
                            self.render(notif, res.unread.toString());
                        });
                    }
                },

                _onBtnRefreshBalanceClick: function(e) {

                    e.stopPropagation();

                    var self = e.data.context;

                    self
                        .headerBalance
                            .setForce(true)
                            .activate();
                }

            }, Pt.Core.Extend('Components.Header'));

            return new Class();

        }

    }
)(
    Pt.Components.BaseHeader,
    Pt.Services.Members.PrivateMessageService
);

/**
 * Created by rowen on 11/04/2017.
 */

(function (BaseFundTransferConfirm) {

        _.Class('Pt.Components.FundTransferConfirm', new FundTransferConfirm());

        /**
         * @namespace FundTransferConfirm
         * @memberOf Pt.Components.
         * @return {Class}
         * @constructor
         */
        function FundTransferConfirm() {

            function Class() {

                BaseFundTransferConfirm.call(this);

            }

            Class.prototype = Object.create(BaseFundTransferConfirm.prototype);
            Class.prototype.constructor = Class;

            _.extend(Class.prototype, {

            }, Pt.Core.Extend('Components.FundTransferConfirm'));

            return new Class();

        }

    }
)(
    Pt.Components.BaseFundTransferConfirm
);


/***********************
 * WEB CONTROLLER
 ***********************/

/**
 * @namespace Pt.Controllers
 *
 * Abstract Controller
 * Created by isda on 15/12/2016.
 */

(function ($,
           _,
           $q,
           Helpers,
           Route,
           Middleware,
           bindTrait) {

    'use strict';

    /**
     * @namespace AbstractController
     * @memberOf Pt.Controllers
     * @extends Pt.Core.BindTrait
     * @constructor
     */
    var AbstractController = _.extend(bindTrait, {

        inProgress: false,

        /**
         * Manage page activation
         * @param requestContext
         * @param next
         * @returns {Pt.Controllers.AbstractController}
         */
        activate: function (requestContext, next) {
            
            var self = this;

            $('body').removeClass('is-middleware-busy');

            if (_.isSameRoute(Route.getContext(), requestContext)) {

                return this;

            }

            if(this.middleware) {
                $('body').addClass('is-middleware-busy');
            }

            Middleware.run( this.middleware, requestContext )
                .finally(function() {

                    Route.setContext(requestContext);

                    var nextHandler = function () {

                        $('body').removeClass('is-middleware-busy');

                        EventBroker.dispatch(EventBroker.events.routes.changed, requestContext);

                        $('body').attr('data-class', _.snakeCaseUri(requestContext.path));

                        next();

                    };

                    self.nexter(nextHandler, requestContext);
                });

        },

        /**
         * Call next request
         * @param next
         * @param requestContext
         */
        nexter: function (next, requestContext) {

            if (typeof this['resolve'] === 'function') {

                this['resolve'](next, requestContext);

            } else {

                next();

            }

        },

        secureFormRequest: function (form, secure, shouldResetForm ) {

            shouldResetForm = _.isBoolean(shouldResetForm) ? shouldResetForm : true;

            if (secure) {

                if (this.inProgress) {

                    return this;

                }

                this.inProgress = true;

                Helpers.Form.lockForm(form, true);

            } else {

                this.inProgress = false;

                if ( shouldResetForm ) {


                    $(form)[0].reset();

                }

                Helpers.Form.lockForm(form, false);

            }

        }

    });

    _.Class('Pt.Controllers.AbstractController', AbstractController);

})(
    jQuery,
    _,
    Q,
    Pt.Helpers,
    Pt.Core.Router,
    Pt.Middleware,
    _.clone(Pt.Core.BindTrait)
);


/*********************************
 * PROFILE MANAGEMENT CONTROLLER
 ********************************/

/**
 * Abstract Profile Controller
 * Created by isda on 12/07/2016.
 */


(function ( $,
            $q,
            _,
            Helpers,
            Services,
            $absController
) {

    "use strict";


    /**
     * @namespace Pt.Controllers.AbstractProfileController
     */
    var AbstractProfileController = _.extend($absController, {

        /**
         * Call next request
         * @param next
         * @param requestContext
         */
        nexter: function (next, requestContext) {

            /****************
             * Activate Tabs
             ****************/

            $(this.elTabs).find('li').removeClass('active');
            $(this.elTabs + ' a[href$="' + _.urlSegments(requestContext.pathname, 0, 2) + '"]')
                .parent().addClass('active');

            Helpers.Preloader.basic(this.el);

            if (typeof this['resolve'] === 'function') {

                this['resolve'](next, requestContext);

            } else {

                next();

            }

        },
        loadDefaultValues: function() {

            Services.Members.MemberService.getMember().then(function(memberInfo){

                $('[data-constant=fullName]').val(memberInfo.getFullName()).attr('readonly',true);

            });


        }

    });

    _.Class('Pt.Controllers.AbstractProfileController', AbstractProfileController);

})(
    jQuery,
    Q,
    _,
    Pt.Helpers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Base Member Controller
 * Created by isda on 13/12/2016.
 */


(function (
    Settings,
    Rules,
    Contracts,
    Helpers,
    Widgets,
    Managers,
    Services,
    absCtrl
) {

    "use strict";

    _.Class('Pt.Controllers.BaseMemberController', BaseMemberController);

    /**
     * @namespace Pt.Controllers.BaseMemberController
     * @constructor
     */
    function BaseMemberController() {

        this.el = '[data-js=profile-container]';
        this.elTabs = '[data-js=profile-tabs]';
        this.form = '[data-js=profile-form]';
        this.passwordFieldSelector = '[data-js=profile-verify-password]';
        this.securityAnswerSelector = '[data-js=security-answer]';
        this.validator = null;
        this.inProgress = false;
        this.member = null;
        this.actions = [
            [this.form, 'submit', '_onFormSubmit'],
        ];

    }

    BaseMemberController.prototype = _.extend(absCtrl, {

        resolve: function (next) {

            var self = this;

            Services.Members.MemberService.getMember(true)
                .then(function (res) {

                    self.member = res;

                })

                .fail(function () {

                    self.member = new Contracts.Member();

                })

                .finally(function () {

                    next();

                })
            ;

        },

        init: function () {

            var view = Managers.Template.get('profile.member', {
                member: this.member
            });

            this.render(this.el, view)
                ._maskPassword()
                ._bindEvents()
            ;

            this.validator = new Managers.Validation(this.form, Rules.validation.member);
            this.validator
                .bindInput(true)
                .init();
            
        },

        _maskPassword: function() {

            return this;

        },

        _onFormSubmit: function (e) {

            e.preventDefault();

            var self = e.data.context;

            self.validator.validate(self._onValidationSuccess, self);

        },

        _onValidationSuccess: function (data, self) {

            self.secureFormRequest(self.form, true);

            Helpers.Nprogress.start();

            Services.Members.MemberService.update(data)
                .then(function () {

                    Helpers.Notify.success(_.trans('profile.edit_profile_success_message'));

                    if ( Settings.account_verification ) {

                        EventBroker.dispatch(EventBroker.events.profileUpdated, true);

                    }

                })
                .fail(function (e) {

                    Helpers.Error.show(e);

                })
                .finally(function () {

                    self.secureFormRequest(self.form, false, false);
                    Helpers.Nprogress.done();
                    $(self.passwordFieldSelector).val('');

                })
            ;

        }
    });

})(
    Pt.Settings,
    Pt.Rules,
    Pt.Contracts,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractProfileController)
);
/**
 * Delivery Address Controller
 * Created by isda on 03/04/2017.
 */

(function (
    Rules,
    Contracts,
    Helpers,
    Managers,
    Services,
    absCtrl
) {

    'use strict';

    _.Class('Pt.Controllers.BaseDeliveryAddressController', BaseDeliveryAddressController);

    /**
     * @namespace Pt.Controllers.BaseDeliveryAddressController
     * @constructor
     */
    function BaseDeliveryAddressController() {

        this.el = '[data-js=profile-container]';
        this.elTabs = '[data-js=profile-tabs]';
        this.form = '[data-js=delivery-address-form]';
        this.member = null;

        this.actions = [
            [ this.form, 'submit', '_onFormSubmit']
        ];

    }

    BaseDeliveryAddressController.prototype = _.extend(absCtrl, {

        resolve: function (next) {

            var self = this;

            Services.Members.MemberService.getMember(true)
                .then( function (res) {

                    self.member = res;

                })

                .fail (function () {

                    self.member = new Contracts.Member();

                })

                .finally (function () {

                    next();

                })
            ;


        },

        init: function () {

            var view = Managers.Template.get('profile.deliveryAddress', {
                member: this.member
            });

            this.render(this.el, view)
                ._bindEvents()
            ;

            this.validator = new Managers.Validation(this.form, Rules.validation.deliveryAddress);
            this.validator
                .bindInput(true)
                .init();

        },

        _onFormSubmit: function (e) {

            e.preventDefault();

            var self = e.data.context;

            self.validator.validate(self._onValidationSuccess, self);

        },

        _onValidationSuccess: function (data, self) {

            self.secureFormRequest(self.form, true);

            Helpers.Nprogress.start();

            Services.Members.MemberService.updateDeliveryAddress(data)
                .then(function () {

                    Helpers.Notify.success(_.trans('profile.edit_delivery_address_success_message'));
                    self.secureFormRequest(self.form, false, false);

                })
                .fail(function (e) {

                    Helpers.Error.show(e);
                    self.secureFormRequest(self.form, false);

                })
                .finally(function () {
                    
                    Helpers.Nprogress.done();

                })
            ;

        }

    });

})(
    Pt.Rules,
    Pt.Contracts,
    Pt.Helpers,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractProfileController)
);
/**
 * Password Controller
 * Created by isda on 03/04/2017.
 */

(function (
    Rules,
    Contracts,
    Helpers,
    Managers,
    Services,
    absCtrl
) {

    'use strict';

    _.Class('Pt.Controllers.BasePasswordController', BasePasswordController);

    /**
     * @namespace Pt.Controllers.BasePasswordController
     * @constructor
     */
    function BasePasswordController() {

        this.el = '[data-js=profile-container]';
        this.elTabs = '[data-js=profile-tabs]';
        this.form = '[data-js=password-form]';
        this.member = null;

        this.actions = [
            [ this.form, 'submit', '_onFormSubmit']
        ];

    }

    BasePasswordController.prototype = _.extend(absCtrl, {

        init: function () {

            var view = Managers.Template.get('profile.password', {
                member: this.member
            });

            this.render(this.el, view)
                ._bindEvents()
            ;

            this.validator = new Managers.Validation(this.form, Rules.validation.updatePassword);
            this.validator
                .bindInput(true)
                .init();

        },

        _onFormSubmit: function (e) {

            e.preventDefault();

            var self = e.data.context;

            self.validator.validate(self._onValidationSuccess, self);

        },

        _onValidationSuccess: function (data, self) {

            self.secureFormRequest(self.form, true);

            Helpers.Nprogress.start();

            Services.Members.MemberService.updatePassword(data)
                .then(function () {

                    Helpers.Notify.success(_.trans('profile.change_password_success_message'));

                })
                .fail(function (e) {

                    Helpers.Error.show(e);

                })
                .finally(function () {

                    self.secureFormRequest(self.form, false);
                    Helpers.Nprogress.done();

                })
            ;

        }

    });

})(
    Pt.Rules,
    Pt.Contracts,
    Pt.Helpers,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractProfileController)
);
/**
 * Created by : jomaf - Joseph John Fontanilla
 * Date: 8/14/17
 * Time: 11:59 AM
 */
(function (Q,
    Settings,
    Rules,
    Contracts,
    Helpers,
    Managers,
    Services,
    Widgets,
    absCtrl) {

    'use strict';

    _.Class('Pt.Controllers.BaseBankingDetails', BaseBankingDetails);

    /**
     * @namespace Pt.Controllers.BaseBankingDetails
     * @constructor
     */
    function BaseBankingDetails() {

        this.el = '[data-js=profile-container]';
        this.elTabs = '[data-js=profile-tabs]';
        this.bankingDetailsWrapper = '[data-js=banking-details]';
        this.provinceSelection = '[data-js=province-selection]';
        this.citySelection = '[data-js=city-selection]';
        this.districtSelection = '[data-js=district-selection]';
        this.bankNameWrapper = '[data-js=bank-name-native-wrapper]';
        this.bankNameNative = '[data-js=bank-name-native]';
        this.bankName = '[data-js=bank-name]';
        this.bankSelection = '[data-js=bank-selection]';
        this.bankingDetails = {};
        this.provinces = [];
        this.cities = [];
        this.districts = [];
        this.banks = [];
        this.currency = Settings.member.currency;
        this.cityLabel = _.trans('profile.label_select_city');
        this.districtLabel = _.trans('profile.label_select_district');
        this.otherBankValue = 'OTHER';
        this.bankAddressId = '[data-js=bank-address-id]';
        this.bankAddress = '[data-js=bank-address]';
        this.bankAccountNumberIrregular = '[data-js=bank-account-number-irregular]';
        this.radioPreferred = '[data-js=radio-preferred]';
        this.form = '[data-js=banking-details-form]';
        this.formEdit = '[data-js=banking-details-form-edit]';

        this.actions = [
            [ this.provinceSelection, 'change', '_onProvinceChange' ],
            [ this.citySelection, 'change', '_onCityChange' ],
            [ this.districtSelection, 'change', '_onDisctrictChange' ],
            [ this.bankSelection, 'change', '_onBankChange' ],
            [ this.bankNameNative, 'change', '_onBankNameNativeChange' ],
            [ this.bankAccountNumberIrregular, 'change', '_onBankAccountNumberIrregularChange' ],
            [ '[data-js=bank-account-edit]', 'click', '_onBankAccountEdit' ],
            [ '[data-js=bank-account-edit-cancel]', 'click', '_onBankAccountEditCancel' ],
            [ '[data-js=bank-account-delete]', 'click', '_onBankAccountDelete' ],
            [ this.radioPreferred, 'change', '_onRadioPreferredChange' ],
            [ this.form, 'submit', '_onFormSubmit' ],
            [ this.formEdit, 'submit', '_onFormSubmitEdit' ]
        ];

        this.addFormSelector = '';
        this.editFormSelector = '';
        this.editFormCounter = 0;
        this.deleteAccountId = null;

        this.modalConfig = {
            text: _.trans('profile.alert_delete_bank'),
            confirmButton: _.trans('funds.button_proceed'),
            cancelButton: _.trans('funds.button_cancel'),
            confirm: this._onConfirmBankAccountDelete
        };

    }

    BaseBankingDetails.prototype = _.extend(absCtrl, {

        resolve: function ( next ) {

            var self = this;
            Q.all( [
                Services.Members.BankService.getBankingList(true),
                Services.Members.BankingAddressService.getProvinces(),
                Services.Members.BankService.getBanks(),
                Services.Members.MemberService.getMember()
            ] ).then( function ( response ) {

                self.bankingDetails = response[ 0 ];
                self.provinces = response[ 1 ];
                self.banks = response[ 2 ];
                self.member = response[ 3 ];

            } ).fail( function () {

                Helpers.Notify.error( _.trans( 'errors.unknown_error_notification' ) );

            } ).finally( function () {

                next();

            } );

        },

        init: function () {

            // refresh banks
            this._refreshBankList();

            // check currency for bank rules
            if ( this.currency !== 'RMB' && this.currency !== 'VND' ) {

                Rules.validation.bankDetail.bankProvince = {};
                Rules.validation.bankDetail.bankCity = {};
                Rules.validation.bankDetail.bankDistrict = {};

            }

            if ( this.currency === 'VND' ) {

                Rules.validation.bankDetail.bankDistrict = {};

            }

        },

        _onProvinceChange: function(e) {

            var self = e.data.context;
            var selected = _.findWhere( self.provinces, { id: + $(this).val() } );

            var citySelector = '[data-city-id=city-' + $(this).closest('[data-js=address-group]').data('target') + ']';
            var districtSelector = '[data-district-id=district-' + $(this).closest('[data-js=address-group]').data('target') + ']';

            self._renderSelectionMarkup( [], citySelector, self.cityLabel );
            self._renderSelectionMarkup( [], districtSelector, self.districtLabel );

            self._fetchAndRender({
                element: citySelector,
                type: 'cities',
                service: selected,
                label: self.cityLabel
            });

            // build bankAddressId
            self._setbankAddressId(this);

        },

        _onCityChange: function(e) {

            var self = e.data.context;
            var selected = _.findWhere(self.cities, { id: + $(this).val() });

            var districtSelector = '[data-district-id=district-' + $(this).closest('[data-js=address-group]').data('target') + ']';

            self._renderSelectionMarkup( [], districtSelector, self.districtLabel);

            if ( Settings.member.currency != 'VND' ) {

                self._fetchAndRender({
                    element: districtSelector,
                    type: 'districts',
                    service: selected,
                    label: self.districtLabel
                });

            }

            // build bankAddressId
            self._setbankAddressId(this);

        },

        _onDisctrictChange: function(e) {

            var self = e.data.context;

            // build bankAddressId
            self._setbankAddressId(this);

        },

        _onBankChange: function ( e ) {

            var self = e.data.context;
            var value = $(this).val();

            // condition for rules validation
            if ( value === self.otherBankValue ) {

                Rules.validation.bankDetail.bankNameNative = {
                    presence: {
                        message: "^" + _.trans('errors.bankName_required')
                    },
                    length: {
                        maximum: 100,
                        tooLong: "^" + _.trans('errors.max_bankName')
                    }
                };

                // show bank name
                $(this).closest('form').find(self.bankNameWrapper).removeClass('hide');

                // change bank native name
                $(this).closest('form').find(self.bankNameNative).val('');
                $(this).closest('form').find(self.bankName).val('');

            } else {
                
                Rules.validation.bankDetail.bankNameNative = {};

                // hide bank name
                $(self.bankNameWrapper).addClass('hide');

                // change bank native name
                $(this).closest('form').find(self.bankNameNative).val($(this).find(':selected').text());
                $(this).closest('form').find(self.bankName).val($(this).find(':selected').text());

            }

        },

        _onBankNameNativeChange: function ( e ) {

            // sync bank name field
            var self = e.data.context;
            $(self.bankName).val($(this).val());

        },

        _onBankAccountNumberIrregularChange: function( ) {

            // sync closest bank-account-name
            $(this).closest('[data-js=banking-details-form]').find('[data-js=bank-account-name]').val($(this).val());

        },

        _onBankAccountDelete: function( e ) {

            e.preventDefault();

            var self = e.data.context;
            self.modalConfig.accountId = $(this).data('account-id');
            self.modalConfig.self = self;
            Helpers.Modal.confirm(self.modalConfig);

        },

        _onConfirmBankAccountDelete: function( e ) {

            var self = this.self;
            var accountId = this.accountId;

            Helpers.Nprogress.start();

            Services.Members.BankService.deleteBankAccount(accountId)
                .then(function (res) {

                    Helpers.Notify.success(_.trans('profile.remove_bank_detail_success_message'));

                    // refresh banks
                    self._refreshBankList(true, res);

                })
                .fail(function (e) {

                    Helpers.Error.show(e);

                })
                .finally(function () {

                    Helpers.Nprogress.done();

                });

        },

        _fetchAndRender: function( options ) {

            var self = this;

            $(options.element).prop('disabled', true);

            options.service['get' + _.ucfirst(options.type) ]()
                .then(function( data ) {

                    self[options.type] = data;
                    self._renderSelectionMarkup( data, options.element, options.label );

                    $(options.element).prop('disabled', false);

                });

        },

        _renderSelectionMarkup: function( selection, wrapper, placeholder) {

            this.render( wrapper, Managers.Template.get('profile.addressSelections', {

                selections: selection,
                placeholder: placeholder

            }));

        },

        _setbankAddressId: function( selectObj ) {
        
            var provinceText = $(selectObj).closest('form').find(this.provinceSelection).find(':selected').text();
            var cityText = $(selectObj).closest('form').find(this.citySelection).find(':selected').text();
            var districtText = $(selectObj).closest('form').find(this.districtSelection).find(':selected').text();
        
            var provinceVal = $(selectObj).closest('form').find(this.provinceSelection).val();
            var cityVal = $(selectObj).closest('form').find(this.citySelection).val();
            var districtVal = $(selectObj).closest('form').find(this.districtSelection).val();

            if ( provinceVal && cityVal && districtVal && Settings.member.currency === 'RMB' ) {

                $(selectObj).closest('form').find(this.bankAddressId).val(provinceVal + '|' + cityVal + '|' + districtVal );
                $(selectObj).closest('form').find(this.bankAddress).val(provinceText + ', ' + cityText + ', ' + districtText );

            } else if ( provinceVal && cityVal && Settings.member.currency === 'VND' ) {

                $(selectObj).closest('form').find(this.bankAddressId).val(provinceVal + '|' + cityVal );
                $(selectObj).closest('form').find(this.bankAddress).val(provinceText + ', ' + cityText );

            } else {

                $(selectObj).closest('form').find(this.bankAddressId).val('');
                $(selectObj).closest('form').find(this.bankAddress).val('');

            }

        },

        _onFormSubmit: function( e ) {

            e.preventDefault();
            var self = e.data.context;
            
            self.addFormSelector = '[data-id=' + $(this).data('id') + ']';

            var validator = new Managers.Validation( self.addFormSelector, Rules.validation[$(this).data('validator')] );
            validator.bindInput(true).init();
            validator.validate(self._onValidationSuccess, self);

        },

        _onValidationSuccess: function( data, self ) {

            var bankCodeObj = _.findWhere(data, { name: "bankCode" }) || {};

            if ( bankCodeObj.value === 'MOMO' ) {

                Helpers.Modal.confirm({
                    text: _.trans('profile.alert_mpay_confirm'),
                    confirmButton: _.trans('funds.button_proceed'),
                    cancelButton: _.trans('funds.button_cancel'),
                    confirm: this.onConfirmMPayAccount,
                    self: self,
                    data: data
                });

                return false;

            }

            self.addBankAccount(data);

        },

        addBankAccount: function(data) {

            var self = this;

            Helpers.Nprogress.start();
            self.secureFormRequest(self.addFormSelector, true);

            Services.Members.BankService
                .addBankAccount(data)
                .then(function (res) {

                    Helpers.Notify.success(_.trans('profile.edit_bank_detail_success_message'));

                    Services
                        .Members
                        .BankService
                        .getBankingList()
                        .then(function(response) {

                            self.bankingDetails = response;
                            self._renderBankList();

                            if ( Settings.account_verification ) {

                                EventBroker.dispatch(EventBroker.events.bankDetailsUpdated,true);

                            }

                            
                        })
                        .catch(function(error) {

                            Helpers.Error.show(e);

                        });


                })
                .fail(function (e) {

                    Helpers.Error.show(e);

                })
                .finally(function () {

                    self.secureFormRequest(self.addFormSelector, false);
                    Helpers.Nprogress.done();

                });

        },

        _refreshBankList: function( reFetchData, response ) {

            var self = this;

            if ( reFetchData ) {

                self.bankingDetails = Services.Members.BankService.banksToModel(response);
                self._renderBankList();

            } else {

                this._renderBankList();

            }

        },

        _renderBankList: function() {

            var view = Managers.Template.get('profile.bankingDetails', {
                bankingDetails: this.bankingDetails,
                provinces: this.provinces,
                currency: this.currency,
                banks: this.banks,
                member: this.member
            });

            this.render( this.el, view )
                ._bindEvents();

        },

        _onBankAccountEdit: function( e ) {

            e.preventDefault();

            var self = e.data.context;
            var accountId = $(this).data('account-id');
            var targetWrapper = '[data-form-wrapper-id=' + $(this).data('form-wrapper-target') + ']';

            Helpers.Nprogress.start();

            // fetch bank details
            Services.Members.BankService.getBankAccount(accountId)
                .then(function (res) {

                    var bankAccountData = res.data;

                    // check if address, then fetch data
                    if ( bankAccountData.bankAddressId && bankAccountData.bankAddressId.indexOf('|') > - 1 ) {

                        // fetch address first
                        var addressArr = bankAccountData.bankAddressId.split('|');
                        var addressProvince = addressArr[0];
                        var addressCity = addressArr[1];
                        var addressDistrict = addressArr[2] || null;

                        Q.all( [
                            Services.Members.BankingAddressService.getCities(addressProvince),
                            addressDistrict ? Services.Members.BankingAddressService.getDistricts(addressCity) : null
                        ] ).then( function ( response ) {

                            var cities = response[0];
                            var districts = response[1];

                            self._renderEditForm(targetWrapper, {
                                account: bankAccountData,
                                provinces: self.provinces,
                                cities: cities,
                                districts: districts,
                                selectedProvince: addressProvince,
                                selectedCity: addressCity,
                                selectedDistrict: addressDistrict
                            });

                        });


                    } else {

                        self._renderEditForm(targetWrapper, {
                            account: bankAccountData,
                            provinces: self.provinces,
                            cities: [],
                            districts: [],
                            selectedProvince: null,
                            selectedCity: null,
                            selectedDistrict: null
                        });

                    }

                })
                .finally( function() {

                    Helpers.Nprogress.done();

                });

        },

        _renderEditForm: function( target, options ) {

            this.editFormCounter = this.editFormCounter + 1;

            var view = Managers.Template.get('profile.bankingDetailsEdit', _.extend(
                {}, options, {
                    banks: this.banks,
                    currency: this.currency,
                    member: this.member,
                    unique: this.editFormCounter
                }
            ));

            this.render( target, view )
                ._bindEvents();

            // check for other bank
            if ( $(target).find(this.bankSelection).val() === this.otherBankValue ) {

                $(target).find(this.bankNameWrapper).removeClass('hide');

            }

        },

        _onFormSubmitEdit: function( e ) {

            e.preventDefault();
            var self = e.data.context;
            self.editFormSelector = '[data-edit-form-id=' + $(this).data('edit-form-id') + ']';
            var validator = new Managers.Validation( self.editFormSelector, Rules.validation[$(this).data('validator')] );

            validator.bindInput(true).init();
            validator.validate(self._onValidationSuccessEdit, self);

        },

        _onValidationSuccessEdit: function( data, self ) {

            Helpers.Nprogress.start();
            self.secureFormRequest(self.editFormSelector, true);

            Services.Members.BankService.editBankAccount(data)
                .then(function (res) {

                    Helpers.Notify.success(_.trans('profile.edit_bank_detail_success_message'));

                    Services
                    .Members
                    .BankService
                    .getBankingList()
                    .then(function(response) {

                        self.bankingDetails = response;
                        self._renderBankList();

                    })
                    .catch(function(error) {

                        Helpers.Error.show(e);

                    });

                })
                .fail(function (e) {

                    Helpers.Error.show(e);

                })
                .finally(function () {

                    Helpers.Nprogress.done();
                    self.secureFormRequest(self.editFormSelector, false);

                })
            ;

        }, 

        _onBankAccountEditCancel: function( e ) {

            var self = e.data.context;

            // remove form
            $(this).closest(self.formEdit).remove();

        },

        _onRadioPreferredChange: function( e ) {

            var self = e.data.context;
            var id = $(this).data('account-id');
            var data = [];
            var regularAccounts = _.propertyValue(self.bankingDetails, 'regular.accounts') || [];
            var details = _.findWhere(regularAccounts, { bankAccountId: '' + id } ) || {};

            // flatten into array of objects
            _.each(details, function(value, key) {

                data.push({
                    name: key,
                    value: key === "isPreferred" ? true : value
                });

            });

            Helpers.Nprogress.start();
            $(self.bankingDetailsWrapper).addClass('disabled');
 
            Services.Members.BankService.editBankAccount(data).then(function (res) {

                // refresh banks
                self._refreshBankList(true, res);

            }).fail(function (e) {

                Helpers.Error.show(e);
                self._refreshBankList();

            }).finally(function(e) {

                Helpers.Nprogress.done();
                $(self.bankingDetailsWrapper).removeClass('disabled');      

            });

        },

        onConfirmMPayAccount: function(e) {

            var self = this.self;
            var data = this.data;
            var code = (_.findWhere(data, { name: 'phoneCode' }) || {}).value;
            var number = (_.findWhere(data, { name: 'phoneNumber' }) || {}).value;
            var accountNumber = code + number.substring(1);
            
            data.push({
                name: 'bankAccountNumber',
                value: accountNumber
            });
            
            data.push({
                name: 'bankAccountName',
                value: accountNumber
            });

            self.addBankAccount(data);

        }


    });

})(
    Q,
    Pt.Settings,
    Pt.Rules,
    Pt.Contracts,
    Pt.Helpers,
    Pt.Managers,
    Pt.Services,
    Pt.Widgets,
    _.clone(Pt.Controllers.AbstractProfileController)
);
/**
 * Private Message Factory
 * Created by isda on 09/08/2016.
 */


(function () {

    "use strict";


    var instances = {};


    _.Class('Pt.PrivateMessage.Factory', PrivateMessageFactory());

    /**
     * @namespace PrivateMessageFactory
     * @memberOf Pt.PrivateMessage
     * @returns {{ make: make }}
     * @constructor
     */
    function PrivateMessageFactory() {

        var privateMessageModules = {
            'messages': 'Messages',
            'compose': 'Compose',
            'message': 'Reply'
        };

        return {
            make: make
        };

        ////////////////////////////////

        function make(type) {

            var module = privateMessageModules[type];

            if (module) {

                if (!_.isEmpty(instances[module])) {

                    return instances[module];

                }

                var i = new Pt.PrivateMessage[module]();

                instances[module] = i;

                return i;

            }

        }

    }

})();
/**
 * Private Message Controller
 * Created by isda on 12/07/2016.
 */

/** @namespace this._anchorClickHandler */

(function ($,
           Q,
           PMFactory,
           absCtrl) {

    "use strict";

    _.Class('Pt.Controllers.BasePrivateMessageController', BasePrivateMessageController);

    /**
     * Profile Controller
     * @namespace Pt.Controllers.BasePrivateMessageController
     * @constructor
     */
    function BasePrivateMessageController() {

        this.el = '[data-js=profile-container]';
        this.elTabs = '[data-js=profile-tabs]';
        this.pmInstance = null;

    }


    BasePrivateMessageController.prototype = _.extend(absCtrl, {

        /**
         * Initialize Controller
         *
         */
        init: function (requestContext) {

            var self = this;
            var module = requestContext.params.module || 'messages';

            this.pmInstance = PMFactory.make(module);

            this.pmInstance.resolve({

                requestContext: requestContext

            }).then(function () {

                self.pmInstance.init(self.el);

            });

        }

    });

})(
    jQuery,
    Q,
    Pt.PrivateMessage.Factory,
    _.clone(Pt.Controllers.AbstractProfileController)
);
/**
 * Message Controller for PM
 * Created by isda on 09/08/2016.
 */

(function ($,
           $q,
           Helpers,
           Managers,
           Services,
           Router,
           absCtrl) {

    "use strict";

    _.Class('Pt.PrivateMessage.BaseMessages', BaseMessages);

    /**
     * @namespace BaseMessages
     * @memberOf Pt.PrivateMessage
     * @constructor
     */
    function BaseMessages() {

        this.dTableInstance = null;
        this.requestContext = null;
        this.container = null;

        this.tableEl = '[data-js=messages-table]';
        this.delBoxes = '[data-js=delBox]';
        this.selectAll = '[data-js=selectAll]';
        this.btnTrash = '[data-js=btn-trash]';
        this.btnRefresh = '[data-js=btn-refresh-message]';
        this.btnDeleteAll = '[data-js=btn-delete-all]';
        this.selfMessages = [];
        this.messages = [];

        this.actions = [
            [ this.btnTrash, 'click', 'onTrashButtonClick'],
            [ this.delBoxes, 'click', 'onDelBoxClick'],
            [ this.btnDeleteAll, 'click', 'onDeleteAll'],
            [ this.selectAll, 'click', 'onSelectAllClick'],
            [ this.btnRefresh, 'click', 'onRefreshClick'],
            [ '[data-js=go-to-message]', 'click', 'onMessageClick'],
            [ '[data-js=go-to-message]', 'click', 'setMessageAsRead'],
            [ '[data-js=btn-message-trash]', 'click', 'onTrashMessageClick'],
            [ '[data-js=btn-mark-important]', 'click', 'onMarkImportantClick'],
            [ '[data-js=navPrivateMessage]', 'click', 'onNavPrivateMessageClick']
        ];

    }


    BaseMessages.prototype = _.extend(absCtrl, {

        /**
         * Resolve Dependencies
         * @returns {*}
         */
        resolve: function (params) {

            this.requestContext = params.requestContext;

            var self = this;
            var defer = $q.defer();

            Services.Members.PrivateMessageService.getPrivateMessages( params ? params.force : false )
                .then(function (res) {

                    self.messages = res;
                    self.selfMessages = res;

                }).finally(function () {

                    defer.resolve(true);

                });

            return defer.promise;

        },

        init: function (container) {

            this.container = container;
            var view = Managers.Template.get('profile.messages', {
                messages: this.messages
            });

            this.render(container, view);

            if ( this.messages.length ) {

                this._initDataTable();

            }

            this._bindEvents();

        },

        onMessageClick: function (e) {

            var self = e.data.context;
            var el = $(this);
            var mId = el.data('messageId');

            self.setMessageAsRead(mId);

            Router.redirect('/profile/private-messages/message/' + mId);

        },

        setMessageAsRead: function (mId) {

            var self = this;
            var message = _.findWhere(self.messages, { messageId: mId});

            if (typeof message !== 'undefined') {

                if (message.status === '0') {

                    message.status = '1';
                    _.extend(_.findWhere(self.messages, { messageId: mId }), message);

                }

            }

        },

        onRefreshClick: function (e) {

            var self = e.data.context;

            Helpers.Nprogress.start();

            self.resolve({

                requestContext: self.requestContext,
                force: true

            }).then(function () {

                self.init(self.container);
                EventBroker.dispatch(EventBroker.events.privateMessage.refresh);

            }).finally(function () {

                Helpers.Nprogress.done();

            });

        },

        onDelBoxClick: function (e) {

            e.stopPropagation();

            var self = e.data.context;
            var el = $(this);
            var row = el.closest('tr');
            var mId = row.data('messageId');

            var selfMsgIndex = _.findIndex(self.selfMessages, {messageId:mId});

            if ($(self.delBoxes + ':checked').length) {

                $(self.btnTrash).removeClass('hide');

            } else {

                $(self.btnTrash).addClass('hide');

            }

            if(el.is(':checked')) {

                self.selfMessages[selfMsgIndex].check = true;

            } else {

                self.selfMessages[selfMsgIndex].check = false;

            }

            if ($(self.delBoxes + ':checked').length !== $(self.delBoxes).length) {

                $(self.selectAll).prop( "checked", false );

            }

        },

        onTrashButtonClick: function (e) {

            var self = e.data.context;
            var checkedBoxes = $(self.delBoxes + ':checked');

            if (checkedBoxes.length) {

                Helpers.Modal.confirm({
                    text: _.trans('profile.alert_delete_messages'),
                    confirmButton: _.trans('profile.button_proceed'),
                    cancelButton: _.trans('profile.button_cancel'),
                    confirm: function() {

                        var selfMsgIndex = null;

                        var promises = _.map(checkedBoxes.serializeArray(), function (item) {

                            selfMsgIndex = _.findIndex(self.selfMessages, {messageId: item.value});

                            if(selfMsgIndex > -1) {
                                self.selfMessages.splice(selfMsgIndex, 1);
                            }

                            return Services.Members.PrivateMessageService.deleteMessage(item.value);

                        });

                        Helpers.Nprogress.start();

                        $q.all(promises)
                            .then(function () {

                                self.onRefreshClick(e);

                            })
                            .finally(function () {

                                Helpers.Nprogress.done();

                            });

                    }
                });

            }
        },

        onDeleteAll: function (e) {

            var self = e.data.context;

            $(self.delBoxes).prop( "checked", true );

            Helpers.Modal.info('',  _.trans('profile.alert_clear_all_message'), function (cb) {

                var params = [];

                _.each(self.messages, function (message) {

                    params.push(message.messageId);

                });

                var allMesg = {

                    'messageIds' : params || []

                };

                Helpers.Nprogress.start();

                Services.Members.PrivateMessageService.bulkDelete(allMesg)
                    .then(function () {

                        self.onRefreshClick(e);

                    })
                    .finally(function () {

                        Helpers.Nprogress.done();

                    });

                }, {
                    showCancel: true,
                    confirmButton: _.trans('profile.button_proceed'),
                    cancelButton: _.trans('profile.button_cancel')
                }, function () {
                    $(self.delBoxes).prop( "checked", false );
                    $(self.selectAll).prop( "checked", false );
                    $(self.btnTrash).attr( "disabled", true );

                }
            );

        },

        onTrashMessageClick: function (e) {

            e.stopPropagation();
            var self = e.data.context;
            var row = $(this).closest('tr');
            var mId = row.data('messageId');

            Helpers.Modal.confirm({
                text: _.trans('profile.alert_delete_message'),
                confirmButton: _.trans('profile.button_proceed'),
                cancelButton: _.trans('profile.button_cancel'),
                confirm: function() {

                    Helpers.Nprogress.start();

                    Services.Members.PrivateMessageService.deleteMessage(mId)
                        .then(function () {

                            self.onRefreshClick(e);

                        })
                        .finally(function () {

                            Helpers.Nprogress.done();

                        });

                }
            });




        },

        onMarkImportantClick: function (e) {

            e.stopPropagation();

            var self = e.data.context;
            var el = $(this);
            var row = el.closest('tr');
            var mId = row.data('messageId');
            var flag = el.attr('data-flag') === 'false';

            var selfMsgIndex = _.findIndex(self.selfMessages, {messageId:mId});

            var classToggler = function (f) {

                if (f) {

                    el.attr('class', 'data-icon icon-star un-mark-important');

                    return;

                }

                el.attr('class', 'data-icon icon-star-o mark-important');

            };

            classToggler(flag);

            Services.Members.PrivateMessageService.markAsImportant(mId, flag)
                .then(function () {

                    el.attr('data-flag', flag);

                    if(selfMsgIndex > -1) {
                        self.selfMessages[selfMsgIndex].flagImportant = flag;
                    }

                })
                .fail(function () {

                    //Back to Original
                    classToggler(el.data('flag'));

                });

        },

        _refreshDataTableDom: function () {

            var el = null,
                btnMarkImportant = null,
                check = null;

            this.selfMessages.forEach(function(msg){

                el = $('[data-message-id="' + msg.messageId + '"]');

                if(el) {

                    btnMarkImportant = el.find('[data-js=btn-mark-important]');

                    btnMarkImportant.attr('data-flag', msg.getFlagImportant());

                    var starClass = msg.getFlagImportant()? 'data-icon icon-star un-mark-important' : 'data-icon icon-star-o mark-important';
                    btnMarkImportant.attr('class', starClass);

                }

                if(msg.check) {

                    check = el.find('[data-js=delBox]');
                    check.prop( "checked", true );
                }

            });
        },

        _initDataTable: function () {

            var self = this;

            this.dTableInstance = Helpers.DataTable.render(this.tableEl, {

                columnDefs: [{
                    orderable: false,
                    aTargets: [0, 1]
                }],
                order: []

            });

            this.dTableInstance.on('datatable.sort', function(){

                self._refreshDataTableDom();
            });

            this.dTableInstance.on('datatable.page', function(){

                self._refreshDataTableDom();

            });

            return this;

        },

        onNavPrivateMessageClick: function (e) {

            var self = e.data.context;
            var defer = $q.defer();

            Helpers.Nprogress.start();

            Services.Members.PrivateMessageService.getPrivateMessages(true)
                .then(function (res) {

                    self.messages = res;
                    self.init(self.container);

                }).finally(function () {

                defer.resolve(true);
                Helpers.Nprogress.done();

            });

        },

        onSelectAllClick: function (e) {

            e.stopPropagation();

            var self = e.data.context;

            if ($(self.selectAll + ':checked').length) {

                $(self.btnTrash).removeClass('hide');
                $(self.delBoxes).prop( "checked", true );
                $(self.btnTrash).attr( "disabled", false );

            } else {

                $(self.btnTrash).addClass('hide');
                $(self.delBoxes).prop( "checked", false );
                $(self.btnTrash).attr( "disabled", true );

            }

        }

    });

})(
    jQuery,
    Q,
    Pt.Helpers,
    Pt.Managers,
    Pt.Services,
    Pt.Core.Router,
    _.clone(Pt.Controllers.AbstractProfileController)
);
/**
 * Reply Controller For PM
 * Created by isda on 09/08/2016.
 */

(function ($,
           Q,
           Settings,
           Contracts,
           Helpers,
           Managers,
           Services,
           absCtrl) {

    "use strict";

    _.Class('Pt.PrivateMessage.BaseReply', BaseReply);

    /**
     * @namespace BaseReply
     * @memberOf Pt.PrivateMessage
     * @constructor
     */
    function BaseReply() {

        this.messageId = null;
        this.message = null;
        this.replies = null;

        this.repliesContainer = '[data-js=replies-container]';
        this.form = '[data-js="reply-form"]';

        this.actions = [
            [this.form, 'submit', 'onFormSubmit']
        ];

    }


    BaseReply.prototype = _.extend(absCtrl, {

        /**
         * Resolve Dependencies
         * @returns {*}
         */
        resolve: function (params) {

            var self = this;
            var defer = Q.defer();
            var mid = params.requestContext.params.messageId;

            Services.Members.PrivateMessageService.getMessage(mid)
                .then(function (res) {

                    /**
                     * replace 'Admin' sender if applicable
                     */
                    res = self.formatAdminSender(res);

                    self.messageId = mid;
                    self.message = res;
                    self.replies = res.replies;

                    EventBroker.dispatch(EventBroker.events.privateMessage.read, { 
                        messageId: mid,
                        message: res,
                        replies: res.replies
                    });

                })
                .finally(function () {

                    defer.resolve(true);

                });

            return defer.promise;

        },

        init: function (container) {

            var view = Managers.Template.get('profile.message', _.extend({
                messageId: this.messageId
            }, this.message, this.replies));

            this.render(container, view)
                ._bindEvents();

        },

        onFormSubmit: function (e) {

            e.preventDefault();

            var self = e.data.context;
            var input = $('textarea[name="text"]');

            var inputValue = input.val() ? input.val().trim() : '';
            if (_.isEmpty(inputValue)) {

                Helpers.Notify.error(_.trans('errors.message_required'));

                return this;

            }

            var formData = $(self.form).serializeArray();

            self.secureFormRequest(self.form, true);

            Helpers.Nprogress.start();

            Services.Members.PrivateMessageService.sendMessage(self.messageId, formData)
                .then(function () {

                    var reply = _.extend(new Contracts.PrivateMessage, {

                        Sender: Settings.member.code,
                        SenderDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                        messageText: _.findWhere(formData, { name: "text" }).value
                    });

                    var view = Managers.Template.get('profile.replies', {
                        replies: [reply]
                    });

                    $(self.repliesContainer).append(view);

                    input.val("");

                }, function (err) {

                    Helpers.Notify.error(err);

                }).finally(function () {

                Helpers.Nprogress.done();
                self.secureFormRequest(self.form, false);


            });

        },

        /**
         * Format 'Admin' sender
         *
         * @param {Object} message
         * @param {String} admin
         * @returns {Object}
         */
        formatAdminSender: function(message, admin) {

            if (admin === undefined) {
                admin = _.trans('profile.pmessage_admin');
            }

            if (admin === 'profile.pmessage_admin') {
                return message;
            }

            if (message.Sender !== undefined && message.Sender === 'Admin') {
                message.Sender = admin;
            }

            if (message.replies !== undefined && _.isArray(message.replies)) {
                var self = this
                    , i, reply;
                for (i = 0; i < message.replies.length; i++) {
                    reply = message.replies[i];
                    message.replies[i] = self.formatAdminSender(reply, admin);
                }
            }

            return message;
        }

    });

})(
    jQuery,
    Q,
    Pt.Settings,
    Pt.Contracts,
    Pt.Helpers,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractProfileController)
);
/**
 * Compose Message Controller
 * Created by isda on 09/08/2016.
 */

(function ($,
           Q,
           Helpers,
           Managers,
           Services,
           Router,
           Settings,
           Endpoints,
           absCtrl) {

    "use strict";

    _.Class('Pt.PrivateMessage.BaseCompose', BaseCompose);

    /**
     * @namespace BaseCompose
     * @memberOf Pt.PrivateMessage
     * @constructor
     */
    function BaseCompose() {

        this.subjects = [];
        this.form = '[data-js=compose-form]';

        this.actions = [
            [ this.form, 'submit', 'onFormSubmit']
        ];

    }


    BaseCompose.prototype = _.extend(absCtrl, {

        /**
         * Resolve Dependencies
         * @returns {*}
         */
        resolve: function () {

            var self = this;
            var defer = Q.defer();

            Services.Members.PrivateMessageService.getSubjects()
                .then(function (res) {

                    self.subjects = res;

                })
                .finally(function () {

                    defer.resolve(true);

                });

            return defer.promise;

        },

        init: function (container) {

            var view = Managers.Template.get('profile.compose', {
                subjects: this.subjects
            });

            this.render(container, view)
                ._bindEvents();

        },

        onFormSubmit: function (e) {

            e.preventDefault();

            var self = e.data.context;
            var input = $('textarea[name="text"]');
            var inputValue = input.val() ? input.val().trim() : '';
            if (_.isEmpty(inputValue)) {

                Helpers.Notify.error(_.trans('errors.message_required'));

                return this;

            }

            var formData = $(self.form).serializeArray();

            self.secureFormRequest(self.form, true);

            Helpers.Nprogress.start();

            Services.Members.PrivateMessageService.sendMessage('', formData)
                .then(function () {

                    var url = _.addRouteParamsToUri({
                        memberCode: Settings.member.code
                    }, Endpoints.urls.api.member.privateMessages);

                    Managers.HttpClient.get(url)
                        .then(function (res) {

                            if ( res.message ) {

                                if ( res.message.toLowerCase() === 'ok' && _.isEmpty(res.data.private_messages) ) {

                                    Helpers.Notify.success(_.trans('profile.private_message_success_message'), 8);

                                    setTimeout(function() {

                                        Router.navigate('/profile/private-messages');

                                    }, 8000);

                                } else {

                                    Helpers.Notify.success(_.trans('profile.new_pm_success_message'));

                                    Router.navigate('/profile/private-messages');

                                }

                            }

                        });

                }, function (err) {

                    Helpers.Notify.error(err);

                }).finally(function () {

                    Helpers.Nprogress.done();
                    self.secureFormRequest(self.form, false);

                });

        }

    });

})(
    jQuery,
    Q,
    Pt.Helpers,
    Pt.Managers,
    Pt.Services,
    Pt.Core.Router,
    Pt.Settings,
    Pt.Endpoints,
    _.clone(Pt.Controllers.AbstractProfileController)
);

(function (
    Settings,
    Rules,
    Contracts,
    Helpers,
    Widgets,
    Managers,
    Services,
    absCtrl
) {

    "use strict";

    _.Class('Pt.Controllers.VerifyAccountController', VerifyAccountController);

    /**
     * @namespace Pt.Controllers.VerifyAccountController
     * @constructor
     */
    function VerifyAccountController() {

        this.el = '[data-js=profile-container]';
        this.form = '[data-js=send-verify-code-form]';
        this.resendButton = '[data-js=resend]';
        this.timerCloseBtn = '[data-js=timer-close]';
        this.validator = null;
        this.inProgress = false;
        this.safetyRating = null;
        this.type = null;
        this.member = null;
        this.interval  = null;
        this.actions = [
            [this.form, 'submit', '_onFormSubmit'],
            [this.resendButton, 'click', '_onClickResendButton'],
            [this.timerCloseBtn, 'click', '_onTimerClose']
        ];


    }

    VerifyAccountController.prototype = _.extend(absCtrl, {

        resolve: function (next) {

            var self = this;

            Services.Members.MemberService.getMember(true)
                .then(function (res) {

                    self.member = res;

                    self._getSafetyRating();

                })

                .fail(function () {

                    self.member = new Contracts.Member();

                })

                .finally(function () {

                    next();

                });

        },

        init: function () {

            var path = window.location.pathname;


            if ( path.indexOf('sms') !== -1 ) {

                this.type = 'sms';

            }

            if ( path.indexOf('email') !== -1 ) {
                
                this.type = 'email';

            }

            var view = Managers.Template.get('profile.sendVerificationCode', {
                member: this.member,
                type : this.type
            });
            
            
            this.render(this.el, view)
                ._bindEvents();
            
                this.validator = new Managers.Validation(this.form, Rules.validation.verification);
                this.validator
                    .bindInput(true)
                    .init();

        },

        _getSafetyRating : function () {

            var self = this;

            Services
                .Members
                .VerificationService
                .safetyRating()
                .then(function(response) {
                    
                    self.safetyRating = response;

                }).fail(function(error) {

                    Helpers.Error.show(error);

                });
        },

        _onFormSubmit : function (e) {
            e.preventDefault();

            var self = e.data.context;

            self.validator.validate(self._onValidationSuccess, self);

        },

        _onValidationSuccess: function (data) {

            var self = this,
                service = self.type === 'sms' ? Services.Members.VerificationService.sendSmsCode(data) :
                Services.Members.VerificationService.sendEmailCode(data);

            Helpers.Nprogress.start();

            service.then(function(response) {

                var message = _.trans('accountverification.validation_success_' + self.type),
                    amount = self.type === 'sms' ? self.safetyRating.phoneVerifiedAmount
                        : self.safetyRating.emailVerifiedAmount;

                Managers.Cookie.remove({ name : 'verifyemail2' });

                Managers.Cookie.remove({ name : 'verifysms2' });

                var view = Managers.Template.get('widgets.verficationSuccess',
                        { 
                            message : _.str_replace_key({
                                ':mobile' : self.member.mobile,
                                ':email' : self.member.email,
                                ':amount' : amount,
                                ':currency' : Settings.member.currency
                            }, message)
                        });
                
                Helpers.Modal.generic(view, {});

                Helpers.Nprogress.done();
            

                    
            }).fail(function(error) {

                Helpers.Error.show(error);

            }).finally(function() {

                Helpers.Nprogress.done();

            });

            
        },

        _onClickResendButton : function (e) {

            var self = e.data.context,
                type = self.type,
                firstTry = Managers.Cookie.get('verify' + type),
                secondTry = Managers.Cookie.get('verify' + type + '2' + btoa(Settings.member.code)),
                userCookie = secondTry ? atob(secondTry) : undefined;

            if ( userCookie === Settings.member.code ) {

                var view = Managers.Template.get('widgets.verficationSent',
                        { 
                            message : _.trans('accountverification.max_tries_' + type),
                            type : self.type,
                            isClose : true                
                        });

                Helpers.Modal.generic(view, {});

                return;
            }
                
            if ( firstTry )  {

                var view = Managers.Template.get('widgets.timer',
                        { 
                            message : _.trans('accountverification.message_timer'),
                            type : self.type,
                            isClose : true                
                        });
                    
                Helpers.Modal.generic(view, {});
                

               self.interval = setInterval(function() {

                    self._setCountDownTimer();
                    
                }, 1000);

            } else {

                self._resendVerificationCode();

            }
           
        },

        _resendVerificationCode: function () {

            var self = this,
                service = self.type === 'email' ? Services.Members.VerificationService.verifyEmail() : 
                    Services.Members.VerificationService.verifySms();
        
            Helpers.Nprogress.start();

            service
                .then(function(response) {

                    Managers.Cookie.set({ name : 'verify'+ self.type + '2' + btoa(Settings.member.code), value: btoa(Settings.member.code) });

                    var view = Managers.Template.get('widgets.verficationSent',
                        { 
                            message : _.trans('accountverification.verification_2nd_' + self.type),
                            type : self.type,
                            isClose : true                
                        });

                    Helpers.Modal.generic(view, {});

                    Helpers.Nprogress.done();

                }).fail(function(error) {

                    Helpers.Error.show(error);

                }).finally(function (){

                    Helpers.Nprogress.done();

                });
            
    
        },


        _setCountDownTimer : function () {

            var self = this,
                type = self.type;

                var endRaw = Managers.Cookie.get('verify' + type + 'expiration' );
                var end = new Date(endRaw).getTime(),
                    now = new Date().getTime(),
                    diff = end - now;

                if ( _.isNaN(diff) ) {

                    clearInterval(self.interval);

                    $('[data-dismiss=modal]').click();

                    return;
                }

                var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds = Math.floor((diff % (1000 * 60)) / 1000); 
                
                $(document).find('#mins').text(minutes);
                $(document).find('#secs').text(seconds);


        },

        _onTimerClose : function (e) {

            var self = e.data.context;

            clearInterval(self.interval);

        }
    



    },Pt.Core.Extend('Controllers.VerifyAccountController'));

})(
    Pt.Settings,
    Pt.Rules,
    Pt.Contracts,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractProfileController)
);


/**

 * Profile Controller

 * Created by isda on 15/12/2016.

 */



(function (_baseMemberController) {



    _.Class('Pt.Controllers.MemberController', MemberController);



    /**

     * Home Controller

     * @namespace Pt.Controllers.MemberController

     * @constructor

     */

    function MemberController() {



        function Class() {



            _baseMemberController.call(this);



        }



        Class.prototype = Object.create(_baseMemberController.prototype);

        Class.prototype.constructor = Class;



        _.extend(Class.prototype, {



        }, Pt.Core.Extend('Controllers.MemberController'));



        return new Class();



    }



})(

    Pt.Controllers.BaseMemberController

);



/**

 * Created by isda on 12/07/2016.

 */



(function (

    _baseDeliveryAddressController

) {



    _.Class('Pt.Controllers.DeliveryAddressController', DeliveryAddressController);



    /**

     * Profile Controller

     * @namespace Pt.Controllers.DeliveryAddressController

     * @constructor

     */

    function DeliveryAddressController () {



        function Class () {



            _baseDeliveryAddressController.call(this);



        }



        Class.prototype = Object.create(_baseDeliveryAddressController.prototype);

        Class.prototype.constructor = Class;



        _.extend( Class.prototype, {



        }, Pt.Core.Extend('Controllers.DeliveryAddressController'));



        return new Class();





    }



})(

    Pt.Controllers.BaseDeliveryAddressController

);



/**

 * Created by isda on 12/07/2016.

 */



(function (

    _basePasswordController

) {



    _.Class('Pt.Controllers.PasswordController', PasswordController);



    /**

     * Profile Controller

     * @namespace Pt.Controllers.PasswordController

     * @constructor

     */

    function PasswordController () {



        function Class () {



            _basePasswordController.call(this);



        }



        Class.prototype = Object.create(_basePasswordController.prototype);

        Class.prototype.constructor = Class;



        _.extend( Class.prototype, {



        }, Pt.Core.Extend('Controllers.PasswordController'));



        return new Class();





    }



})(

    Pt.Controllers.BasePasswordController

);



/**

 * Created by isda on 12/07/2016.

 */



(function (

    _baseBankDetailsController

) {



    _.Class('Pt.Controllers.BankDetailsController', BankDetailsController);



    /**

     * Profile Controller

     * @namespace Pt.Controllers.BankDetailsController

     * @constructor

     */

    function BankDetailsController () {



        function Class () {



            _baseBankDetailsController.call(this);



        }



        Class.prototype = Object.create(_baseBankDetailsController.prototype);

        Class.prototype.constructor = Class;



        _.extend( Class.prototype, {



        }, Pt.Core.Extend('Controllers.BankDetailsController'));



        return new Class();





    }



})(

    Pt.Controllers.BaseBankingDetails

);





/**

 * Created by isda on 12/07/2016.

 */



(function (

    _basePrivateMessageController

) {



    _.Class('Pt.Controllers.PrivateMessageController', PrivateMessageController);



    /**

     * Profile Controller

     * @namespace Pt.Controllers.PrivateMessageController

     * @constructor

     */

    function PrivateMessageController () {



        function Class () {



            _basePrivateMessageController.call(this);



        }



        Class.prototype = Object.create(_basePrivateMessageController.prototype);

        Class.prototype.constructor = Class;



        _.extend( Class.prototype, {



        }, Pt.Core.Extend('Controllers.PrivateMessageController'));



        return new Class();













    }



})(

    Pt.Controllers.BasePrivateMessageController

);

/** @namespace Pt.PrivateMessage */

/**

 * Created by isda on 11/08/2016.

 */



(function (

    _baseMessages

) {



    _.Class('Pt.PrivateMessage.Messages', Messages);



    /**

     * Private Messages

     * @namespace Pt.PrivateMessage.Messages

     * @constructor

     */

    function Messages ()

    {



        function Class () {



            _baseMessages.call(this);

        }



        Class.prototype = Object.create(_baseMessages.prototype);

        Class.prototype.constructor = Class;



        _.extend( Class.prototype, {



        }, Pt.Core.Extend('PrivateMessage.Messages'));



        return new Class();













    }



})(

    Pt.PrivateMessage.BaseMessages

);

/** @namespace Pt.PrivateMessage */

/**

 * Created by isda on 11/08/2016.

 */



(function (

    _baseReply

) {



    _.Class('Pt.PrivateMessage.Reply', Reply);



    /**

     * Private Messages

     * @namespace Pt.PrivateMessage.Reply

     * @constructor

     */

    function Reply () {



        function Class () {



            _baseReply.call(this);



        }



        Class.prototype = Object.create(_baseReply.prototype);

        Class.prototype.constructor = Class;



        _.extend( Class.prototype, {



        }, Pt.Core.Extend('PrivateMessage.Reply'));



        return new Class();













    }



})(

    Pt.PrivateMessage.BaseReply

);

/** @namespace Pt.PrivateMessage */

/**

 * Created by isda on 11/08/2016.

 */



(function (

    _baseCompose

) {



    _.Class('Pt.PrivateMessage.Compose', Compose);



    /**

     * Private Compose

     * @namespace Pt.PrivateMessage.Compose

     * @constructor

     */

    function Compose () {



        function Class () {



            _baseCompose.call(this);



        }



        Class.prototype = Object.create(_baseCompose.prototype);

        Class.prototype.constructor = Class;



        _.extend( Class.prototype, {



        }, Pt.Core.Extend('PrivateMessage.Compose'));



        return new Class();



    }



})(

    Pt.PrivateMessage.BaseCompose

);



/********************************
 * FUND MANAGEMENT CONTROLLER
 ********************************/

/**
 * Abstract Profile Controller
 * Created by isda on 12/07/2016.
 */


(function ( $,
            $q,
            _,
            Helpers,
            Managers,
            Services,
            $absController
) {

    "use strict";


    /**
     * @namespace Pt.Controllers.AbstractFundsController
     */
    var AbstractFundsController = _.extend($absController, {

        resolve: function (next) {

            var self = this;

            Services.Members.WalletService.getAll()
                .then(function (res) {

                    self.wallets = res;

                })
                .fail(function () {

                    self.wallets = [];

                })
                .finally(function () {

                    next();

                });

        },

        loadDefaultValues: function() {

            Services.Members.MemberService.getMember().then(function(memberInfo){

                $('[data-constant=fullName]').val(memberInfo.getFullName()).attr('readonly',true);

            });


        }

    });

    _.Class('Pt.Controllers.AbstractFundsController', AbstractFundsController);

})(
    jQuery,
    Q,
    _,
    Pt.Helpers,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Created by bryan on 3/9/18.
 */

(function (
    $absController
) {

    "use strict";

    var AbstractDepositController = _.extend($absController, {

        addCsfValidations: function (self, processType) {

            var csfValidations = {};

            if (self.depositMethod.hasFormFields()) {

                Pt.Rules.validation.deposit['old_' + processType] = _.clone(Pt.Rules.validation.deposit[processType]);

                _.each(self.depositMethod.formFields, function (field) {

                    csfValidations[field.fieldName] = {};

                    var ruleDefinition;

                    if (!_.isEmpty(field.validationRules)) {

                        _.each(field.validationRules, function (rule) {

                            ruleDefinition = rule.split(':');

                            if (_.size(ruleDefinition) === 1) {

                                csfValidations[field.fieldName][rule] = {
                                    message: "^" + _.trans('errors.csf_basic_' + rule)
                                };

                                return;

                            }

                            try {

                                //let the validation provider build the rules
                                var validationName = ruleDefinition[0];

                                if (_.isFunction(Pt.Rules.provider[validationName])) {

                                    var args = ruleDefinition.splice(1);
                                    args.push(field.fieldName);
                                    csfValidations[field.fieldName][validationName] = Pt.Rules.provider[validationName](args);

                                }

                            } catch (e) {}

                        });


                    } else {

                        if (Pt.Rules.validation.deposit['old_' + processType]) {

                            Pt.Rules.validation.deposit[processType] = _.clone(Pt.Rules.validation.deposit['old_' + processType]);

                        }

                    }

                });

                _.extend(Pt.Rules.validation.deposit[processType], csfValidations);
                self.validator.setRules(Pt.Rules.validation.deposit[processType]);


            } else {

                if (Pt.Rules.validation.deposit['old_' + processType]) {

                    Pt.Rules.validation.deposit[processType] = _.clone(Pt.Rules.validation.deposit['old_' + processType]);
                    self.validator.setRules(Pt.Rules.validation.deposit[processType]);

                }

            }

        },

        _getCsfValues: function (self) {

            var params = {};

            _.each($(self.form).serializeArray(), function (field) {

                if (field.name.indexOf('csf') === 0) {

                    params[field.name] = field.value;

                }

            });

            return params;

        }

    });

    _.Class('Pt.Controllers.AbstractDepositController', AbstractDepositController);

})(
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Fund Transfer Controller
 * Created by isda on 13/12/2016.
 */


(function (
    Rules,
    Contracts,
    Helpers,
    Widgets,
    Managers,
    Services,
    absFundTransfer,
    absCtrl
) {

    "use strict";

    _.Class('Pt.Controllers.BaseFundTransferController', BaseFundTransferController);

    /**
     * @namespace Pt.Controllers.BaseFundTransferController
     * @constructor
     */
    function BaseFundTransferController() {

        this.container = '[data-js=funds-container]';
        this.balance = Widgets.Balance.mainBalance();
        this.validator = null;
        this.transferAmount = '[data-js="transferAmount"]';
        this.actions =  _.union(this.actions, [
            [ '[data-js=amount_selector]', 'click', '_updateAmount' ],
            [ '[data-js=transferAmount]', 'keydown', '_onAmountKeyDown' ],
            [ '[data-js=transferAmount]', 'input', '_onBaseAmountChange' ]
        ]);


    }

    BaseFundTransferController.prototype = _.extend(absFundTransfer, absCtrl, {

        init: function () {

            Widgets.Announcements.activateCashier('fund_transfer');

            this.balance
                .setWallets(this.wallets)
                .clearWalletIndicator()
                .activate();

            var view  = Managers.Template.get('funds.transfer', {
                wallets: this.wallets,
                info: this.info
            });

            this.render(this.container, view);

            this._initialize_fund_transfer_tips();

            Widgets.BonusCode.activate('[data-js=bonus-code-container]', '[data-js=bonus-code-field]');

            this.validator = new Managers.Validation(this.form, Rules.validation.fundTransfer);

            this.validator
                .bindInput(true)
                .init();

            this._bindEvents();

        },

        _updateAmount: function (e) {

            e.preventDefault();
            e.stopPropagation();
            var _self = e.data.context;
            $(_self.container + ' ' + _self.transferAmount).val($(this).attr('data-value')).trigger('change');

        },

        _onAmountKeyDown: function(e) {

            var self = e.data.context;

            if (e.keyCode === 13) {

                e.preventDefault();

                $(self.form).submit();

            }

            // Allow: backspace, delete, tab, escape, enter and .
            if ( $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                // Allow: Ctrl/cmd+A
                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: Ctrl/cmd+C
                (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: Ctrl/cmd+X
                (e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }

        },

        _initialize_fund_transfer_tips: function () {

            Services.Cms.WidgetService.get('fund_transfer_tooltip').then(function (data) {
                
                var fundTransferTipEl = $('[data-js="fund_transfer_tip"]');
                var _tips = '';

                if (data.tips) {

                    _tips =  Managers.Template.get('funds.fundTransferTips', {
                        fund_transfer_tips: data.tips
                    });

                }

                fundTransferTipEl.attr('title', _tips).tooltip({

                    html: true, placement: 'left'

                });

                if ( ! data.tips ) {

                    fundTransferTipEl.hide();

                }

            });

        },
        
        _onBaseAmountChange: function(e) {

            var self = e.data.context;

            if(_.isIe()) {

                $(this).val($(this).val().replace(/>|,|\s|[A-Za-z]/gi, ''));

            }

            if ( _.exceedsDecimal($(this).val(), 2) ) {

                $(this).val(self.lastAmount);

            } else {

                if ( ! _.isEmpty($(this).val()) ) {

                    self.lastAmount = $(this).val();

                }

            }

        }

    });

})(
    Pt.Rules,
    Pt.Contracts,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    new Pt.Controllers.AbstractFundTransfer,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Created by rowen on 12/04/2017.
 */

(function (
    $,
    $q,
    FundSettings,
    Managers,
    Widgets,
    Services,
    Helpers,
    DepositGatewayFactory,
    WidgetService,
    Router,
    AbstractController
) {

    'use strict';

    _.Class('Pt.Controllers.BaseDepositController', BaseDepositController);

    /**
     * @namespace BaseDepositController
     * @memberOf Pt.Controllers
     * @constructor
     */
    function BaseDepositController() {

        this.container = '[data-js=funds-container]';
        this.tabContainer = '[data-js=deposit-tab-container]';

        this.actions = [
            [ '[data-js=deposit-method-tab]', 'click', '_redirect' ],
            [ '[data-js=amount]', 'input', '_onBaseAmountChange' ],
            [ '[data-js=depositAmount]', 'input', '_onBaseAmountChange' ],
            [ '[data-js=depositAmount]', 'keydown', '_onBaseAmountKeyDown' ],
            [ '[data-js=amount]', 'keydown', '_onBaseAmountKeyDown' ]
        ];

        this.subscription = [];
        this.balanceWidget = Widgets.Balance.mainBalance();
        this.depositMethods = [];
        this.wallets = [];

        this.amountSelection = ["50", "100", "300", "500", "1000"];

    }

    BaseDepositController.prototype = _.extend(AbstractController, {

        resolve: function (next) {

            var self = this;

            var requests = [
                Services.Members.WalletService.getAll(),
                Services.Members.DepositService.getMethods(),
                Services.Members.BankService.getBankingList(),
                Services.Cms.DepositInstructionService.init(),
                Services.Cms.DepositBannerService.init()
            ];

            if ( ! $(self.tabContainer).length ) {

                Helpers.Preloader.basic(self.container);

            }

            $q.all(requests)
                .then(function(data) {

                    self.wallets = data[0];
                    self.depositMethods = data[1];
                    self.bankingDetails = data[2];

                })
                .finally(function() {

                    next();

                });

        },

        init: function (context) {

            var self = this;

            Widgets.Announcements.activateCashier('deposit');

            this.balanceWidget
                .setWallets(this.wallets)
                .clearWalletIndicator()
                .activate();

            if (! this.depositMethods.length) {

                var depositView = Managers.Template.get('funds.deposit', {
                    noActiveMethods: true
                });

                self.render(self.container, depositView);

                return;

            }

            var methodId = + context.params.type;
            var currentMethod = _.find(this.depositMethods, { id: methodId });

            if (! currentMethod) {

                currentMethod = this.depositMethods[0];

            }

            var gateway = DepositGatewayFactory.makeByMethod(currentMethod);

            gateway.bankingDetails = self.bankingDetails;

            gateway.resolve().then(function(data) {

                var formTemplate = Managers.Template.get(gateway.view, _.extend(data, {
                    bankingDetails: self.bankingDetails,
                    depositMethod: currentMethod
                }));

                var instructionTemplate = Services.Cms.DepositInstructionService.getByMethodCode(
                    currentMethod.get('methodCode')
                );

                var noticeTemplate = Services.Cms.DepositInstructionService.getNotice(
                    currentMethod.get('methodCode')
                );

                var banner = Services.Cms.DepositBannerService.getBanner(
                    currentMethod.get('methodCode')
                );

                instructionTemplate = Managers.Template.compile( _.unescape(instructionTemplate), { depositMethod: currentMethod });

                var methodFundSetting = _.filter(
                    _.propertyValue(FundSettings, 'pending_accounts.methods'),
                    function(method){

                        return method.type === 'deposit' &&
                            method.code === currentMethod.get('methodCode') &&
                            method.allowed === 'false';

                    }
                );

                //activate when active accounts only
                if (methodFundSetting.length > 0)
                {
                    var activeBankingDetails = _.filter(_.propertyValue(self.bankingDetails, 'regular.accounts',[]), function(bank) {

                        return bank.state.toLowerCase() === 'active';

                    });

                    if(activeBankingDetails.length === 0)
                    {
                        instructionTemplate = '';

                        formTemplate = Managers.Template.get('funds.offlineDepositNoActiveBankingDetails');

                    }else
                    {
                        if(_.propertyValue(self.bankingDetails,'regular.accounts'))
                        {
                            self.bankingDetails.regular.accounts = activeBankingDetails;
                        }

                        formTemplate = Managers.Template.get(gateway.view, _.extend(data, {
                            bankingDetails: activeBankingDetails,
                            depositMethod: currentMethod
                        }));
                    }

                }

                var view = Managers.Template.get('funds.deposit', {
                    noActiveMethods: false,
                    activeDepositMethods: self.depositMethods,
                    depositMethod: currentMethod,
                    depositForm: formTemplate,
                    instructionTemplate: instructionTemplate,
                    noticeTemplate: noticeTemplate,
                    banner: banner
                });

                self.render(self.container, view, function() {

                    gateway.onRenderComplete();

                });

            });

            this._bindEvents();

        },

        _redirect: function(evt) {

            evt.preventDefault();

            var self = evt.data.context;

            var href =  $(this).attr('href');

            if (href === location.pathname) {

                return this;

            }

            Helpers.Preloader.basic(self.tabContainer);

            _.delay(function () {

                Router.navigate(href);

            }, 400);

        },

        _onBaseAmountChange: function(e) {

            var self = e.data.context;

            if(_.isIe()) {

                $(this).val($(this).val().replace(/>|,|\s|[A-Za-z]/gi, ''));

            }

            if ( _.exceedsDecimal($(this).val(), 2) ) {

                $(this).val(self.lastAmount);

            } else {

                if ( ! _.isEmpty($(this).val()) ) {

                    self.lastAmount = $(this).val();

                }

            }

        },

        _onBaseAmountKeyDown: function(e){

            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                // Allow: Ctrl/cmd+A
                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: Ctrl/cmd+C
                (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: Ctrl/cmd+X
                (e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }

        }

    });

})(
    jQuery,
    Q,
    Pt.Settings.funds,
    Pt.Managers,
    Pt.Widgets,
    Pt.Services,
    Pt.Helpers,
    Pt.Deposit.DepositGatewayFactory,
    Pt.Services.Cms.WidgetService,
    Pt.Core.Router,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Created by rowen on 19/04/2017.
 */

(function(
    $,
    $q,
    DepositLauncherService,
    AbstractDepositController
) {

    /**
     * BaseBasicDeposit
     * @namespace BaseBasicDeposit
     * @memberOf Pt.Deposit
     * @constructor
     */
    _.Class('Pt.Deposit.BaseBasicDeposit', BaseBasicDeposit);

    function BaseBasicDeposit() {

        this.view = 'funds.basicDeposit';
        this.form = 'form[name=basic_deposit]';
        this.depositAmount = '[data-js="depositAmount"]';
        this.actions = [
            [
                this.form, 'submit', '_onFormSubmit'
            ],
            [
                '[data-js=amount_selector]', 'click', '_updateAmount'
            ],

            [
                '[data-js=amount]', 'input', '_onAmountChange'
            ],
            [
                '[data-js=depositAmount]', 'input', '_onAmountChange'
            ]

        ];

        this.depositMethod = {};
        this.old_rules = {};
        this.actualAmount = 0;
        this.settings = {};
        this.validator = null;

    }

    BaseBasicDeposit.prototype = _.extend(AbstractDepositController, {

        resolve: function() {

            var defer = $q.defer();

            defer.resolve({});

            return defer.promise;

        },

        init: function(depositSettings, validator) {

            this.settings.depositSettings = depositSettings;
            this.depositMethod = depositSettings;
            this.validator = validator;
            this.addCsfValidations(this, 'basic');

        },

        /***************************************************
         * EVENT HANDLERS
         ***************************************************/

        _onFormSubmit: function(e) {

            var self = e.data.context;

            e.preventDefault();

            self.validator.validate(self._onValidationSuccess, self, false);

        },

        _onValidationSuccess: function(data) {

            var self = this;
            var method = self.settings.depositSettings;
            var params = {
                methodId: method.get('id'),
                amount: self.actualAmount,
                launcherUrl: method.get('launcherUrl'),
                title: _.trans('funds.payment_' + method.get('id'))
            };

            if ( self.depositMethod.hasFormFields() ) {

                _.extend( params, { custom: self._getCsfValues(self) } );

            }

            DepositLauncherService.launch(params);

            $(self.form)[0].reset();
            self._resetProcessingFee();

        },

        onRenderComplete: function() {

            this.validator
                .bindInput(true)
                .shouldSerialize(false)
                .init();

            this._bindEvents();

        },
        _updateAmount: function (e) {

            e.preventDefault();
            e.stopPropagation();
            var _self = e.data.context;

            _self.actualAmount = $(this).attr('data-value');
            $(_self.form + ' ' + _self.depositAmount).val($(this).attr('data-value')).trigger('change').trigger('input');


        },
        _onAmountChange: function(e) {

            var amount = $(this).val();
            var self = e.data.context;
            
            if ( self.depositMethod.hasProcessingFee() && !isNaN(amount)) {

                self.updateProcessingFee(amount);

            }else if (self.depositMethod.getCustomFieldsByKey('custom_rounded_amount') && !isNaN(amount)) {

                self.updateRoundedFee(amount);

            }else if (self.depositMethod.getCustomFieldsByKey('non-zero_amount_range') && !isNaN(amount)) {

                self.updateToNonZeroAmount(amount);

            }else if (self.depositMethod.getCustomFieldsByKey('no-decimal_amount') && !isNaN(amount)) {

                self.updateToNoDecimalAmount(amount);

            }else if (self.depositMethod.isConvertibleToNearestHundreds() && !isNaN(amount)) {

                self.updateToNearestHundredsAmount(amount);

            }else{

                self.actualAmount = amount;

            }


        },

        updateProcessingFee: function ( amount ) {

            try {

                var processingFee = this.depositMethod.getActualAmount(amount);
                this.actualAmount = processingFee;
                $( '[data-js=processing-fee]' ).text( processingFee );


            } catch ( e ) {
            }


        },

        _resetProcessingFee: function (  ) {

            this.actualAmount = 0;
            $( '[data-js=processing-fee],[data-js=nonzero-amount],[data-js=rounded-fee],[data-js=no-decimal-amount],[data-js=nearest-hundreds-amount]' ).text( '' );

        },
        updateRoundedFee: function(amount) {
            try {

                var roundedAmount = this.settings.depositSettings.getRoundedAmount(amount);
                this.actualAmount = roundedAmount;

                $('[data-js=rounded-fee]').text(roundedAmount);

            } catch (e) {

			}
        },
        updateToNonZeroAmount: function ( amount ) {

           try {

                var nonZeroAmount = this.settings.depositSettings.getNonZeroAmount(amount);

                this.actualAmount = nonZeroAmount;
                $( '[data-js=nonzero-amount]' ).text( nonZeroAmount );


           } catch ( e ) {
           }


        },
        updateToNoDecimalAmount: function ( amount ) {

            try {

                var noDecimalAmount = this.settings.depositSettings.getNoDecimalAmount(amount);

                this.actualAmount = noDecimalAmount;
                $( '[data-js=no-decimal-amount]' ).text( noDecimalAmount );


            } catch ( e ) {
            }


        },

        updateToNearestHundredsAmount: function ( amount ) {

            try {

                if(! this.settings.depositSettings.isConvertibleToNearestHundreds()){

                    return false;

                }
                var nearestHundredsAmount = this.settings.depositSettings.getNearestHundredsAmount(amount);
                if (isNaN(amount)){

                    nearestHundredsAmount = 0;

                }
                this.actualAmount = nearestHundredsAmount;
                $( '[data-js=nearest-hundreds-amount]' ).text( nearestHundredsAmount );


            } catch ( e ) {
            }


        }

    });

})(
    jQuery,
    Q,
    Pt.Deposit.DepositLauncherService,
    _.clone(Pt.Controllers.AbstractDepositController)
);
/**
 * Created by rowen on 20/04/2017.
 */

(function(
    $,
    $q,
    BankCodeService,
    DepositLauncherService,
    AbstractDepositController
) {

    "use strict";

    _.Class('Pt.Deposit.BaseBankTransfer', BaseBankTransfer);

    /**
     * @namespace BaseBankTransfer
     * @memberOf Pt.Deposit
     */
    function BaseBankTransfer() {

        this.view = 'funds.bankTransferDeposit';
        this.form = 'form[name=bank_transfer_deposit]';
        this.depositAmount = '[data-js=depositAmount]';
        this.actions = [
            [
                this.form, 'submit', '_onFormSubmit'
            ],
            [
                '[data-js=amount_selector]', 'click', '_updateAmount'
            ],
            [
                '[data-js=depositAmount]', 'keydown', '_onAmountKeyDown'
            ],
            [
                '[data-js=amount]', 'input',  '_onAmountChange'
            ],
            [
                '[data-js=depositAmount]', 'input', '_onAmountChange'
            ]


        ];

        this.depositMethod = {};
        this.old_rules = {};
        this.validator = null;
        this.actualAmount = 0;

    }

    BaseBankTransfer.prototype = _.extend(AbstractDepositController, {

        init: function(depositMethod, validator) {

            this.depositMethod = depositMethod;
            this.validator = validator;
            this.addCsfValidations(this, 'bank_transfer');

        },

        resolve: function() {

            var defer = $q.defer();

            defer.resolve({
                banks: this.depositMethod.get('supportedBanks')
            });

            return defer.promise;

        },

        /***************************************************
         * EVENT HANDLERS
         ***************************************************/

        _onFormSubmit: function(e) {

            var self = e.data.context;

            e.preventDefault();

            self.validator.validate(self._onValidationSuccess, self, false);

        },

        _onValidationSuccess: function(data) {

            var method = this.depositMethod;
            var self = this;
            var params = {
                methodId: method.get('id'),
                amount: self.actualAmount,
                launcherUrl: method.get('launcherUrl'),
                custom: {
                    bankCode: data.get('bankCode')
                },
                title: _.trans('funds.payment_' + method.get('id'))
            };

            if ( self.depositMethod.hasFormFields() ) {

                _.extend( params.custom, self._getCsfValues(self) );

            }

            DepositLauncherService.launch(params);

            $(this.form)[0].reset();
            self._resetProcessingFee();

        },

        onRenderComplete: function() {

            this.validator
                .bindInput(true)
                .shouldSerialize(false)
                .init();

            this._bindEvents();

        },

        _updateAmount: function (e) {

            e.preventDefault();
            e.stopPropagation();
            var _self = e.data.context;
            _self.actualAmount = $(this).attr('data-value');
            $(_self.form + ' ' + _self.depositAmount).val($(this).attr('data-value')).trigger('change').trigger('input');


        },

        _onAmountKeyDown: function(e) {

            var self = e.data.context;

            if (e.keyCode === 13) {

                e.preventDefault();

                $(self.form).submit();

            }

        },
        _onAmountChange: function(e) {

            var amount = $(this).val();
            var self = e.data.context;

            if ( self.depositMethod.hasProcessingFee() && ! _.isNaN( amount ) ) {

                self.updateProcessingFee(amount);

            } else {

                self.actualAmount = amount;

            }


        },

        updateProcessingFee: function ( amount ) {

            try {

                var processingFee = this.depositMethod.getActualAmount(amount);
                this.actualAmount = processingFee;
                $( '[data-js=processing-fee]' ).text( processingFee );


            } catch ( e ) {
            }


        },
        _resetProcessingFee: function (  ) {

            this.actualAmount = 0;
            $( '[data-js=processing-fee]' ).text( '' );

        }

    });

})(
    jQuery,
    Q,
    Pt.Services.Cms.BankService,
    Pt.Deposit.DepositLauncherService,
    _.clone(Pt.Controllers.AbstractDepositController)
);
/**
 * Created by rowen on 21/04/2017.
 */

(function (
    $,
    $q,
    moment,
    Settings,
    Notify,
    $nProg,
    $qrCode,
    Form,
    Helpers,
    MemberServices,
    $tpl,
    ErrorHandler,
    Managers,
    DepositOfflineRules,
    AbstractController,
    Config
) {

    /**
     * @namespace BaseOfflineDeposit
     * @memberOf Pt.Deposit
     * @constructor
     */
    _.Class('Pt.Deposit.BaseOfflineDeposit', BaseOfflineDeposit);

    function BaseOfflineDeposit() {

        this.view = 'funds.offlineDeposit';
        this.form = 'form[name=offline_deposit]';
        this.depositAmount = '[data-js="depositAmount"]';

        this.channel = '[data-js=channel]';
        this.channelTarget = '[data-group=channel-target]';
        this.bankingListWrap = '[data-js=banking-list-wrapper]';
        this.bankingListRadio = '[data-js=bank-detail-radio]';
        this.accountName = '[data-js=accountName]';
        this.accountNumber = '[data-js=accountNumber]';
        this.bankCode = '[data-js=bankCode]';
        this.bankNotSupportedWarning = '[data-js=bank-not-supported-warning]';

        this.inputFileUploadSelector = '[data-js=deposit-file]';
        this.fileNameDisplaySelector = '[data-js=offline-deposit-file-name]';
        this.depositDate = '[data-js=depositDate]';
        this.depositTime = '[data-js=depositTime]';

        this.actions = [
            [ this.bankCode, 'change', '_showBankName' ],
            [ this.form, 'submit', '_onFormSubmit' ],
            [ '.customer-service-button', 'click', '_openLiveChat' ],
            [ '[data-js=system-bank-accounts]', 'change', '_bankAccountChangeHandler' ],
            [ this.channel, 'change', '_onChannelChange'],
            [ this.bankingListRadio, 'change', '_onBankingListRadioChange' ],
            [ '[data-js=amount_selector]', 'click', '_updateAmount' ],
            [ '[data-js=amount]', 'input', '_onAmountChange' ],
            [ '[data-js=depositAmount]', 'input', '_onAmountChange' ],
            [ '[data-js=depositAmount]', 'keydown', '_onAmountKeyDown' ],
            [ '[data-js=offline-deposit-upload-file]', 'click', '_onFileUploadBtnClick'],
            [ this.inputFileUploadSelector, 'change', '_onFileChange']
        ];

        this.defaultValues = {};

        this.settings = {};
        this.validator = null;
        this.depositMethod = null;
        this.amountSelection = [50, 100, 300, 500, 1000];
        this.actualAmount = 0;

    }

    BaseOfflineDeposit.prototype = _.extend(AbstractController, {

        resolve: function () {

            var self = this;
            var defer = $q.defer();

            var requests = [
                MemberServices.BankService.getBanks(),
                MemberServices.BankService.getSystemBankAccounts(),
                MemberServices.DepositService.getPreferredBank()
            ];

            $q.all(requests)
                .then(function(data) {

                    var banks = data[0];
                    var preferredBank = data[2];
                    var showWarningMessage = false;

                    if (! _.findWhere(banks, { bankCode: preferredBank.bankCode }) && preferredBank.hasBeenSet()) {

                        showWarningMessage = true;

                    }

                    var amountSelection = _.compact(self.depositMethod.get('customFields').amountSelection);
                    amountSelection = _.size(amountSelection)  ? amountSelection : self.amountSelection;

                    self.settings = {
                        banks: banks,
                        operatorBanks: data[0] || [],
                        systemBankAccounts: data[1],
                        preferredBank: preferredBank,
                        showWarningMessage: showWarningMessage,
                        channels: self.depositMethod.get('customFields').channels,
                        amountSelection: amountSelection
                    };

                    defer.resolve(self.settings);

                })
                .fail(function(errors) {

                    defer.reject(errors);

                });

            return defer.promise;

        },

        init: function (depositMethod, validator) {

            this.depositMethod = depositMethod;
            this.validator = validator;

        },

        /***************************************************
         * EVENT HANDLERS
         ***************************************************/

        _onFormSubmit: function (e) {

            e.preventDefault();

            var self = e.data.context;
            var frm = $(this);
            var bankAccountName = frm.find('#bankAccountName');

            bankAccountName.val(bankAccountName.val().trim());
            self.validator.validate(self._onValidationSuccess, self, false);

        },

        _initForm: function(){

            var self = this;
            var offlineDepositConfig = self.depositMethod.get('customFields').fieldSettings;
            var timeDefault = moment().format('HH:mm');

            var depositTimeCol = _.findWhere(offlineDepositConfig, { name: 'depositTime'});

            if (! _.isNull(depositTimeCol.defaultValue) ) {

                timeDefault = depositTimeCol.defaultValue;

            }

            var today = moment().format('MM/DD/YYYY');

            Helpers.DatePicker.activate($(this.depositDate), {
                format: "mm/dd/yyyy",
                endDate: moment(new Date())._d,
                language: Managers.Cookie.get('lang')
            }, Config.datePickerLocale[Managers.Cookie.get('lang')]).datepicker('setDate', today);

            Helpers.TimePicker.activate($(this.depositTime), {
                defaultTime: 'current',
                showMeridian: false,
                minuteStep: 1,
                showInputs: false
            });

            $(this.depositTime).timepicker('setTime', timeDefault);

            this._showBankName();

        },

        _onValidationSuccess: function (data, context) {

            var self = context;
            var file = null;
            var bankCode = data.get('bankCode');
            var bank = _.findWhere(self.settings.operatorBanks, {
                bankCode: bankCode
            });

            try {

                file = $('[data-js=deposit-file]')[0].files[0];

            } catch (e) {}

            data.set('bankName', bank.bankName);
            data.set('requestAmount', self.actualAmount);

            var depositDate = data.get('depositDate') || moment().format('MM/DD/YYYY')
                , depositTime = data.get('depositTime') || moment().format('HH:mm:ss')
                , bankTransferDate = moment(depositDate + ' ' + depositTime, 'MM-DD-YYYY HH:mm:ss+08:00');
            
            data.set('bankTransferDate', bankTransferDate);

            if (bankCode !== 'OTHER' || ! data.get('bankNameNative')) {

                data.set('bankNameNative', bank.bankNameNative);

            }

            if (file) {

                data.set('depositFile', file);

            }

            $nProg.start();

            Form.lockForm(self.form, true);

            MemberServices.DepositService.createOfflineTransaction(data.toFormData())
                .then(function(response) {

                    Notify.success(
                        _.str_replace_key({
                            ':transactionId': response.transactionId
                        }, _.trans('funds.success_message_offline_deposit'))
                    );

                    self._resetForm(self.form);
                    self._resetProcessingFee();
                    $("[data-js=bank-information-container], [data-js=qr-code-container], [data-js=bank-name-native-container]").hide();

                })
                .fail(function(errors) {

                    ErrorHandler.show(errors);

                })
                .finally(function() {

                    Form.lockForm(self.form, false);
                    $nProg.done();

                });

        },

        _resetForm: function (form) {

            $(form)[0].reset();

            this._setDefaultValues();

            this._initForm();

        },

        _setDefaultValues: function(){

            //channel
            $(this.channel).val(_.propertyValue(this.defaultValues, 'channel', '')).change();

            //member banks
            $(this.bankingListRadio).first().prop('checked', true).change();

            setTimeout(function(){

                $('[data-js=system-bank-accounts]').first().trigger('change');

            },100);



        },

        _showBankName: function (evt) {

            var $bankNameContainer = $("[data-js=bank-name-native-container]");

            if (evt && evt.target.value === 'OTHER') {

                $bankNameContainer.show();
                DepositOfflineRules['bankNameNative'] = {
                    presence: {
                        message: "^" + _.trans('errors.bankName_required')
                    },
                    length: {
                        maximum: 100,
                        tooLong: "^" + _.trans('errors.max_bankName')
                    }
                };

            } else {

                DepositOfflineRules['bankNameNative'] = {
                    length: {
                        maximum: 100,
                        tooLong: "^" + _.trans('errors.max_bankName')
                    }
                };

                $bankNameContainer
                    .hide()
                    .find('input')
                    .val('');

            }

        },

        _openLiveChat: function (evt) {

            window.open(Settings.liveChat_url);

            evt.preventDefault();

        },

        _bankAccountChangeHandler: function (evt) {

            var systemBankAccounts = evt.data.context.settings.systemBankAccounts;
            var systemBank = _.find(systemBankAccounts, { accountId: + $(this).val() });
            var $qrCodeContainer = $("[data-js=qr-code-container]");
            var $bankInfoContainer = $("[data-js=bank-information-container]");

            if (systemBank && systemBank.shouldShowBankInfo()) {

                $bankInfoContainer.show()
                    .find('[data-js=channel-info]')
                    .html(systemBank.get('bankNameNative'))
                    .end()
                    .find('[data-js=bank-account-name-info]')
                    .html(systemBank.get('accountName'))
                    .end()
                    .find('[data-js=bank-account-number-info]')
                    .html(systemBank.get('accountNumber'));

                $(".without-credit-card").hide();

            } else {

                $bankInfoContainer.hide();
                $(".without-credit-card").show();

            }

            if (systemBank && ! ! systemBank.image) {

                $qrCodeContainer
                    .find('img')
                    .attr('src', "data:image/png;base64, " + systemBank.image)
                ;

                $qrCode.decodeImage($qrCodeContainer.find('img'))
                    .then(function (response) {

                        $qrCodeContainer
                            .find('a')
                            .attr('href', response.value)
                            .attr('target', '_blank');

                    })
                    .fail(function () {

                        $qrCodeContainer
                            .find('a')
                            .removeAttr('href')
                            .removeAttr('target');

                    })
                    .finally(function () {

                        $qrCodeContainer.show();

                    });

            } else {

                $qrCodeContainer.hide()
                    .find('image')
                    .attr('src', '')
                    .end()
                    .find('a')
                    .removeAttr('href')
                    .removeAttr('target');

            }

        },

        onRenderComplete: function () {

            var self = this;
            var offlineDepositConfig = self.depositMethod.get('customFields').fieldSettings;
            var preferredBank = self.settings.preferredBank;
            var bankCodeSettings = _.findWhere(offlineDepositConfig, { name: 'bankCode' });

            _.each(offlineDepositConfig, function (field) {

                var $field = $("[data-js=" + field.name + "]");

                if (field.defaultValue !== "") {

                    $field.val(field.defaultValue).change();

                }

                self.defaultValues[field.name] = field.defaultValue;

                $field.val(field.defaultValue).change();

                if (! field.shouldDisplay) {

                    $field.closest(".form-group").hide();

                    DepositOfflineRules[field.name] = {};

                }

            });

            if (preferredBank.get('bankCode') === bankCodeSettings.defaultValue) {

                _.each(preferredBank, function (value, fieldName) {

                    var propertyValue = preferredBank.get(fieldName);

                    if (propertyValue) {

                        $("input[name=" + fieldName + "]").val(propertyValue).change();

                    }

                });

            }

            this.validator
                .bindInput(true)
                .shouldSerialize(false)
                .init();

            this._initForm();

            this._bindEvents();

            $(this.channel).trigger('change');

            $('[data-js=system-bank-accounts]').first().trigger('change');

            this._initComponents();

        },

        _updateAmount: function (e) {

            e.preventDefault();
            e.stopPropagation();
            var _self = e.data.context;
            $(_self.form + ' ' + _self.depositAmount).val($(this).attr('data-value')).trigger('input');

            _self.actualAmount = $(this).attr('data-value');

        },

        _onAmountKeyDown: function(e) {

            var self = e.data.context;

            if (e.keyCode === 13) {

                e.preventDefault();

                $(self.form).submit();

            }

        },

        _onChannelChange: function( e ) {

            var self = e.data.context,
                bankingDetails = self.settings.bankingDetails;

            if ( $(self.bankingListWrap).length ) {

                var value = $(this).val();
                var id = $(self.bankingListRadio).eq(0).val();

                $(self.bankingListRadio).eq(0).data('value', self._getBankingDetailByAccountId(bankingDetails, id ));

                self._populateDomAndDataByChannel( Config.depositChannels[value], $(self.bankingListRadio).eq(0) );
            }

        },

        _onBankingListRadioChange: function( e ) {

            var self = e.data.context;
            var data = $(this).data('value'),
                bankingDetails = self.settings.bankingDetails;

            $(this).data('value', self._getBankingDetailByAccountId(bankingDetails, data));
            self._populateDomAndDataByChannel( true, $(this) );

        },

        _populateDomAndDataByChannel: function( open, $selectedBankAccount ) {

            var id = $selectedBankAccount.val();
            var regularAccounts = _.propertyValue(this.bankingDetails, 'regular.accounts') || [];
            var data = _.findWhere(regularAccounts, { bankAccountId: '' + id } ) || {};

            $(this.channelTarget)[ ( open ? 'add' : 'remove' ) + 'Class']('hide');
            $(this.bankingListWrap)[ ( open ? 'remove' : 'add' ) + 'Class']('hide');
            $(this.accountNumber).closest('.form-group')[ ( open ? 'remove' : 'add' ) + 'Class']('hide');

            $(this.accountName).val( open ? _.propertyValue(data, 'bankAccountName', '') : '' );
            $(this.accountNumber).val( open ? _.propertyValue(data, 'bankAccountNumber', '') : '000000000000000' );
            $(this.bankCode).val( open ? _.propertyValue(data, 'bankCode', '') : '' );

            this._showBankName();

            if ( open ) {

                $selectedBankAccount.prop('checked', true);


            } else {

                $(this.bankingListRadio).prop('checked', false);

            }

            // remove any errors on channel change
            $(this.channelTarget).find('label.error').remove();

        },

        _onFileChange: function(e) {

            var self = e.data.context;
            $(self.fileNameDisplaySelector).val($(self.inputFileUploadSelector).val().split('\\').pop());

            if ( $('[data-js=deposit-file]').hasClass('error') ) {

                $(self.fileNameDisplaySelector).addClass('error-tip');
            }

        },

        _onFileUploadBtnClick: function (e) {

            var self = e.data.context;

            $(self.inputFileUploadSelector).trigger('click');

        },

        _onAmountChange: function(e) {

            var amount = $(this).val();
            var self = e.data.context;

            if ( self.depositMethod.hasProcessingFee() && ! _.isNaN( amount ) ) {

                self.updateProcessingFee(amount);

            } else {

                self.actualAmount = amount;

            }


        },

        updateProcessingFee: function ( amount ) {

            try {

                var processingFee = this.depositMethod.getActualAmount(amount);
                this.actualAmount = processingFee;
                $( '[data-js=processing-fee]' ).text( processingFee );


            } catch ( e ) {
            }


        },

        _resetProcessingFee: function (  ) {

            this.actualAmount = 0;
            $( '[data-js=processing-fee]' ).text( '' );

        },

        _getBankingDetailByAccountId : function(bankingDetails, id) {

            var bankDetail = null;

            if (!_.isUndefined(bankingDetails.regular) && bankingDetails.regular.accounts && id) {

                bankDetail = _.find(bankingDetails.regular.accounts, function(bank) {

                    return bank.bankAccountId === id.toString() ? true : false;

                });

            }

            return bankDetail;

        },

        _initComponents: function(){

            $('[data-toggle=tooltip]').tooltip({
                html:true
            })

        }


    });

})(
    jQuery,
    Q,
    moment,
    Pt.Settings,
    Pt.Helpers.Notify,
    Pt.Helpers.Nprogress,
    Pt.Helpers.QrCode,
    Pt.Helpers.Form,
    Pt.Helpers,
    Pt.Services.Members,
    Pt.Managers.Template,
    Pt.Helpers.ErrorHandler,
    Pt.Managers,
    Pt.Rules.validation.deposit.offline,
    _.clone(Pt.Controllers.AbstractController),
    Pt.Config
);
/**
 * Created by rowen on 21/04/2017.
 */

(function (
    $,
    $q,
    moment,
    Settings,
    Helpers,
    Notify,
    $nProg,
    Form,
    MemberServices,
    $tpl,
    AbstractController
) {

    /**
     * @namespace BaseAlipayTransferDeposit
     * @memberOf Pt.Deposit
     * @constructor
     */
    _.Class('Pt.Deposit.BaseAlipayTransferDeposit', BaseAlipayTransferDeposit);

    function BaseAlipayTransferDeposit() {

        this.view = 'funds.alipayTransferDeposit';
        this.form = 'form[name=alipay_transfer_deposit]';
        this.depositAmount = '[data-js="depositAmount"]';
        this.detailsContainer = '[data-js=transaction-details]';
        this.redirectLink = '//www.alipay.com';
        this.actions = [
            [ this.form, 'submit', '_onFormSubmit' ],
            [ '[data-js=amount_selector]', 'click', '_updateAmount' ],
            [ '[data-js=depositAmount]', 'keyup', '_onAmountChange' ],
            [ '[data-js=depositAmount]', 'change', '_onAmountChange' ],
            [ '[data-js=alipay-transfer-deposit-btn]', 'click', '_onBackToDepositFormClick' ],

        ];


        this.depositMethod = null;
        this.validator = null;
        this.actualAmount = 0;

    }

    BaseAlipayTransferDeposit.prototype = _.extend(AbstractController, {

        resolve: function () {

            var defer = $q.defer();

            defer.resolve({});

            return defer.promise;

        },

        init: function (depositMethod, validator) {

            this.depositMethod = depositMethod;
            this.validator = validator;

        },

        /***************************************************
         * EVENT HANDLERS
         ***************************************************/

        _onFormSubmit: function(e) {

            var self = e.data.context;

            e.preventDefault();

            self.validator.validate(self._onValidationSuccess, self, false);

        },

        _onValidationSuccess: function(formData) {

            var self = this;

            $nProg.start();

            Form.lockForm(self.form, true);
            var switch_lane = _.isUndefined( formData.get( 'switch_line' ) ) ? 0 : formData.get( 'switch_line' ) === 'on' ? 1 : 0;
            formData.set('transferAmount', self.actualAmount);
            formData.set('switch_line', switch_lane);

            MemberServices.AlipayTransferService.createTransaction(formData.data)
                .then(function(transId) {

                    MemberServices.AlipayTransferService.getTransaction(transId)
                        .then(function(transactionDetails) {

                            self._displayTransactionDetails(transactionDetails);

                        }).fail(function () {

                        Notify.error(_.trans('errors.transaction_created_retrieve_failed'));

                    })
                        .finally(function() {

                            Form.lockForm(self.form, false);
                            $nProg.done();

                        });

                }).fail(function (errors) {

                    Helpers.Error.show(errors);

                }).finally(function () {

                    Form.lockForm(self.form, false);
                    $nProg.done();
                    self._resetProcessingFee();

                });


        },

        onRenderComplete: function() {

            this.validator
                .bindInput(true)
                .shouldSerialize(false)
                .init();

            this._bindEvents();

        },
        _updateAmount: function (e) {

            e.preventDefault();
            e.stopPropagation();
            
            var _self = e.data.context
                , depositAmountEl = $(_self.form).find(_self.depositAmount)
                , value = $(this).data('value');

            _self.actualAmount = value;

            depositAmountEl.val(value)
                           .trigger('change');

        },

        _onAmountChange: function(e) {

            var amount = $(this).val();
            var self = e.data.context;

            if ( self.depositMethod.hasProcessingFee() && ! _.isNaN( amount ) ) {

                self.updateProcessingFee(amount);

            } else {

                self.actualAmount = amount;

            }

        },

        updateProcessingFee: function ( amount ) {

            try {

                var processingFee = this.depositMethod.getActualAmount(amount);
                this.actualAmount = processingFee;
                $( '[data-js=processing-fee]' ).text( processingFee );


            } catch ( e ) {
            }


        },
        _displayTransactionDetails: function(transactionDetails) {

            var view = $tpl.get('funds.alipayDetails', {
                transaction: transactionDetails,
                redirectLink: this.redirectLink
            });

            this.render(this.detailsContainer, view);

            $(this.form).hide();

        },

        _onBackToDepositFormClick: function (e) {

            var self = e.data.context;

            $(self.detailsContainer).html('');
            $(self.form).show();

        },
        _resetProcessingFee: function (  ) {

            this.actualAmount = 0;
            $( '[data-js=processing-fee]' ).text( '' );

        }

    });

})(
    jQuery,
    Q,
    moment,
    Pt.Settings,
    Pt.Helpers,
    Pt.Helpers.Notify,
    Pt.Helpers.Nprogress,
    Pt.Helpers.Form,
    Pt.Services.Members,
    Pt.Managers.Template,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Created by bryan on 14/06/2018.
 */

(function (
    $,
    $q,
    AbstractController
) {

    /**
     * @namespace BaseCustomDeposit
     * @memberOf Pt.Deposit
     * @constructor
     */
    _.Class('Pt.Deposit.BaseCustomDeposit', BaseCustomDeposit);

    function BaseCustomDeposit() {

        this.view = 'funds.customDeposit';
        this.depositMethod = null;
        this.methodId = null;
    }

    BaseCustomDeposit.prototype = _.extend(AbstractController, {

        resolve: function () {

            var defer = $q.defer();

            defer.resolve({});

            return defer.promise;

        },

        init: function (depositMethod) {

            depositMethod.custom_deposit_link = ! _.isObject(depositMethod.getCustomFields('custom_deposit_link')) ? depositMethod.getCustomFields('custom_deposit_link') : '' ;

            this.depositMethod = depositMethod;

        },

        /***************************************************
         * EVENT HANDLERS
         ***************************************************/

        onRenderComplete: function() {

            this._bindEvents();

        }

    });

})(
    jQuery,
    Q,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Created by rowen on 21/04/2017.
 */

(function (
    $,
    $q,
    moment,
    Settings,
    Helpers,
    Notify,
    $nProg,
    Form,
    MemberServices,
    $tpl,
    AbstractController
) {

    /**
     * @namespace BaseOfflineTransferDeposit
     * @memberOf Pt.Deposit
     * @constructor
     */
    _.Class('Pt.Deposit.BaseOfflineTransferDeposit', BaseOfflineTransferDeposit);

    function BaseOfflineTransferDeposit() {

        this.view = 'funds.offlineTransferDeposit';
        this.form = 'form[name=offline_transfer_deposit]';
        this.depositAmount = '[data-js="depositAmount"]';
        this.detailsContainer = '[data-js=transaction-details]';
        this.redirectLink = '';
        this.actions = [
            [ this.form, 'submit', '_onFormSubmit' ],
            [ '[data-js=amount_selector]', 'click', '_updateAmount' ],
            [ '[data-js=depositAmount]', 'keyup', '_onAmountChange' ],
            [ '[data-js=depositAmount]', 'change', '_onAmountChange' ],
            [ '[data-js=offline-transfer-deposit-btn]', 'click', '_onBackToDepositFormClick']
        ];


        this.depositMethod = null;
        this.validator = null;
        this.actualAmount = 0;
        this.methodId = 0;

    }

    BaseOfflineTransferDeposit.prototype = _.extend(AbstractController, {

        resolve: function () {

            var defer = $q.defer();

            defer.resolve({});

            return defer.promise;

        },

        init: function (depositMethod, validator) {

            this.depositMethod = depositMethod;
            this.validator = validator;

        },

        /***************************************************
         * EVENT HANDLERS
         ***************************************************/

        _onFormSubmit: function(e) {

            var self = e.data.context;

            e.preventDefault();

            self.validator.validate(self._onValidationSuccess, self, false);

        },

        _onValidationSuccess: function(formData) {

            var self = this;

            $nProg.start();

            Form.lockForm(self.form, true);
            var switch_lane = _.isUndefined( formData.get( 'switch_line' ) ) ? 0 : formData.get( 'switch_line' ) === 'on' ? 1 : 0;
            formData.set('transferAmount', self.actualAmount);
            formData.set('switch_line', switch_lane);

            MemberServices.OfflineTransferService.createTransaction(formData.data, self.methodId)
                .then(function(transId) {

                    MemberServices.OfflineTransferService.getTransaction(transId, self.methodId)
                        .then(function(transactionDetails) {

                            self._displayTransactionDetails(transactionDetails);

                        }).fail(function () {

                        Notify.error(_.trans('errors.transaction_created_retrieve_failed'));

                    })
                        .finally(function() {

                            Form.lockForm(self.form, false);
                            $nProg.done();

                        });

                }).fail(function (errors) {

                    Helpers.Error.show(errors);

                }).finally(function () {

                    Form.lockForm(self.form, false);
                    $nProg.done();
                    self._resetProcessingFee();

                });


        },

        onRenderComplete: function() {

            this.validator
                .bindInput(true)
                .shouldSerialize(false)
                .init();

            this._bindEvents();

        },
        _updateAmount: function (e) {

            e.preventDefault();
            e.stopPropagation();
            var _self = e.data.context;
            $(_self.form + ' ' + _self.depositAmount).val($(this).attr('data-value')).trigger('change');

            _self.actualAmount = $(this).attr('data-value');

        },

        _onAmountChange: function(e) {

            var amount = $(this).val();
            var self = e.data.context;

            if ( self.depositMethod.hasProcessingFee() && ! _.isNaN( amount ) ) {

                self.updateProcessingFee(amount);

            } else {

                self.actualAmount = amount;

            }


        },

        updateProcessingFee: function ( amount ) {

            try {

                var processingFee = this.depositMethod.getActualAmount(amount);
                this.actualAmount = processingFee;
                $( '[data-js=processing-fee]' ).text( processingFee );


            } catch ( e ) {
            }


        },
        _displayTransactionDetails: function(transactionDetails) {

            var view = $tpl.get('funds.offlineTransferDetails', {
                transaction: transactionDetails,
                redirectLink: this.depositMethod.get('customFields').redirect_link
            });

            this.render(this.detailsContainer, view);

            $(this.form).hide();

        },

        _onBackToDepositFormClick: function (e) {

            var self = e.data.context;

            $(self.detailsContainer).html('');
            $(self.form).show();
            $(self.form)[0].reset();

        },
        _resetProcessingFee: function (  ) {

            this.actualAmount = 0;
            $( '[data-js=processing-fee]' ).text( '' );

        }

    });

})(
    jQuery,
    Q,
    moment,
    Pt.Settings,
    Pt.Helpers,
    Pt.Helpers.Notify,
    Pt.Helpers.Nprogress,
    Pt.Helpers.Form,
    Pt.Services.Members,
    Pt.Managers.Template,
    _.clone(Pt.Controllers.AbstractController)
);
(function ($,
    $q,
    moment,
    Settings,
    Helpers,
    Notify,
    $nProg,
    Form,
    MemberServices,
    $tpl,
    $qrCode,
    AbstractController) {

/**
* @namespace BaseOfflineQRDeposit
* @memberOf Pt.Deposit
* @constructor
*/
_.Class('Pt.Deposit.BaseOfflineQRDeposit', BaseOfflineQRDeposit);

    function BaseOfflineQRDeposit() {

        this.view = 'funds.offlineQRDeposit';
        this.form = 'form[name=offline_qr_deposit]';
        this.depositAmount = '[data-js="depositAmount"]';
        this.detailsContainer = '[data-js=transaction-details]';
        this.redirectLink = '';
        this.actions = [
            [this.form, 'submit', '_onFormSubmit'],
            ['[data-js=amount_selector]', 'click', '_updateAmount'],
            ['[data-js=depositAmount]', 'keyup', '_onAmountChange'],
            ['[data-js=depositAmount]', 'change', '_onAmountChange'],
            ['[data-js=offline-transfer-deposit-btn]', 'click', '_onBackToDepositFormClick']
        ];


        this.depositMethod = null;
        this.validator = null;
        this.actualAmount = 0;
        this.methodId = 0;
        this.bankCode = "";

    }

    BaseOfflineQRDeposit.prototype = _.extend(AbstractController, {

    resolve: function () {

        var defer = $q.defer();

        defer.resolve({});

        return defer.promise;

    },

    init: function (depositMethod, validator) {

        this.bankCode = !_.isObject(depositMethod.getCustomFields('bank_code')) ? depositMethod.getCustomFields('bank_code') : '';
        this.depositMethod = depositMethod;
        this.validator = validator;
    },

    /***************************************************
     * EVENT HANDLERS
     ***************************************************/

    _onFormSubmit: function (e) {

        var self = e.data.context;

        e.preventDefault();

        self.validator.validate(self._onValidationSuccess, self, false);

    },

    _onValidationSuccess: function (formData) {

        var self = this;

        $nProg.start();

        Form.lockForm(self.form, true);
        var switch_lane = _.isUndefined(formData.get('switch_line')) ? 0 : formData.get('switch_line') === 'on' ? 1 : 0;
        formData.set('transferAmount', self.actualAmount);
        formData.set('switch_line', switch_lane);
        formData.set('bankCode', self.bankCode);

        MemberServices.OfflineTransferService.createQRTransaction(formData.data, self.methodId)
            .then(function (qrTransaction) {


                MemberServices.OfflineTransferService.getTransaction(qrTransaction.transactionId, self.methodId)
                    .then(function (transactionDetails) {

                        transactionDetails.redirectUrl = qrTransaction.redirectUrl;
                        self._displayTransactionDetails(transactionDetails);

                    }).fail(function (err) {
                        
                        Notify.error(_.trans('errors.transaction_created_retrieve_failed'));

                    })
                    .finally(function () {

                        Form.lockForm(self.form, false);
                        $nProg.done();

                    });


        }).fail(function (errors) {
            void 0;
            Helpers.Error.show(errors);

        }).finally(function () {

            Form.lockForm(self.form, false);
            $nProg.done();
            self._resetProcessingFee();

        });


    },

    onRenderComplete: function () {

        this.validator
            .bindInput(true)
            .shouldSerialize(false)
            .init();

        this._bindEvents();

    },
    _updateAmount: function (e) {

        e.preventDefault();
        e.stopPropagation();
        
        var _self = e.data.context
            , depositAmountEl = $(_self.form).find(_self.depositAmount)
            , value = $(this).data('value');

        _self.actualAmount = value;

        depositAmountEl.val(value)
                       .trigger('change');
    },

    _onAmountChange: function (e) {

        var amount = $(this).val();
        var self = e.data.context;

        if (self.depositMethod.hasProcessingFee() && !_.isNaN(amount)) {

            self.updateProcessingFee(amount);

        } else {

            self.actualAmount = amount;

        }


    },

    updateProcessingFee: function (amount) {

        try {

            var processingFee = this.depositMethod.getActualAmount(amount);
            this.actualAmount = processingFee;
            $('[data-js=processing-fee]').text(processingFee);


        } catch (e) {
        }


    },
    _displayTransactionDetails: function (transactionDetails) {

        var view = $tpl.get('funds.offlineQRDetails', {
            transaction: transactionDetails,
            postDepositInstructionTemplate : this.instructionTemplate

        });

        this.render(this.detailsContainer, view);
        this._generateQR(transactionDetails);

        $(this.form).hide();

    },

    _onBackToDepositFormClick: function (e) {

        var self = e.data.context;

        $(self.detailsContainer).html('');
        $(self.form).show();
        $(self.form)[0].reset();

    },
    _resetProcessingFee: function () {

        this.actualAmount = 0;
        $('[data-js=processing-fee]').text('');

    },

    _generateQR: function (transactionDetails) {
        
        transactionDetails.id = "offline_qrcode";
        transactionDetails.width = "256";
        transactionDetails.height = "256";
        transactionDetails.url = transactionDetails.redirectUrl;
        $qrCode.generate(transactionDetails);
        

    }


    });

})(
jQuery,
Q,
moment,
Pt.Settings,
Pt.Helpers,
Pt.Helpers.Notify,
Pt.Helpers.Nprogress,
Pt.Helpers.Form,
Pt.Services.Members,
Pt.Managers.Template,
Pt.Helpers.QrCode,
_.clone(Pt.Controllers.AbstractController)
);
(function (
    $,
    $q,
    moment,
    Settings,
    Helpers,
    Notify,
    $nProg,
    Form,
    MemberServices,
    $tpl,
    AbstractController
) {

    /**
     * @namespace UnionPayTransferDeposit
     * @memberOf Pt.Deposit
     * @constructor
     */
    _.Class('Pt.Deposit.BaseUnionPayTransferDeposit', UnionPayTransferDeposit);

    function UnionPayTransferDeposit() {

        this.view = 'funds.unionPayTransferDeposit';
        this.form = 'form[name=unionpay_transfer_deposit]';
        this.copyToClipboardBtn     = '[data-js="copy-clipboard-btn"]';
        this.copyToClipboardText = '[data-js="copy-clipboard-text"]';
        this.bankingDetailsSelection = this.form + " [data-js=banking-details]";
        this.depositAmount = '[data-js="depositAmount"]';
        this.detailsContainer = '[data-js=transaction-details]';
        this.redirectLink = '';
        this.actions = [
            [ this.form, 'submit', '_onFormSubmit' ],
            [ '[data-js=amount_selector]', 'click', '_updateAmount' ],
            [ '[data-js=depositAmount]', 'keyup', '_onAmountChange' ],
            [ '[data-js=depositAmount]', 'change', '_onAmountChange' ],
            [ '[data-js=offline-transfer-deposit-btn]', 'click', '_onBackToDepositFormClick'],
            [this.copyToClipboardBtn, 'click', '_onCopyToClipboardAction']
        ];


        this.depositMethod = null;
        this.validator = null;
        this.actualAmount = 0;
        this.methodId = 1204373;


    }

    UnionPayTransferDeposit.prototype = _.extend(AbstractController, {

        resolve: function () {

            var defer = $q.defer();

            defer.resolve({});

            return defer.promise;

        },

        init: function (depositMethod, validator) {

            this.depositMethod = depositMethod;
            this.validator = validator;


        },

        /***************************************************
         * EVENT HANDLERS
         ***************************************************/

        _onFormSubmit: function(e) {

            var self = e.data.context;

            e.preventDefault();

            self.validator.validate(self._onValidationSuccess, self, false);

        },

        _onValidationSuccess: function(formData) {

            var self = this;

            $nProg.start();

            Form.lockForm(self.form, true);
            var switch_lane = _.isUndefined( formData.get( 'switch_line' ) ) ? 0 : formData.get( 'switch_line' ) === 'on' ? 1 : 0;
            formData.set('transferAmount', self.actualAmount);
            formData.set('switch_line', switch_lane);

            MemberServices.OfflineTransferService.createTransaction(formData.data, self.methodId)
                .then(function(transId) {

                    MemberServices.OfflineTransferService.getTransaction(transId, self.methodId)
                        .then(function(transactionDetails) {

                            self._displayTransactionDetails(transactionDetails);

                        }).fail(function () {

                        Notify.error(_.trans('errors.transaction_created_retrieve_failed'));

                    })
                        .finally(function() {

                            Form.lockForm(self.form, false);
                            $nProg.done();

                        });

                }).fail(function (errors) {

                    Helpers.Error.show(errors);

                }).finally(function () {

                    Form.lockForm(self.form, false);
                    $nProg.done();
                    self._resetProcessingFee();

                });


        },

        onRenderComplete: function() {

            this.validator
                .bindInput(true)
                .shouldSerialize(false)
                .init();

            this._bindEvents();

        },
        _updateAmount: function (e) {

            e.preventDefault();
            e.stopPropagation();
            
            var _self = e.data.context
                , depositAmountEl = $(_self.form).find(_self.depositAmount)
                , value = $(this).data('value');

            _self.actualAmount = value;

            depositAmountEl.val(value)
                           .trigger('change');

        },

        _onAmountChange: function(e) {

            var amount = $(this).val();
            var self = e.data.context;

            if ( self.depositMethod.hasProcessingFee() && ! _.isNaN( amount ) ) {

                self.updateProcessingFee(amount);

            } else {

                self.actualAmount = amount;

            }

            if ( self.depositMethod.getCustomFieldsByKey('non-zero_amount_range') && ! _.isNaN( amount ) ) {

                self.updateToNonZeroAmount(amount);

            }


        },

        updateProcessingFee: function ( amount ) {

            try {

                var processingFee = this.depositMethod.getActualAmount(amount);
                this.actualAmount = processingFee;
                $( '[data-js=processing-fee]' ).text( processingFee );


            } catch ( e ) {
            }


        },

        updateToNonZeroAmount: function ( amount ) {

            try {

                var nonZeroAmount = this.depositMethod.getNonZeroAmount(amount);
                this.actualAmount = nonZeroAmount;
                $( '[data-js=nonzero-amount]' ).text( nonZeroAmount );


            } catch ( e ) {
            }


        },
        _displayTransactionDetails: function(transactionDetails) {

            var view = $tpl.get('funds.unionPayTransferDetails', {
                transaction: transactionDetails,
                redirectLink: this.depositMethod.get('customFields').redirect_link,
                postDepositInstructionTemplate: this.postDepositInstructionTemplate
            });

            this.render(this.detailsContainer, view);
            this._bindEvents();
            $(this.form).hide();

        },

        _onBackToDepositFormClick: function (e) {

            var self = e.data.context;

            $(self.detailsContainer).html('');
            $(self.form).show();
            $(self.form)[0].reset();

        },
        _resetProcessingFee: function (  ) {

            this.actualAmount = 0;
            $( '[data-js=processing-fee],[data-js=nonzero-amount],[data-js=rounded-fee]' ).text( '' );

        },
        _onCopyToClipboardAction: function (e) {

            e.preventDefault();
            var self = e.data.context;
            $(self.copyToClipboardText, this).select();
            document.execCommand("copy");

        }

    });

})(
    jQuery,
    Q,
    moment,
    Pt.Settings,
    Pt.Helpers,
    Pt.Helpers.Notify,
    Pt.Helpers.Nprogress,
    Pt.Helpers.Form,
    Pt.Services.Members,
    Pt.Managers.Template,
    _.clone(Pt.Controllers.AbstractController)
);

(function(
    $,
    $q,
    ScratchCardService,
    Template,
    Form,
    ErrorHandler,
    Notify,
    DepositLauncherService,
    AbstractDepositController
) {

    _.Class('Pt.Deposit.ScratchCard', ScratchCard);

    function ScratchCard() {

        this.view = 'funds.scratchCard';
        this.form = 'form[name=form_scratch_card]';

        this.actions = [
            [ '[data-js=telco_code]', 'change', 'onTelcoChange' ],
            [ this.form, 'submit', 'onFormSubmit' ]
        ];

        this.depositMethod = {};
        this.validator = null;
        this.denominations = {};
        this.apiType = 'custom';
        this.processMapping = {

            'custom': '_callScratchCardService',
            'dummy' : '_launchDummyWindow'


        };

        this.amount_source = 'selection';


    }

    ScratchCard.prototype = _.extend(AbstractDepositController, {

        init: function(depositMethod, validator) {

            this.depositMethod = depositMethod;
            this.apiType = depositMethod.apiType || 'custom';
            this.validator = validator;

        },

        resolve: function() {

            var self = this;
            var defer = $q.defer();
            var requests = [
                ScratchCardService.getDenominations(this.depositMethod.id)
            ];

            $q.allSettled(requests).then(function(response) {

                self.denominations = response[0].state === 'fulfilled' ?
                    response[0].value : {}

                defer.resolve({
                    denominations: self.denominations
                });

            });

            return defer.promise;

        },

        onRenderComplete: function() {

            if ( ! this.denominations.isMultipleTelcos() ) {

                this.displayTelcoAmounts(this.denominations.getTelcos(0).vendorCode);

            }

            this.validator
                .bindInput(true)
                .shouldSerialize(false)
                .init();

            this._bindEvents();

        },

        onFormSubmit: function(e) {

            e.preventDefault();
            var self = e.data.context;
            self.validator.validate(self[self.processMapping[self.apiType]], self, false);
            self._hiddenAmountValidation();

        },
        _launchDummyWindow: function(data, self){

            var method = self.depositMethod;
            var additionalValues = self._getAllValues(data);
            var params = {
                methodId: method.get('id'),
                amount : additionalValues.amount,
                launcherUrl: method.get('launcherUrl'),
                title: _.trans('funds.payment_' + method.get('id'))
            };
            params = _.extend( params, { custom: additionalValues } );
            DepositLauncherService.launch(params);

            $(self.form)[0].reset();

        },
        _callScratchCardService: function(data, self) {

            var methodId = self.depositMethod.get('id');

            var createTransactionRequest = {
                transferAmount: data.get('amount')
            };

            Form.lockForm(self.form, true);

            ScratchCardService
                .createTransaction(createTransactionRequest, methodId)
                .then(function(invId) {

                    var validateTransactionRequest = {
                        invId: invId,
                        pin: data.get('pin'),
                        serial: data.get('serial'),
                        telcoCode: data.get('telcoCode')
                    }

                    ScratchCardService
                        .validateTransaction(validateTransactionRequest, methodId)
                        .then(function(response) {

                            Notify.success(
                                _.str_replace_key({
                                    ':transactionId': invId
                                }, _.trans('funds.success_message_scratchcard_deposit'))
                            );


                            var message = _.str_replace_key({

                                '{amount}': _.propertyValue(response,'amount', 0)

                            },_.trans('funds.payment_successful'));

                            var view = Template.get('funds.scratchCardSuccessMessage', {
                                message: message
                            });
                            $('[data-js=successfull_deposit_container]').html(view);


                            self.resetForm();

                        })
                        .fail(function(errors) {

                            ErrorHandler.show(errors);
                        })
                        .finally(function() {

                            Form.lockForm(self.form, false);

                        });

                })
                .fail(function(errors) {

                    ErrorHandler.show(errors);
                    Form.lockForm(self.form, false);

                })

        },

        onTelcoChange: function(e) {

            var self = e.data.context;
            var code = e.target.value;

            self.displayTelcoAmounts(code);

        },

        displayTelcoAmounts: function(code) {

            var amounts = this.denominations.getTelcoAmounts(code);

            if ( this.denominations.hasMultipleTelcoAmounts(code) ) {

                $('[data-js=deposit_amount_container]').removeClass('hide');

            }

            var view = Template.get('funds.scratchCardAmounts', {
                amounts: amounts
            });

            this.render('[data-js=amount]', view);

        },

        resetForm: function() {

            $(this.form)[0].reset();

        },
        _getAllValues: function (data) {

            var params = {};
            var nameMapping = {

                'telcoCode': 'csfb_telco',
                'serial': 'csfb_cardSerialNo',
                'pin' : 'csfb_cardPin'

            };
            _.each(data.data || [], function (field) {

                params[nameMapping[field.name] || field.name] = field.value;

            });

            return params;

        },
        _hiddenAmountValidation: function(){

            var error_element = $('[data-js=deposit_amount_container] label.error');
            if(error_element.length && $('[data-js=deposit_amount_container]').is(":hidden")) {

                Notify.error(_.trans('errors.unknown_error'));

            }

        }

    }, Pt.Core.Extend('Controllers.Deposit.ScratchCard'));

})(
    jQuery,
    Q,
    Pt.Services.Members.ScratchCardService,
    Pt.Managers.Template,
    Pt.Helpers.Form,
    Pt.Helpers.ErrorHandler,
    Pt.Helpers.Notify,
    Pt.Deposit.DepositLauncherService,
    _.clone(Pt.Controllers.AbstractDepositController)
);

(function(
    $q,
    MPayService,
    Template,
    Form,
    ErrorHandler,
    $qrCode,
    DepositInstructionService,
    AbstractDepositController
) {

    _.Class('Pt.Deposit.MPay', MPay);

    function MPay() {

        this.view = 'funds.mpayDeposit';
        this.form = 'form[name=form_mpay]';
        this.qrContainer = 'mpay-qr-code';

        this.actions = [
            [ this.form, 'submit', 'onFormSubmit' ]
        ];

        this.depositMethod = {};
        this.validator = null;

    }

    MPay.prototype = _.extend(AbstractDepositController, {

        init: function(depositMethod, validator) {

            this.depositMethod = depositMethod;
            this.validator = validator;

        },

        resolve: function() {

            var defer = $q.defer();
            defer.resolve({});
            return defer.promise;

        },

        onRenderComplete: function() {

            this.validator
                .bindInput(true)
                .shouldSerialize(false)
                .init();

            this._bindEvents();

        },

        onFormSubmit: function(e) {

            e.preventDefault();
            var self = e.data.context;
            self.validator.validate(self.onValidationSuccess, self, false);

        },

        onValidationSuccess: function(data, self) {

            var amount = data.get('amount');
            var accountNumber = data.get('phoneNumber');

            var createTransactionRequest = {
                transferAmount: amount,
                phoneNumber: accountNumber,
                bankCode: 'MOMO',
                switch_line: data.get('switch_line') ? 1 : 0
            }

            Form.lockForm(self.form, true);

            MPayService
                .createTransaction(createTransactionRequest)
                .then(function(transaction) {

                    var getTransactionDetailsRequest = {
                        transactionId: transaction.transactionId
                    }

                    MPayService
                        .getTransactionDetails(getTransactionDetailsRequest)
                        .then(function(details) {

                            details.qrData = transaction.redirectUrl;
                            self.displayTransactionDetails(details);

                        })
                        .fail(function(errors) {

                            ErrorHandler.show(errors);
                            Form.lockForm(self.form, false);
        
                        });

                })
                .fail(function(errors) {

                    ErrorHandler.show(errors);
                    Form.lockForm(self.form, false);

                });

        },

        displayTransactionDetails: function(details) {

            var self = this
                , view = Template.get('funds.mpayDepositTransaction', {
                    transactionId: details.transactionId,
                    amount: _.toCurrency(details.amount),
                    accountName: details.accountName,
                    accountNumber: details.accountNumber,
                    status: details.status,
                    postDepositInstruction: DepositInstructionService.getPostInstruction(self.depositMethod.methodCode)
                });

            self.render(self.form, view);

            /**
             * generate QR code
             * then remove data from container's title attribute
             */
            self.generateQRCode(details.qrData);
            setInterval(function() {
                $('#' + self.qrContainer).removeAttr('title');
            }, 300);
        },

        generateQRCode: function(data) {

            var self = this
                , options = {
                    id: self.qrContainer,
                    width: "256",
                    height: "256",
                    url: data
                };

            $qrCode.generate(options);
        }

    }, Pt.Core.Extend('Controllers.Deposit.MPay'));

})(
    Q,
    Pt.Services.Members.MPayService,
    Pt.Managers.Template,
    Pt.Helpers.Form,
    Pt.Helpers.ErrorHandler,
    Pt.Helpers.QrCode,
    Pt.Services.Cms.DepositInstructionService,
    _.clone(Pt.Controllers.AbstractDepositController)
);
/**
 * Base Freebet Controller
 * Created by isda on 12/04/2017.
 */


(function (
    Rules,
    Contracts,
    Helpers,
    Widgets,
    Managers,
    Services,
    absFreeBet,
    absCtrl
) {

    'use strict';

    _.Class('Pt.Controllers.BaseFreeBetController', BaseFreeBetController);

    function BaseFreeBetController() {

        this.container = '[data-js=funds-container]';
        this.balance = Widgets.Balance.mainBalance();
        this.validator = null;

    }

    BaseFreeBetController.prototype = _.extend(absFreeBet, absCtrl, {

        init: function () {

            this.balance
                .setWallets(this.wallets)
                .clearWalletIndicator()
                .activate();

            var rebate_wallets = _.reject(this.wallets, function (wallet) {

                return + wallet.id === 0;

            });

            var view  = Managers.Template.get('funds.freebet', {
                wallets: rebate_wallets
            });

            this.render(this.container, view);

            this.validator = new Managers.Validation(this.form, Rules.validation.freeBetClaim);

            this.validator
                .bindInput(true)
                .init();

            this._bindEvents();

        }

    });


})(
    Pt.Rules,
    Pt.Contracts,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    new Pt.Controllers.AbstractFreeBet,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Base Rebate Controller
 * Created by isda on 12/04/2017.
 */


(function (
    Rules,
    Contracts,
    Helpers,
    Widgets,
    Managers,
    Services,
    Settings,
    absCtrl
) {

    'use strict';

    _.Class('Pt.Controllers.BaseRebateController', BaseRebateController);

    function BaseRebateController () {

        this.container = '[data-js=funds-container]';
        this.tableContainer = '[data-js=rebate-table-wrapper]';
        this.dailyRebateTableContainer = '[data-js=daily-rebate-table-wrapper]';
        this.periodSelections = '[data-js=rebate-periods]';
        this.dailyRebateSelections = '[data-js=daily-rebate-selection]';
        this.sbProductSelections = '[data-js=sb-selections]';
        this.balanceWidget = Widgets.Balance.mainBalance();
        this.view = {
            table: 'funds.rebateTable',
            wrapper: 'funds.rebateWrapper',
            row: 'funds.rebateTableRow',
            sbModal: 'funds.rebateSBModal',
            sbModalSuccess: 'funds.rebateSBModalSuccess',
            dailyRebateTable: 'funds.dailyRebateTable'
        };
        this.rebates = {};
        this.actions = [
            ['[data-js=rebate-periods]', 'change', '_changePeriod'],
            [this.dailyRebateSelections, 'change', '_changeDailyRebatePeriod'],
            ['[data-js=refresh-row]', 'click', '_refreshRow'],
            ['[data-js=instant-claim]', 'click', '_instantClaim'],
            ['[data-js=weekly-claim]', 'click', '_weeklyClaim'],
            ['[data-js=weekly-modal-claim]', 'click', '_weeklyModalClaim']
        ];

        this.errorMessages = {
            weeklyClaimError: 'rebates.error_weekly_claim_failed',
            instantClaimError: 'rebates.error_instant_claim_failed',
            noSBSelected: 'rebates.error_no_sb_selected'
        };

        this.modal = { size: 'large' };
        this.dailyRebateSelection = [];

    }

    BaseRebateController.prototype = _.extend(absCtrl, {

        resolve: function (next) {

            var self = this;

            Helpers.Nprogress.start();

            var requests = [
                Services.Members.WalletService.getAll(),
                Services.Members.RebateService.getRebateSettings()
            ];

            Helpers.Preloader.basic(self.container);
            
            Q.all(requests)
                .then(function(response) {

                    self.wallets = response[0];
                    self.rebates = _.extend( response[1], {

                        mondays: Services.Members.RebateService.getMondaySelection(response[1].getStartDate())

                    });

                }).fail(function() {

                Helpers.Notify.error(_.trans('errors.unknown_error_notification'));

            }).finally(function() {

                next();
                Helpers.Nprogress.done();

            });

        },

        init: function () {

            var data = { rebates: this.rebates, canClaim: true, currentPeriod: this.rebates.mondays[0], dailyRebateSelection: this._generateDailyRebateSelection() };
            var view = Managers.Template.get(this.view.wrapper, data);

            this.render(this.container, view );
            this.rebates.currentPeriod =  _.find(this.rebates.mondays, { _i: $(this.periodSelections).val() });
            this.fetchRebateProducts();
            if ( ! _.isEmpty(this.rebates.daily_rebate_products)) {

                this.fetchDailyRebateProducts();

            }

            this._bindEvents();

            this.balanceWidget
                .setWallets(this.wallets)
                .clearWalletIndicator()
                .activate();

        },

        fetchRebateProducts: function() {

            var self = this;

            self.rebates.canClaim = self.rebates.currentPeriod.canClaim();
            Helpers.Nprogress.start();
            Services.Members.RebateService.getRebateSummaries(self.rebates.currentPeriod, this.rebates)
                .then(function (response) {

                    self.renderTable(response);

                })
                .finally(function() {

                    Helpers.Nprogress.done();

                });

        },

        fetchDailyRebateProducts: function(value) {

            var self = this;
            value = value ? value : moment().format('YYYY-MM-DD');
            self.rebates.canClaim = self.rebates.currentPeriod.canClaim();
            Helpers.Nprogress.start();

            Services.Members.RebateService.getDailyRebateSummaries(value, this.rebates)
            .then(function (response) {

                self.renderRebateDailyTable(response);

            })
            .finally(function() {

                Helpers.Nprogress.done();

            });

        },

        renderTable: function(rebateProducts) {


            var data = {
                rebates: {

                    products: rebateProducts
                },
                canClaim: this.rebates.canClaim,
                currentPeriod: this.rebates.currentPeriod
            };
            var view = Managers.Template.get(this.view.table, data);

            this.render(this.tableContainer, view );

        },

        renderRebateDailyTable: function(rebateProducts) {

            var data = {
                rebates: {

                    daily_rebate_products: rebateProducts
                },
                canClaim: this.rebates.canClaim,
                currentPeriod: this.rebates.currentPeriod
            };
            var view = Managers.Template.get(this.view.dailyRebateTable, data);
            this.render(this.dailyRebateTableContainer, view );

        },

        _changePeriod: function(e) {

            var self = e.data.context;
            var value = $(this).val();
            self.rebates.currentPeriod =  _.find(self.rebates.mondays, { _i: value });
            self.fetchRebateProducts();
            self._updateWeekRangeLabel(value);

        },

        _changeDailyRebatePeriod: function(e) {

            var self = e.data.context;
            var value = $(this).val();
            self.fetchDailyRebateProducts(value);

        },

        _updateWeekRangeLabel: function(date) {

            $('[data-js=week-start-date]').html(moment(date, 'YYYY-MM-DD HH:mm:ss' ).startOf('isoweek').format('YYYY-MM-DD'));
            $('[data-js=week-end-date]').html(moment(date, 'YYYY-MM-DD HH:mm:ss' ).endOf('isoweek').format('YYYY-MM-DD'));

        },

        _refreshRow: function(e) {

            var claimCode = $(this).data('claimCode');
            var self = e.data.context;
            var $this = $(this);

            Helpers.Nprogress.start();
            Services.Members.RebateService.getRebatePerProduct(claimCode)
                .then(function(product) {

                    var view = Managers.Template.get(self.view.row,
                        {
                            products: product,
                            canClaim: self.rebates.canClaim
                        });
                    self.render($this.closest('tr'), view );

                })
                .finally(function() {

                    Helpers.Nprogress.done();

                });

        },

        _instantClaim: function(e) {

            var self = e.data.context;
            var $this = $(this);

            Helpers.Nprogress.start();
            $this.prop('disabled', true);

            var data = {
                amount: $this.data('claimAmount'),
                claimCode: $this.data('claimCode'),
                date: self.rebates.currentPeriod._i
            };

            Services.Members.RebateService.instantClaim(data)
                .then(function() {

                    self._successClaimHandler(false);

                })
                .fail(function() {

                    Helpers.Notify.error(_.trans(self.errorMessages.instantClaimError));
                    $this.prop('disabled', false);

                })
                .finally(function() {

                    Helpers.Nprogress.done();

                }) ;

        },

        _weeklyClaim: function(e) {

            var self = e.data.context;
            var sbProducts = [];
            var codes = [];
            var $this = $(this);

            $this.prop('disabled', true);
            Helpers.Nprogress.start();

            try {

                /**
                 * Get all promotionCodes
                 */
                sbProducts = self.rebates.products.sportsbook;
                codes = _.map(sbProducts, function(sb) {

                    return sb.promotionCode;

                });

            }catch (e) {}


            /**
             * Verify all promotionCodes for all
             * respective RebateProducts under sportsBook
             */
            Services.Members.RebateService.getRebatePromoCodeStatus(codes)
                .then(function(response) {

                    var sbWithClaimStatus = [];

                    _.map(response, function(sb) {

                        var sbProduct = _.findWhere(sbProducts, { promotionCode: sb.rebateCode });

                        if (sbProduct) {

                            sbWithClaimStatus.push(_.extendOnly(sbProduct, { isClaimable: sb.claimable }));

                        }

                    });

                    self._renderWeeklyClaimModal(sbWithClaimStatus);
                    $this.prop('disabled', false);

                })
                .finally(function() {

                    Helpers.Nprogress.done();

                });


        },

        _renderWeeklyClaimModal: function (sbProducts) {

            var data = {
                memberCode: Settings.member.code,
                products: sbProducts
            };
            var view = Managers.Template.get(this.view.sbModal, data);

            Helpers.Modal.generic(view, this.modal );

        },

        _weeklyModalClaim: function(e) {

            var self = e.data.context;
            var selected = $(self.sbProductSelections + ':checked');
            var $this = $(this);

            if ( ! selected.length) {

                Helpers.Notify.error(_.trans(self.errorMessages.noSBSelected));
                return false;

            }

            $this.prop('disabled', true);

            Helpers.Nprogress.start();


            var claimables = _.map(selected, function (el) {

                return $(el).val();

            });

            Services.Members.RebateService.weeklyClaim(claimables)
                .then(function() {

                    self._successClaimHandler(true);

                })
                .fail(function() {

                    Helpers.Notify.error(_.trans(self.errorMessages.weeklyClaimError));

                })
                .finally(function() {

                    Helpers.Nprogress.done();
                    $this.prop('disabled', false);

                }) ;

        },

        _successClaimHandler: function(instantClaim) {

            var view = Managers.Template.get(this.view.sbModalSuccess, {
                memberCode: Settings.member.code,
                instantClaim: instantClaim
            });

            Helpers.Modal.generic(view, this.modal );

        },

        _generateDailyRebateSelection: function(){

            var dateSelections = [];
            var date = moment();
            var counter = 0;
            while (counter < 7) {

                var increment_val = counter === 0 ? 0 : 1;
                var moment_date = date.subtract(increment_val, "days");
                var item = {

                    date: moment_date.format('YYYY-MM-DD'),
                    label: moment_date.format('YYYY-MM-DD')

                };

                dateSelections.push(item);
                date = moment_date;
                counter ++ ;

            }

            return dateSelections;


        }


    });

})(
    Pt.Rules,
    Pt.Contracts,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    Pt.Settings,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Created by rowen on 24/04/2017.
 */

(function (
    $,
    $q,
    FundSettings,
    Managers,
    Widgets,
    Services,
    Helpers,
    WithdrawalGatewayFactory,
    Router,
    AbstractController
) {

    'use strict';

    _.Class('Pt.Controllers.BaseWithdrawalController', BaseWithdrawalController);

    /**
     * @namespace BaseWithdrawalController
     * @memberOf Pt.Controllers
     * @constructor
     */
    function BaseWithdrawalController() {

        this.container = '[data-js=funds-container]';
        this.view = 'funds.withdrawal';

        this.transactionsView = 'funds.withdrawal_transactions';

        this.actions = [
            [ '[data-js=withdrawal-tabs] a', 'click', '_redirect' ],
            [ '[data-js=amount_selector]', 'click', '_updateAmount' ],
            [ '[data-js=cancel_transaction]', 'click', '_cancelTransaction' ],
            [ '[name=offline_withdrawal] [name=amount]', 'input', '_onBaseAmountChange'],
            [ '[name=offline_withdrawal] [name=amount]', 'keydown', '_onBaseAmountKeyDown' ]
        ];

        this.gateway = null;
        this.widgets = [];
        this.withdrawalAmount = '[data-js=withdrawalAmount]';
        this.balanceWidget = Widgets.Balance.mainBalance();
        this.resultTable = '[data-js=withdrawal_transactions]';
        this.modalConfig = {
            text: _.trans('funds.cancel_withdrawal_confirm_message'),
            confirmButton: _.trans('funds.button_proceed'),
            cancelButton: _.trans('funds.button_cancel')
        };

        this.pendingTransactions = [];

        this.requestContext = '';

    }

    BaseWithdrawalController.prototype = _.extend(AbstractController, {

        resolve: function (next) {

            var self = this;

            Helpers.Preloader.basic(self.container);

            $q.all([
                Services.Members.WalletService.getAll(),
                Services.Members.WithdrawalService.getMethods(),
                Services.Cms.WithdrawalInstructionService.init(),
                Services.Members.BankService.getBankingList(),
                Services.Members.WithdrawalService.getTransactions('pending')

            ]).then(function (res) {

                self.wallets = res[0];
                self.withdrawalMethods = res[1];
                self.bankingDetails = res[3];
                self.pendingTransactions = res[4];

            }).fail(function () {

                self.wallets = [];
                self.withdrawalMethods = [];

            }).finally(function () {

                self._bindEvents();
                next();

            });

        },

        /**
         * Initialize Controller
         * @param requestContext
         */
        init: function (requestContext) {

            Widgets.Announcements.activateCashier('withdrawal');

            var self = this;
            var methodId = requestContext.params.method;

            self.requestContext = requestContext;
            var currentMethod = _.find(self.withdrawalMethods, { methodId: methodId });

            this.balanceWidget
                .setWallets(this.wallets)
                .clearWalletIndicator()
                .activate();

            if(
                _.booleanString(
                    _.propertyValue(FundSettings,'withdrawal.allow_cancel', false)
                )
                &&
                _.size(self.pendingTransactions)
            ) {
                this._renderWithdrawalTransactions(self.pendingTransactions);
                return;
            }

            if (! this.withdrawalMethods.length) {

                var withdrawalView = Managers.Template.get(self.view, {
                    noActiveMethods: true
                });

                self.render(self.container, withdrawalView);

                return;

            }

            if (! currentMethod) {

                currentMethod = this.withdrawalMethods[0];

            }

            try {

                this.gateway = WithdrawalGatewayFactory.makeByMethod(currentMethod);

                this.gateway.bankingDetails = self.bankingDetails;

                this.gateway.resolve()
                    .then(function (settings) {

                        self.showWarningMessage = false;

                        var prefereredBankCode =  _.propertyValue(settings, 'preferredBankingDetail.bankCode');
                        var preferredBank = _.findWhere(settings.banks || [], { bankCode: prefereredBankCode });

                        if ( prefereredBankCode && ! preferredBank ) {

                            self.showWarningMessage = true;

                        }

                        var formTemplate = Managers.Template.get(self.gateway.template, {
                            settings: settings,
                            bankingDetails: self.bankingDetails,
                            withdrawalMethod: currentMethod,
                            showWarningMessage: self.showWarningMessage
                        });

                        var instructionTemplate = Services.Cms.WithdrawalInstructionService.getByMethodCode(
                            currentMethod.methodId
                        );

                        instructionTemplate = Managers.Template.compile(_.unescape(instructionTemplate), { withdrawalMethod: currentMethod });

                        var methodFundSetting = _.filter(
                            _.propertyValue(FundSettings, 'pending_accounts.methods'),
                            function(method){

                                return method.type === 'withdrawal' &&
                                    method.code === currentMethod.get('methodId') &&
                                    method.allowed === 'false';

                            }
                        );

                        //activate when active accounts only
                        if (methodFundSetting.length > 0)
                        {
                            var activeBankingDetails = _.filter(_.propertyValue(self.bankingDetails, 'regular.accounts',[]), function(bank) {

                                return bank.state.toLowerCase() === 'active';

                            });

                            if(activeBankingDetails.length === 0)
                            {
                                instructionTemplate = '';

                                formTemplate = Managers.Template.get('funds.offlineWithdrawalNoActiveBankingDetails');

                            }else
                            {

                                if(_.propertyValue(self.bankingDetails,'regular.accounts'))
                                {
                                    self.bankingDetails.regular.accounts = activeBankingDetails;
                                }

                                formTemplate = Managers.Template.get(self.gateway.template, {
                                    settings: settings,
                                    bankingDetails: self.bankingDetails,
                                    withdrawalMethod: currentMethod,
                                    showWarningMessage: self.showWarningMessage
                                });
                            }

                        }

                        var view = Managers.Template.get(self.view, {
                            noActiveMethods: false,
                            activeWithdrawalMethods: self.withdrawalMethods,
                            withdrawalMethod: currentMethod,
                            withdrawalForm: formTemplate,
                            instructionTemplate: instructionTemplate
                        });

                        self.render(self.container, view, function () {

                            self.gateway.onRenderComplete();

                        });

                    })
                    .fail(function (err) {

                        void 0;

                    });

            } catch (e) {

                void 0;

            }

        },

        /***************************************************
         * EVENT HANDLERS
         ***************************************************/

        _redirect: function (evt) {

            evt.preventDefault();

            var href = $(this).attr('href');

            if (href === location.pathname) {

                return this;

            }

            Helpers.Preloader.basic('[data-js=withdrawal-tab-container]');

            _.delay(function () {

                Router.navigate(href);

            }, 400);

        },

        _updateAmount: function (e) {

            e.preventDefault();
            e.stopPropagation();
            var _self = e.data.context;
            $(_self.container + ' ' + _self.withdrawalAmount).val($(this).attr('data-value')).trigger('change');

        },

        _cancelTransaction: function (e) {

            var self = e.data.context;
            var trans_id = $(this).attr('data-transaction_id');
            var methodId = $(this).attr('data-method_id');
            self.modalConfig.confirm = function () {

                Helpers.Nprogress.start();
                var params = {
                    invId: trans_id,
                    methodId: methodId
                };

                Services.Members.WithdrawalService.cancelTransaction(params)
                    .then(function (res) {

                        self.pendingTransactions = _.without(self.pendingTransactions, _.findWhere(self.pendingTransactions, { invId: + trans_id }));

                        if ( self.dtTableInstance ) {
                        
                            Helpers.DataTable.destroy(self.dtTableInstance);

                            $('[data-transaction_id="' + trans_id + '"]').closest('tr').remove();
                            self._initDataTable();
                        }
                        
                        if (! _.size(self.pendingTransactions) ) {

                            self.init(self.requestContext);

                        }
                        Widgets.Balance.mainBalance().refreshWalletBalance();

                    })

                    .fail(function (err) {

                        Helpers.Error.show(err);

                    })

                    .finally(function () {

                        Helpers.Nprogress.done();

                    });

            };


            Helpers.Modal.confirm(self.modalConfig);
            

        },

        _initDataTable: function () {

            var self = this;
            self.dtTableInstance = Helpers.DataTable.render(self.resultTable);

        },

        _renderWithdrawalTransactions: function(pendingTransactions) {

            var self = this;
            var transactionsView = Managers.Template.get(self.transactionsView, {
                transaction_list: pendingTransactions
            });

            self.render(self.container, transactionsView);
            self._initDataTable();

        },

        _onBaseAmountChange: function(e) {

            var self = e.data.context;

            if ( _.isIe() ) {

                $(this).val($(this).val().replace(/>|,|\s|[A-Za-z]/gi, ''));

            }

            if ( _.exceedsDecimal($(this).val(), 2) ) {

                $(this).val(self.lastAmount);

            } else {

                if ( ! _.isEmpty($(this).val()) ) {

                    self.lastAmount = $(this).val();

                }

            }

        },

        _onBaseAmountKeyDown: function(e){

            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                // Allow: Ctrl/cmd+A
                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: Ctrl/cmd+C
                (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: Ctrl/cmd+X
                (e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }

        }

    });

})(
    jQuery,
    Q,
    Pt.Settings.funds,
    Pt.Managers,
    Pt.Widgets,
    Pt.Services,
    Pt.Helpers,
    Pt.Withdrawal.WithdrawalGatewayFactory,
    Pt.Core.Router,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Created by rowen on 24/04/2017.
 */

/**
 * Created by isda on 08/08/2016.
 */

(function (
    $,
    $q,
    $s,
    Notify,
    Progress,
    Form,
    Validator,
    MemberService,
    ErrorHandler,
    Balance,
    AbstractController
) {

    "use strict";

    /**
     * @namespace Pt.Withdrawal
     */

    _.Class('Pt.Withdrawal.BaseOfflineWithdrawal', BaseOfflineWithdrawal);

    /**
     * @namespace BaseOfflineWithdrawal
     * @memberOf Pt.Withdrawal
     * @constructor
     */
    function BaseOfflineWithdrawal() {

        this.template = 'funds.offlineWithdrawal';
        this.form = "form[name=offline_withdrawal]";
        this.bankingListRadio = '[data-js=bank-detail-radio]';
        this.bankNotSupportedWarning = '[data-js=bank-not-supported-warning]';
        this.bankCode = '[data-js=bankCode]';

        this.validator = null;
        this.settings = {};
        this.method = {};

        this.actions = [
            [ this.form, 'submit', '_onFormSubmit' ],
            [ this.form + ' select[name="bankCode"]', 'change', '_onBankCodeChange' ],
            [ '[data-js=withdrawalAmount]', 'keydown', '_onAmountKeyDown' ],
            [ this.bankingListRadio, 'change', '_onBankingListRadioChange' ]
        ];

    }

    BaseOfflineWithdrawal.prototype = _.extend(AbstractController, {

        resolve: function () {

            var defer = $q.defer();
            var promises = [
                MemberService.BankService.getBanks(),
            ];

            var self = this;

            $q.all(promises)
                .then(function (res) {

                    var banks = res[0];

                    self.regularAccounts = _.propertyValue(self.bankingDetails, 'regular.accounts') || [];

                    var preferredBankingDetail = _.findWhere(self.regularAccounts, 
                        { isPreferred: true }
                    ) || self.regularAccounts[0] || {};

                    self.settings.banks = banks;

                    defer.resolve({
                        banks: banks,
                        preferredBankingDetail: preferredBankingDetail
                    });

                })
                .fail(function() {

                    defer.resolve({
                        banks: [],
                        preferredBankingDetail: {}
                    });

                });

            return defer.promise;

        },

        init: function (method, validator) {

            this.method = method;
            this.validator = validator;

        },

        /***************************************************
         * EVENT HANDLERS
         ***************************************************/

        _onBankCodeChange: function(e) {

            var $container = $("[data-js=bank-name-native-container]");

            if ($(this).val() === 'OTHER') {

                $container
                    .find('input')
                    .val('')
                    .end()
                    .show();

            } else {

                $container.hide();

            }

        },

        _onFormSubmit: function (e) {

            e.preventDefault();

            var self = e.data.context;

            self.validator.validate(self._onValidationSuccess, self);

        },

        _onValidationSuccess: function (formData, context) {

            var self = context;
            var data = formData.data;

            var bankCode = _.findWhere(data, { name: 'bankCode' });
            var bank = _.findWhere(self.settings.banks, { bankCode: bankCode.value });
            var bankNative = _.findWhere(data, { name: 'bankNameNative' });
            var amountField = _.findWhere(data, { name: 'amount' });

            data.push({ name: "bankName", value: bank.bankName });
            data.push({ name: "source", value: 'Mobile' });
            data.push({ name: "memberMobile", value: '-' });
            data.push({ name: "requestAmount", value: amountField.value });

            //OTHER
            if (_.isEmpty(bankNative.value)) {

                bankNative.value = bank.bankNameNative;

                var dataIndex = _.findIndex(data, {name:"bankName"});

                if(dataIndex > -1) {
                    data[dataIndex].value = bank.bankNameNative;
                }

            } 

            Progress.start();

            Form.lockForm(self.form, true);

            MemberService.WithdrawalService.withdraw(data)
                .then(function(response) {

                    Notify.success(
                        _.str_replace_key(
                            { ':transactionId': response.data.invId },
                            _.trans('funds.success_message_offline_withdrawal')
                        )
                        
                    );
                    self._resetForm(self.form);
                    Balance.mainBalance().refreshWalletBalance();
                    
                    //if withdrawal cancellable on application settings
                    if(
                        _.booleanString(
                            _.propertyValue($s, 'funds.withdrawal.allow_cancel', false)
                        )
                        
                    ){
                        self._initializeWithdrawalTransactions();
                    }
                    

                })
                .fail(function(error) {

                    ErrorHandler.show(error);

                })
                .finally(function() {

                    Progress.done();

                    Form.lockForm(self.form, false);

                    // reselect last radio
                    if ( self.selectedRadio ) {

                        $(self.selectedRadio).click();

                    }

                });

        },

        onRenderComplete: function () {

            this.validator
                .bindInput(true)
                .shouldSerialize(false)
                .init();

            this._bindEvents();

            // trigger bankCode change
            try {
                
                $(this.form + ' select[name="bankCode"]').trigger('change');

                var bankId = $('[name="bankDetailId"]');
    
                if(bankId && bankId.length) {
    
                    $(bankId[0]).trigger('change');
    
                }
            }catch(e){}
           

        },

        _resetForm: function (form) {

            $(form)[0].reset();

            this._setDefaultValues();

        },

        _setDefaultValues: function(){

            //member banks
            $(this.bankingListRadio).first().prop('checked', true).change();

        },

        _onAmountKeyDown: function(e) {

            var self = e.data.context;

            if (e.keyCode === 13) {

                e.preventDefault();

                $(self.form).submit();

            }

        },

        _initializeWithdrawalTransactions: function() {

            Progress.start();
            MemberService.WithdrawalService.getTransactions('pending')
                .then(function(response) {
                    var BaseWithdrawal = new Pt.Controllers.BaseWithdrawalController();
                    BaseWithdrawal._renderWithdrawalTransactions(response);
                    Progress.done();

                });

        },

        _onBankingListRadioChange: function(e) {

            var self = e.data.context;
            var id = $(this).val();
            var data = _.findWhere(self.regularAccounts, { bankAccountId: '' + id } ) || {};
           
            // populate fields with data
            _.each(data, function(value, key) {
                
                $('[data-js=' + key + ']').val(value);

            });

            $(self.bankNotSupportedWarning)[ ( _.isEmpty( $(self.bankCode).val() ) ? 'remove' : 'add' ) + 'Class' ]('hidden');

            self.selectedRadio = $(this);

        }

    });

})(
    jQuery,
    Q,
    Pt.Settings,
    Pt.Helpers.Notify,
    Pt.Helpers.Nprogress,
    Pt.Helpers.Form,
    Pt.Managers.Validation,
    Pt.Services.Members,
    Pt.Helpers.ErrorHandler,
    Pt.Widgets.Balance,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Created by bespino on 11/03/2017.
 */



(function (
    $,
    $q,
    $s,
    Notify,
    Progress,
    Form,
    Validator,
    MemberService,
    ErrorHandler,
    Balance,
    ScratchCardService,
    Template,
    AbstractController
) {

    "use strict";

    /**
     * @namespace Pt.Withdrawal
     */

    _.Class('Pt.Withdrawal.BaseScratchCard', BaseScratchCard);
    /**
     * @namespace BaseScratchCard
     * @memberOf Pt.Withdrawal
     * @constructor
     */
    function BaseScratchCard() {

        this.template = 'funds.scratchCardWithdrawal';
        this.form = "form[name=scratch_card_withdrawal]";

        this.validator = null;
        this.settings = {};
        this.method = {};
        this.methodId = '';
        this.denominations = [];
        this.cardQuantities = [];
        this.amount_source = "";
        this.quantityElem = '[data-js=quantity]';
        this.amountElem = '[data-js=amount]';
        this.actions = [
            [

                this.form, 'submit', '_onFormSubmit'
            ],
            [
                '[data-js=telco_code]', 'change', 'onTelcoChange'
            ],
            [ this.quantityElem, 'change', '_calculateTotalWithdrawal' ],
            [ this.form + ' ' + this.amountElem, 'change', '_calculateTotalWithdrawal' ]
        ];

    }

    BaseScratchCard.prototype = _.extend(AbstractController, {

        resolve: function() {

            var self = this;
            var defer = $q.defer();

            self.methodId = _.propertyValue(self.method,'methodId','0');
            var requests = [
                ScratchCardService.getDenominations(self.methodId),
                ScratchCardService.getQuantity(self.methodId),
            ];

            $q.allSettled(requests).then(function(response) {

                self.denominations = response[0].state === 'fulfilled' ?
                    response[0].value : {}

                self.cardQuantities = _.propertyValue(response[1],'value',[1]);

                defer.resolve({
                    denominations: self.denominations,
                    amount_source: self.amount_source,
                    methodId: self.methodId,
                    quantity_list: self.cardQuantities
                });

            });

            return defer.promise;

        },


        init: function (method, validator) {

            this.method = method;
            this.validator = validator;

        },
        onRenderComplete: function() {

            if ( ! this.denominations.isMultipleTelcos() ) {

                this.displayTelcoAmounts(this.denominations.getTelcos(0).vendorCode);

            }

            this.validator
                .bindInput(true)
                .shouldSerialize(false)
                .init();

            this._bindEvents();

        },

        _onFormSubmit: function(e) {

            e.preventDefault();
            var self = e.data.context;
            self.validator.validate(self._callScratchCardService, self, false);

        },
        _callScratchCardService: function(data, self) {

            var methodId = self.methodId;

            var createTransactionRequest = {
                amount: data.get('amount') || 1,
                telco: data.get('telcoCode') || 1,
                quantity: data.get('quantity') || 1,
            };

            Form.lockForm(self.form, true);

            ScratchCardService
                .createWithdrawalTransaction(createTransactionRequest, methodId)
                .then(function(invId) {

                    Notify.success(
                        _.str_replace_key({
                            ':transactionId': invId
                        }, _.trans('funds.success_message_scratchcard_withdrawal'))
                    );

                    self.resetForm(self.form);

                    Balance.mainBalance().refreshWalletBalance();

                    //if withdrawal cancellable on application settings
                    if(
                        _.booleanString(
                            _.propertyValue($s, 'funds.withdrawal.allow_cancel', false)
                        )

                    ){
                        self._initializeWithdrawalTransactions();
                    }

                })
                .fail(function(errors) {

                    ErrorHandler.show(errors);
                    Form.lockForm(self.form, false);

                })

        },

        onTelcoChange: function(e) {

            var self = e.data.context;
            var code = e.target.value;

            self.displayTelcoAmounts(code);

        },

        displayTelcoAmounts: function(code) {

            var amounts = this.denominations.getTelcoAmounts(code);

            var view = Template.get('funds.scratchCardAmounts', {
                amounts: amounts
            });

            this.render('[data-js=amount]', view);

        },

        resetForm: function() {

            $(this.form)[0].reset();
            $(this.amountElem).trigger('change');

        },
        _initializeWithdrawalTransactions: function() {

            Progress.start();
            MemberService.WithdrawalService.getTransactions('pending')
                .then(function(response) {
                    var BaseWithdrawal = new Pt.Controllers.BaseWithdrawalController();
                    BaseWithdrawal._renderWithdrawalTransactions(response);
                    Progress.done();

                });

        },
        _calculateTotalWithdrawal: function(e){

            var self = e.data.context;
            var quantity = $(self.quantityElem).val() ? $(self.quantityElem).val() : 0;
            var amount = $(self.amountElem).val() ? $(self.amountElem).val() : 0;

            $('[data-js=total-withdrawal-wrapper]').html( _.toCurrency(amount * quantity));
        }

    });

})(
    jQuery,
    Q,
    Pt.Settings,
    Pt.Helpers.Notify,
    Pt.Helpers.Nprogress,
    Pt.Helpers.Form,
    Pt.Managers.Validation,
    Pt.Services.Members,
    Pt.Helpers.ErrorHandler,
    Pt.Widgets.Balance,
    Pt.Services.Members.ScratchCardService,
    Pt.Managers.Template,
    _.clone(Pt.Controllers.AbstractController)
);
(function (
    BaseScratchCard,
    Template,
    $v,
    Form,
    ScratchCardService,
    ErrorHandler,
    Notify,
    Balance,
    $s
) {
    'use strict';

    _.Class('Pt.Withdrawal.BaseGamecard', BaseGamecard);

    /**
     * @namespace Pt.Withdrawal
     */
    function BaseGamecard() {

        BaseScratchCard.call(this);

        this.template = 'funds.gamecardWithdrawal';

        this.gamecardAmountsTpl = 'funds.gamecardAmounts';
        this.gamecardItemEl = '.gamecard-item';

        this.amounts = [
            {
                amount: '',
                quantity: ''
            }
        ];

        this.addMoreElem = 'a[data-js=add-more]';
        this.removeAmountElem = 'a[data-js=remove-amount]';

        this.actions = _.union(
            this.actions,
            [
                [ this.addMoreElem, 'click', '_onAddMore' ],
                [ this.removeAmountElem, 'click', '_onRemoveAmount' ]
            ]
        );

    }

    BaseGamecard.prototype = Object.create(BaseScratchCard.prototype);

    _.extend(BaseGamecard.prototype, {

        constructor: BaseGamecard,

        /**
         * Overrides BaseScratchCard.displayTelcoAmounts()
         * 
         * @param {String} code 
         * @returns {undefined}
         */
        displayTelcoAmounts: function(code) {

            var self = this,
                view = Template.get(self.gamecardAmountsTpl, {
                    telcoAmounts: self.denominations.getTelcoAmounts(code),
                    cardQuantities: self.cardQuantities,
                    userAmounts: self.amounts,
                    methodId: self.methodId
                });

            self.render('[data-js=gamecard-amounts', view);

            if (self.amounts.length < 5) {
                $(self.addMoreElem).parent().removeClass('hide');
            } else {
                $(self.addMoreElem).parent().addClass('hide');
            }
        },

        /**
         * Overrides BaseScratchCard._callScratchCardService()
         * 
         * @param {Event} e 
         * @returns {undefined}
         */
        _onFormSubmit: function(e) {

            e.preventDefault();

            var self = e.data.context,
                errors = self._validate();
            
            if (errors.length) {
                self._displayErrors(errors);
            } else {
                var data = new FormData($(self.form)[0]);
                self._callScratchCardService(data, self);
            }
        },

        /**
         * Overrides BaseScratchCard._callScratchCardService()
         * 
         * @param {FormData} data 
         * @param {BaseGamecard} self
         * @returns {undefined}
         */
        _callScratchCardService: function(data, self) {

            var methodId = self.methodId,
                body = {
                    amount: self.amounts,
                    telco: data.get('telcoCode') || 1
                };

            Form.lockForm(self.form, true);

            ScratchCardService
                .createWithdrawalTransaction(body, methodId)
                .then(function(invId) {
                    Notify.success(
                        _.str_replace_key({
                            ':transactionId': invId
                        }, _.trans('funds.success_message_scratchcard_withdrawal'))
                    );

                    self.resetForm(self.form);

                    Balance.mainBalance().refreshWalletBalance();

                    if (_.booleanString(_.propertyValue($s, 'funds.withdrawal.allow_cancel', false))) {
                        self._initializeWithdrawalTransactions();
                    }
                })
                .fail(function(errors) {
                    ErrorHandler.show(errors);
                    Form.lockForm(self.form, false);
                });
        },

        /**
         * Overrides BaseScratchCard.resetForm()
         * 
         * @param {String} form 
         * @returns {undefined}
         */
        resetForm: function(form) {

            $(form)[0].reset();
            $(this.amountElem).trigger('change');
            
            this.amounts = [
                {
                    amount: '',
                    quantity: ''
                }
            ];

            this.displayTelcoAmounts(this.denominations.getTelcos(0).vendorCode);
        },

        /**
         * Custom validation since the default/regular
         * does not support multiple values with same name.
         * 
         * @returns {Array}
         */
        _validate: function() {

            var self = this,
                constraints = self.validator.getRules(),
                errors = [],
                error;

            $('select[name=amount], select[name=quantity]').each(function(i, el) {
                var _val = {},
                    _constraint = {};
                
                _val[el.name] = el.value || null;
                _constraint[el.name] = constraints[el.name];

                error = $v(_val, _constraint) || {};

                if (! _.isEmpty(error)) {
                    errors.push({
                        selector: el.id || el.name,
                        message: error[el.name][0]
                    });
                }
            });
            
            return errors;
        },

        /**
         * Display validation errors
         * 
         * @param {Array} errors 
         * @returns {undefined}
         */
        _displayErrors: function(errors) {
            var self = this,
                tpl = '<label class="error" for=":el">' +
                    '<span class="glyphicon glyphicon-remove"></span>' +
                    '<small class="caption">:caption</small>' +
                    '</label>',
                field,
                html;

            _.each(errors, function(error) {
                
                field = $(self.form).find('#' + error.selector);
                
                if (field) {
                    html = _.str_replace_key({
                        ':el': error.selector,
                        ':caption': error.message
                    }, tpl);

                    field.next('label.error').remove();
                    field.addClass('error');
                    field.after(html);
                }
            });
        },

        /**
         * Overrides BaseScratchCard._calculateTotalWithdrawal()
         * 
         * @param {Object} e 
         * @returns {undefined}
         */
        _calculateTotalWithdrawal: function(e) {

            var self = e.data.context,
                index = + $(this).parents(self.gamecardItemEl).data('gamecard-index'),
                name = $(this).attr('name');

            if (! isNaN(index) && self.amounts[index] !== undefined) {
                self.amounts[index][name] = $(this).val();

                self._updateTotalWithdrawalDisplay();
            }
        },

        /**
         * Computes for total withdrawal and updates display.
         * 
         * @returns {undefined}
         */
        _updateTotalWithdrawalDisplay: function() {

            var total = 0,
                a, q;

            _.each(this.amounts, function(amount) {
                a = amount.amount || 0;
                q = amount.quantity || 0;

                total += a * q;
            });

            $('[data-js=total-withdrawal-wrapper]').html( _.toCurrency(total));
        },

        /**
         * 'Add More' click event handler.
         * 
         * @param {Object} e 
         * @returns {undefined}
         */
        _onAddMore: function(e) {
            
            e.preventDefault();

            var self = e.data.context;

            if (self.amounts.length >= 5) {
                return;
            }

            self.amounts.push({
                amount: '',
                quantity: ''
            });

            self.displayTelcoAmounts(self.denominations.getTelcos(0).vendorCode);
        },

        /**
         * 'Remove' click event handler.
         * 
         * @param {Object} e 
         * @returns {undefined}
         */
        _onRemoveAmount: function(e) {

            e.preventDefault();

            var self = e.data.context,
                index = $(this).parents(self.gamecardItemEl).data('gamecard-index');

            if (! isNaN(index) && self.amounts[index] !== undefined) {                
                self.amounts.splice(index, 1);
                self.displayTelcoAmounts(self.denominations.getTelcos(0).vendorCode);
                $(self.amountElem).trigger('change');
            }
        }

    });

})(
    Pt.Withdrawal.BaseScratchCard,
    Pt.Managers.Template,
    window.validate,
    Pt.Helpers.Form,
    Pt.Services.Members.ScratchCardService,
    Pt.Helpers.ErrorHandler,
    Pt.Helpers.Notify,
    Pt.Widgets.Balance,
    Pt.Settings
);

/**
 * Abstract Profile Controller
 * Created by isda on 12/07/2016.
 */


(function ( $,
            $q,
            _,
            Helpers,
            Widgets,
            Managers,
            Services,
            Config,
            $absController
) {

    "use strict";


    /**
     * @namespace Pt.Controllers.AbstractHistoryController
     */
    function AbstractHistoryController() {


        this.container = '[data-js=funds-container]';
        this.resultContainer = '[data-js=history-result-container]';
        this.resultTable = '[data-js=history-result-table]';
        this.balance = Widgets.Balance.mainBalance();
        this.validator = null;
        this.wallets = [];
        this.restrictDate = true;

    }

    AbstractHistoryController.prototype = _.extend($absController, {

        resolve: function () {

            var defer = Q.defer();

            defer.resolve();

            return defer.promise;

        },

        onFormSubmit: function (e) {

            e.preventDefault();

            var self = e.data.context;

            self.validator.validate(self._onValidationSuccess, self);


        },

        _initDataTable: function (res) {

            if (! _.isEmpty(res)) {

                this.dTableInstance = Helpers.DataTable.render(this.resultTable);

            }

            return this;

        },

        initPlugins: function () {
            
            var $rangepickers = $('.input-daterange');

            if ( ! this.restrictDate ) {

                Helpers.DatePicker.activate($rangepickers, {
                    format: "yyyy-mm-dd",
                    todayHighlight: true,
                    toggleActive: false,
                    language: Managers.Cookie.get('lang')
                }, Config.datePickerLocale[Managers.Cookie.get('lang')]);

            } else {

                var addDay = moment(new Date()).subtract(3, 'months').get('date') < moment(new Date()).get('date');
                var startDate = moment(new Date()).subtract(3, 'months').add( ( addDay ? 1 : 0 ), 'days')._d;

                Helpers.DatePicker.activate($rangepickers, {
                    format: "yyyy-mm-dd",
                    startDate: startDate,
                    endDate: new Date(),
                    todayHighlight: true,
                    toggleActive: false,
                    language: Managers.Cookie.get('lang')
                }, Config.datePickerLocale[Managers.Cookie.get('lang')]);

            }

        }

    });

    _.Class('Pt.Controllers.AbstractHistoryController', AbstractHistoryController);

})(
    jQuery,
    Q,
    _,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    Pt.Config,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * History Factory Controller
 * Created by isda on 10/04/2017.
 */

(function (_) {

    "use strict";

    var instances = {};

    _.Class('Pt.History.Factory', HistoryFactory());

    /**
     * @namespace HistoryFactory
     * @memberOf Pt.History
     * @returns {{ make: make }}
     * @constructor
     */
    function HistoryFactory() {

        var historyModules = {
            'deposit-withdrawal': 'DepositWithdrawal',
            'fund-transfer': 'FundTransfer',
            'adjustments': 'Adjustments',
            'referral-bonus': 'ReferralBonus',
            'promotions': 'Promotions'
        };

        if ( Pt.Settings.operator.msId === '49' ) {

            _.extend(historyModules,{
                'self-limit': 'SelfLimit',
                'self-exclusion': 'SelfExclusion'
            });

        }

        if (Pt.Settings.operator.msId === '48') {
            _.extend(historyModules, {
                'spinwheel-redemptions': 'SpinwheelRedemptions'
            });
        }

        return {
            make: make,
            getModules: getModules,
            setCustomModules: setCustomModules
        };

        ////////////////////////////////

        function make(type) {

            var module = historyModules[type];

            if (module) {

                if (!_.isEmpty(instances[module])) {

                    return instances[module];

                }

                var i = new Pt.History[module]();

                instances[module] = i;

                return i;

            }

        }


        function getModules() {

            return historyModules;

        }

        function setCustomModules(modules) {

            _.extend(historyModules,modules);

        }

    }

})(_);
/**
 * @namespace Pt.History
 * History Controller
 * Created by isda on 10/04/2017.
 */


(function (
    HistoryFactory,
    Services,
    absFundsCtrl
) {

    "use strict";

    _.Class('Pt.Controllers.BaseHistoryController', BaseHistoryController);

    /**
     * @namespace Pt.Controllers.BaseHistoryController
     * @constructor
     */
    function BaseHistoryController() {

        this.wallets = null;
        this.customModules = {};

    }

    BaseHistoryController.prototype = _.extend(absFundsCtrl, {

        resolve: function (next) {

            var self = this;

            Services.Members.WalletService.getAll()
                .then(function (res) {

                    self.wallets = res;

                })
                .fail(function () {

                    self.wallets = [];

                })
                .finally(function () {

                    next();

                });

        },

        init: function (requestContext) {

            var self = this;
            var module = requestContext.params.type  || 'deposit-withdrawal';

            HistoryFactory.setCustomModules(self.customModules);
            this.historyInstance = HistoryFactory.make(module);
            this.historyInstance = _.extend(this.historyInstance, {

                active: module,
                modules: HistoryFactory.getModules(),
                wallets: this.wallets

            });

            this.historyInstance.resolve({

                requestContext: requestContext

            }).then(function () {

                self.historyInstance.init(self.el);

            });

        }

    });

})(
    Pt.History.Factory,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractFundsController)
);
/**
 * Deposit Withdrawal Controller
 * Created by isda on 10/04/2017.
 */

(function () {

    'use strict';

    (function (Q,
               Settings,
               Rules,
               Contracts,
               Helpers,
               Widgets,
               Managers,
               Services,
               absHistoryCtrl) {

        "use strict";

        _.Class('Pt.History.BaseDepositWithdrawal', BaseDepositWithdrawal);

        /**
         * @namespace Pt.History.BaseDepositWithdrawal
         * @constructor
         */
        function BaseDepositWithdrawal() {

            this.form = '[data-js=deposit-withdrawal-form]';

            this.actions = [

                [this.form, 'submit', 'onFormSubmit']
            ];

        }

        BaseDepositWithdrawal.prototype = _.extend(absHistoryCtrl, {

            init: function () {

                this.balance
                    .setWallets(this.wallets)
                    .clearWalletIndicator()
                    .activate();

                var view = Managers.Template.get('funds.history', {
                    modules: this.modules,
                    active: this.active,
                    historyForm: Managers.Template.get('funds.depositWithdrawalHistory')
                });

                this.render(this.container, view);

                this.initPlugins();

                this.validator = new Managers.Validation(this.form, Rules.validation.history);
                this.validator
                    .bindInput(true)
                    .init();

                this._bindEvents();

            },

            _onValidationSuccess: function (data) {

                var self = this;
                var query = {};

                _.each(data, function (item) {

                    query[item.name] = item.value;

                });

                self.secureFormRequest(self.form, true);

                Helpers.Nprogress.start();

                Services.Members.HistoryService.getDepositWithdrawal(query)
                    .then(function (res) {

                        var view = Managers.Template.get('funds.depositWithdrawalHistoryResult', {

                            histories: res,
                            currency: Settings.member.currency

                        });

                        self.render(self.resultContainer, view);

                        self._initDataTable(res);


                    })

                    .fail(function (err) {

                        Helpers.Error.show(err);

                    })

                    .finally(function () {

                        self.secureFormRequest(self.form, false, false);
                        Helpers.Nprogress.done();

                    });

            }

        });

    })(
        Q,
        Pt.Settings,
        Pt.Rules,
        Pt.Contracts,
        Pt.Helpers,
        Pt.Widgets,
        Pt.Managers,
        Pt.Services,
        new Pt.Controllers.AbstractHistoryController
    );

})();
/**
 * Deposit Withdrawal Controller
 * Created by isda on 10/04/2017.
 */

(function () {

    'use strict';

    (function (
        Q,
        Rules,
        Settings,
        Contracts,
        Helpers,
        Widgets,
        Managers,
        Services,
        absCtrl
    ) {

        "use strict";

        _.Class('Pt.History.BaseAdjustments', Adjustments);

        /**
         * @namespace Pt.History.Adjustments
         * @constructor
         */
        function Adjustments() {

            this.form = '[data-js=adjustments-history-form]';

            this.actions = [

                [this.form, 'submit', 'onFormSubmit']
            ];

        }

        Adjustments.prototype = _.extend(absCtrl, {

            init: function () {

                this.balance
                    .setWallets(this.wallets)
                    .activate();

                var view = Managers.Template.get('funds.history', {
                    modules: this.modules,
                    active: this.active,
                    historyForm: Managers.Template.get('funds.adjustmentsHistory')
                });

                this.render(this.container, view);

                this.initPlugins();

                this.validator = new Managers.Validation(this.form, Rules.validation.history);
                this.validator
                    .bindInput(true)
                    .init();

                this._bindEvents();

            },

            _onValidationSuccess: function (data) {

                var self = this;
                var query = {};

                _.each(data, function (item) {

                    query[item.name] = item.value;

                });

                self.secureFormRequest(self.form, true);

                Helpers.Nprogress.start();

                Services.Members.HistoryService.getAdjustments(query)
                    .then(function (res) {

                        var view = Managers.Template.get('funds.adjustmentsHistoryResult', {

                            histories: res,
                            currency: Settings.member.currency

                        });

                        self.render(self.resultContainer, view);

                        self._initDataTable(res);

                    })

                    .fail(function (err) {

                        Helpers.Error.show(err);

                    })

                    .finally(function () {

                        self.secureFormRequest(self.form, false, false);
                        Helpers.Nprogress.done();

                    });

            }

        });

    })(
        Q,
        Pt.Rules,
        Pt.Settings,
        Pt.Contracts,
        Pt.Helpers,
        Pt.Widgets,
        Pt.Managers,
        Pt.Services,
        new Pt.Controllers.AbstractHistoryController
    );

})();
/**
 * Deposit Withdrawal Controller
 * Created by isda on 10/04/2017.
 */

(function () {

    'use strict';

    (function (
        Q,
        Rules,
        Settings,
        Contracts,
        Helpers,
        Widgets,
        Managers,
        Services,
        absCtrl
    ) {

        "use strict";

        _.Class('Pt.History.BaseFundTransfer', FundTransfer);

        /**
         * @namespace Pt.History.FundTransfer
         * @constructor
         */
        function FundTransfer() {

            this.form = '[data-js=fund-transfer-history-form]';

            this.actions = [

                [this.form, 'submit', 'onFormSubmit']
            ];

        }

        FundTransfer.prototype = _.extend(absCtrl, {

            init: function () {

                this.balance
                    .setWallets(this.wallets)
                    .activate();

                var view = Managers.Template.get('funds.history', {
                    modules: this.modules,
                    active: this.active,
                    historyForm: Managers.Template.get('funds.fundTransferHistory', {
                        wallets: this.wallets
                    })
                });

                this.render(this.container, view);

                this.initPlugins();

                this.validator = new Managers.Validation(this.form, Rules.validation.history);
                this.validator
                    .bindInput(true)
                    .init();

                this._bindEvents();

            },

            _onValidationSuccess: function (data) {

                var self = this;
                var query = {};

                _.each(data, function (item) {

                    query[item.name] = item.value;

                });

                self.secureFormRequest(self.form, true);

                Helpers.Nprogress.start();

                Services.Members.HistoryService.getFundTransfer(query)
                    .then(function (res) {

                        var view = Managers.Template.get('funds.fundTransferHistoryResult', {

                            histories: res,
                            currency: Settings.member.currency

                        });

                        self.render(self.resultContainer, view);

                        self._initDataTable(res);

                    })

                    .fail(function (err) {

                        Helpers.Error.show(err);

                    })

                    .finally(function () {

                        self.secureFormRequest(self.form, false, false);
                        Helpers.Nprogress.done();

                    });

            }

        });

    })(
        Q,
        Pt.Rules,
        Pt.Settings,
        Pt.Contracts,
        Pt.Helpers,
        Pt.Widgets,
        Pt.Managers,
        Pt.Services,
        new Pt.Controllers.AbstractHistoryController
    );

})();
/**
 * Deposit Withdrawal Controller
 * Created by isda on 10/04/2017.
 */

(function () {

    'use strict';

    (function (
        Q,
        Rules,
        Contracts,
        Helpers,
        Widgets,
        Managers,
        Services,
        absCtrl
    ) {

        "use strict";

        _.Class('Pt.History.BasePromotions', Promotions);

        /**
         * @namespace Pt.History.Promotions
         * @constructor
         */
        function Promotions() {

            this.form = '[data-js=promotions-history-form]';

            this.actions = [

                [this.form, 'submit', 'onFormSubmit']
            ];

        }

        Promotions.prototype = _.extend(absCtrl, {

            init: function () {

                this.balance
                    .setWallets(this.wallets)
                    .activate();

                var view = Managers.Template.get('funds.history', {
                    modules: this.modules,
                    active: this.active,
                    historyForm: Managers.Template.get('funds.promotionsHistory',{
                        wallets: this.wallets
                    })
                });

                this.render(this.container, view);

                this.initPlugins();

                this.validator = new Managers.Validation(this.form, Rules.validation.history);
                this.validator
                    .bindInput(true)
                    .init();

                this._bindEvents();

            },

            _onValidationSuccess: function (data) {

                var self = this;
                var query = {};

                _.each(data, function (item) {

                    query[item.name] = item.value;

                });

                self.secureFormRequest(self.form, true);

                Helpers.Nprogress.start();

                var promises = [
                    Services.Members.HistoryService.getPromotions(query),
                    Services.Members.HistoryService.getPromotionsPage(query)
                ] ;

                Q.all(promises).then(function (res) {
                    
                        var view = Managers.Template.get('funds.promotionsHistoryResult', {

                            histories: res,
                            currency: Pt.Settings.member.currency

                        }),
                        promoPageClaimTbl = '[data-js=history-result-promo-claim-table]';

                        self.render(self.resultContainer, view);

                        self._initDataTable(res[0]);

                        if(! _.isEmpty(res[1])) {

                            Helpers.DataTable.render(promoPageClaimTbl);
                        }
                        

                    })

                    .fail(function (err) {

                        Helpers.Error.show(err);

                    })

                    .finally(function () {

                        self.secureFormRequest(self.form, false, false);
                        Helpers.Nprogress.done();

                    });

            }

        });

    })(
        Q,
        Pt.Rules,
        Pt.Contracts,
        Pt.Helpers,
        Pt.Widgets,
        Pt.Managers,
        Pt.Services,
        new Pt.Controllers.AbstractHistoryController
    );

})();
/**
 * Deposit Withdrawal Controller
 * Created by isda on 10/04/2017.
 */

(function () {

    'use strict';

    (function (
        Q,
        Rules,
        Settings,
        Contracts,
        Helpers,
        Widgets,
        Managers,
        Services,
        absCtrl
    ) {

        "use strict";

        _.Class('Pt.History.BaseReferralBonus', ReferralBonus);

        /**
         * @namespace Pt.History.ReferralBonus
         * @constructor
         */
        function ReferralBonus() {

            this.form = '[data-js=referral-history-form]';
            this.reports = {};

            this.actions = [

                [this.form, 'submit', 'onFormSubmit']
            ];

        }

        ReferralBonus.prototype = _.extend(absCtrl, {

            fetch: function () {

                var self = this;
                var defer = Q.defer();

                Services.Members.HistoryService.getReferralBonus({
                        from: moment().format('YYYY-MM-DD'),
                        to: moment().format('YYYY-MM-DD')
                    })
                    .then( function (res) {

                        self.bonusHistory = !_.isEmpty(res) ? res[0] : new Contracts.ReferralBonusHistory();

                    })

                    .fail (function () {

                        self.bonusHistory = new Contracts.ReferralBonusHistory();

                    })
                    .finally(function () {

                        defer.resolve();

                    });

                return defer.promise;

            },

            init: function () {

                var self = this;

                this.balance
                    .setWallets(this.wallets)
                    .activate();


                this.fetch()
                    .then(function () {

                        var view = Managers.Template.get('funds.history', {
                            modules: self.modules,
                            active: self.active,
                            historyForm: Managers.Template.get('funds.referralBonusHistory', {
                                currency: Settings.member.currency,
                                bonusHistory: self.bonusHistory
                            })
                        });

                        self.render(self.container, view);

                        self.initPlugins();

                        self.validator = new Managers.Validation(self.form, Rules.validation.history);
                        self.validator
                            .bindInput(true)
                            .init();

                        self._bindEvents();

                    });

            },

            _onValidationSuccess: function (data) {

                var self = this;
                var query = {};

                _.each(data, function (item) {

                    query[item.name] = item.value;

                });

                self.secureFormRequest(self.form, true);

                Helpers.Nprogress.start();

                Services.Members.HistoryService.getReferralBonus(query)
                    .then(function (res) {

                        var view = Managers.Template.get('funds.referralBonusHistoryResult', {

                            histories: res,
                            currency: Settings.member.currency

                        });

                        self.render(self.resultContainer, view);

                        if(res.length > 0 && res[0].transactionId){

                            self._initDataTable(res);
                        }

                    })

                    .fail(function (err) {

                        Helpers.Error.show(err);

                    })

                    .finally(function () {

                        self.secureFormRequest(self.form, false, false);
                        Helpers.Nprogress.done();

                    });

            }

        });

    })(
        Q,
        Pt.Rules,
        Pt.Settings,
        Pt.Contracts,
        Pt.Helpers,
        Pt.Widgets,
        Pt.Managers,
        Pt.Services,
        new Pt.Controllers.AbstractHistoryController
    );

})();
(function(
    Q,
    Settings,
    Rules,
    Contracts,
    Helpers,
    Widgets,
    Managers,
    Services,
    absHistoryCtrl
) {

    'use strict';

    _.Class('Pt.History.BaseSpinwheelRedemptions', BaseSpinwheelRedemptions);

    /**
     * @namespace Pt.History.BaseSpinwheelRedemptions
     * @constructor
     */
    function BaseSpinwheelRedemptions() {

        this.form = '[data-js=spinwheel-redemptions-form]';

        this.actions = [
            [this.form, 'submit', 'onFormSubmit']
        ];

    }

    BaseSpinwheelRedemptions.prototype = Object.create(absHistoryCtrl);

    _.extend(BaseSpinwheelRedemptions.prototype, {

        constructor: BaseSpinwheelRedemptions,

        init: function () {

            this.balance
                .setWallets(this.wallets)
                .clearWalletIndicator()
                .activate();

            var view = Managers.Template.get('funds.history', {
                modules: this.modules,
                active: this.active,
                historyForm: Managers.Template.get('funds.spinwheelRedemptions')
            });

            this.render(this.container, view);

            this.initPlugins();

            this.validator = new Managers.Validation(this.form, Rules.validation.history);
            this.validator
                .bindInput(true)
                .init();

            this._bindEvents();

        },

        _onValidationSuccess: function (data) {

            var self = this
                , query = {};

            _.each(data, function (item) {
                query[item.name] = item.value;
            });

            self.secureFormRequest(self.form, true);

            Helpers.Nprogress.start();

            Services.Members.HistoryService.getSpinwheelRedemptions(query)
                .then(function (response) {
                    var view = Managers.Template.get('funds.spinwheelRedemptionsResult', {
                        redemptions: response,
                    });

                    self.render(self.resultContainer, view);

                    self._initDataTable(response);
                })
                .fail(function (err) {
                    Helpers.Error.show(err);
                })
                .finally(function () {
                    self.secureFormRequest(self.form, false, false);
                    Helpers.Nprogress.done();
                });
        }

    });
})(
    Q,
    Pt.Settings,
    Pt.Rules,
    Pt.Contracts,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    new Pt.Controllers.AbstractHistoryController
);


/**
 * Funds Transfer Controller
 * Created by isda on 13/12/2016.
 */
(function (
    Rules,
    Contracts,
    Helpers,
    Widgets,
    Managers,
    Services,
    _baseFundTransferController
) {

_.Class('Pt.Controllers.FundTransferController', FundTransferController);

/**
         * Home Controller
         * @namespace Pt.Controllers.FundTransferController
         * @constructor
         */
function FundTransferController() {

    function Class() {

        _baseFundTransferController.call(this);

    }

    Class.prototype = Object.create(_baseFundTransferController.prototype);
    Class.prototype.constructor = Class;

    _.extend(Class.prototype, {

    }, Pt.Core.Extend('Controllers.FundTransferController'));

    return new Class();

}

})(
    Pt.Rules,
        Pt.Contracts,
        Pt.Helpers,
        Pt.Widgets,
        Pt.Managers,
        Pt.Services,
        Pt.Controllers.BaseFundTransferController
);
/**
 * Created by rowen on 19/04/2017.
 */

(function (BaseDepositController) {

    _.Class('Pt.Controllers.DepositController', DepositController);

    /**
     * Deposit Controller
     * @namespace Pt.Controllers.DepositController
     * @constructor
     */
    function DepositController() {

        function Class() {

            BaseDepositController.call(this);

        }

        Class.prototype = Object.create(BaseDepositController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Controllers.DepositController'));

        return new Class();

    }

})(
    Pt.Controllers.BaseDepositController
);

/**
 * Created by rowen on 19/04/2017.
 */

(function (BaseBasicDeposit) {

    _.Class('Pt.Deposit.BasicDeposit', BasicDeposit);

    /**
     * BasicDeposit
     * @namespace BasicDeposit
     * @memberOf Pt.Deposit
     * @constructor
     */
    function BasicDeposit() {

        function Class() {

            BaseBasicDeposit.call(this);

        }

        Class.prototype = Object.create(BaseBasicDeposit.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Deposit.BasicDeposit'));

        return new Class();

    }

})(
    Pt.Deposit.BaseBasicDeposit
);
/**
 * Created by rowen on 20/04/2017.
 */

(function (BaseBankTransfer) {

    _.Class('Pt.Deposit.BankTransfer', BankTransfer);

    /**
     * BankTransfer
     * @namespace BankTransfer
     * @memberOf Pt.Deposit
     * @constructor
     */
    function BankTransfer() {

        function Class() {

            BaseBankTransfer.call(this);

        }

        Class.prototype = Object.create(BaseBankTransfer.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Deposit.BankTransfer'));

        return new Class();

    }

})(
    Pt.Deposit.BaseBankTransfer
);
/**
 * Created by rowen on 19/04/2017.
 */

(function (BaseOfflineDeposit) {

    _.Class('Pt.Deposit.OfflineDeposit', OfflineDeposit);

    /**
     * OfflineDeposit
     * @namespace OfflineDeposit
     * @memberOf Pt.Deposit
     * @constructor
     */
    function OfflineDeposit() {

        function Class() {

            BaseOfflineDeposit.call(this);

            this.view = 'funds.offlineDepositWithCard';

        }

        Class.prototype = Object.create(BaseOfflineDeposit.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Deposit.OfflineDeposit'));

        return new Class();

    }

})(
    Pt.Deposit.BaseOfflineDeposit
);

/**
 * Created by bespino on 01/05/2018.
 */

(function (BaseOfflineTransferDeposit) {

    _.Class('Pt.Deposit.OfflineTransferDeposit', OfflineTransferDeposit);

    /**
     * OfflineTransferDeposit
     * @namespace OfflineTransferDeposit
     * @memberOf Pt.Deposit
     * @constructor
     */
    function OfflineTransferDeposit() {

        function Class() {

            BaseOfflineTransferDeposit.call(this);

        }

        Class.prototype = Object.create(BaseOfflineTransferDeposit.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Deposit.OfflineTransferDeposit'));

        return new Class();

    }

})(
    Pt.Deposit.BaseOfflineTransferDeposit
);

/**
 * Created by rowen on 19/04/2017.
 */

(function (BaseAlipayTransferDeposit) {

    _.Class('Pt.Deposit.AlipayTransferDeposit', AlipayTransferDeposit);

    /**
     * AlipayTransferDeposit
     * @namespace AlipayTransferDeposit
     * @memberOf Pt.Deposit
     * @constructor
     */
    function AlipayTransferDeposit() {

        function Class() {

            BaseAlipayTransferDeposit.call(this);

        }

        Class.prototype = Object.create(BaseAlipayTransferDeposit.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Deposit.AlipayTransferDeposit'));

        return new Class();

    }

})(
    Pt.Deposit.BaseAlipayTransferDeposit
);
/**
 * Freebet Controller
 * Created by isda on 13/12/2016.
 */

(function (_baseFreeBetController) {

        _.Class('Pt.Controllers.FreeBetController', FreeBetController);

        /**
         * Home Controller
         * @namespace Pt.Controllers.FreeBetController
         * @constructor
         */
        function FreeBetController() {

            function Class() {

                _baseFreeBetController.call(this);

            }

            Class.prototype = Object.create(_baseFreeBetController.prototype);
            Class.prototype.constructor = Class;

            _.extend(Class.prototype, {

            }, Pt.Core.Extend('Controllers.FreeBetController'));

            return new Class();

        }

    }
)(
    Pt.Controllers.BaseFreeBetController
);

/**
 * Rebate Controller
 * Created by isda on 12/04/2017.
 */


(function (_baseRebateController) {

        _.Class('Pt.Controllers.RebateController', RebateController);

        /**
         * Home Controller
         * @namespace Pt.Controllers.RebateController
         * @constructor
         */
        function RebateController() {

            function Class() {

                _baseRebateController.call(this);

            }

            Class.prototype = Object.create(_baseRebateController.prototype);
            Class.prototype.constructor = Class;

            _.extend(Class.prototype, {

            }, Pt.Core.Extend('Controllers.RebateController'));

            return new Class();

        }

    }
)(
    Pt.Controllers.BaseRebateController
);

/**
 * Created by rowen on 24/04/2017.
 */

(function (
    Managers,
    Widgets,
    Services,
    Helpers,
    WithdrawalGatewayFactory,
    BaseWithdrawalController) {

    _.Class('Pt.Controllers.WithdrawalController', WithdrawalController);

    /**
     * @namespace WithdrawalController
     * @memberOf Pt.Controllers
     * @constructor
     */
    function WithdrawalController() {

        function Class() {

            BaseWithdrawalController.call(this);

        }

        Class.prototype = Object.create(BaseWithdrawalController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Controllers.WithdrawalController'));

        return new Class();


    }

})(
    Pt.Managers,
    Pt.Widgets,
    Pt.Services,
    Pt.Helpers,
    Pt.Withdrawal.WithdrawalGatewayFactory,
    Pt.Controllers.BaseWithdrawalController
);
/**
 * Created by rowen on 24/04/2017.
 */

(function (
    Notify,
    Progress,
    Form,
    MemberService,
    ErrorHandler,
    BaseOfflineWithdrawal) {

    _.Class('Pt.Withdrawal.OfflineWithdrawal', OfflineWithdrawal);

    /**
     * OfflineWithdrawal
     * @namespace OfflineWithdrawal
     * @memberOf Pt.Withdrawal
     * @constructor
     */
    function OfflineWithdrawal() {

        function Class() {

            BaseOfflineWithdrawal.call(this);

        }

        Class.prototype = Object.create(BaseOfflineWithdrawal.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Withdrawal.OfflineWithdrawal'));

        return new Class();

    }

})(
    Pt.Helpers.Notify,
    Pt.Helpers.Nprogress,
    Pt.Helpers.Form,
    Pt.Services.Members,
    Pt.Helpers.ErrorHandler,
    Pt.Withdrawal.BaseOfflineWithdrawal
);

(function (
    Notify,
    Progress,
    Form,
    MemberService,
    ErrorHandler,
    BaseScratchCard) {

    _.Class('Pt.Withdrawal.ScratchCard', ScratchCard);

    /**
     * OfflineWithdrawal
     * @namespace OfflineWithdrawal
     * @memberOf Pt.Withdrawal
     * @constructor
     */
    function ScratchCard() {

        function Class() {

            BaseScratchCard.call(this);

        }

        Class.prototype = Object.create(BaseScratchCard.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Withdrawal.ScratchCard'));

        return new Class();

    }

})(
    Pt.Helpers.Notify,
    Pt.Helpers.Nprogress,
    Pt.Helpers.Form,
    Pt.Services.Members,
    Pt.Helpers.ErrorHandler,
    Pt.Withdrawal.BaseScratchCard
);
(function (
    BaseGamecard
) {
    'use strict';

    _.Class('Pt.Withdrawal.Gamecard', Gamecard);

    /**
     * @namespace Pt.Withdrawal
     */
    function Gamecard() {

        BaseGamecard.call(this);

    }

    Gamecard.prototype = Object.create(BaseGamecard.prototype);

    _.extend(Gamecard.prototype, {

        constructor: Gamecard

    });

})(
    Pt.Withdrawal.BaseGamecard
);

/**
 * Deposit Withdrawal Controller
 * Created by isda on 10/04/2017.
 */

(function (_baseHistoryController) {

        _.Class('Pt.Controllers.HistoryController', HistoryController);

        /**
         * History Controller
         * @namespace Pt.History.HistoryController
         * @constructor
         */
        function HistoryController() {

            function Class() {

                _baseHistoryController.call(this);
                this.customModules = {
                    'spinwheel-redemptions': 'SpinwheelRedemptions'
                };

            }

            Class.prototype = Object.create(_baseHistoryController.prototype);
            Class.prototype.constructor = Class;

            _.extend(Class.prototype, {

            }, Pt.Core.Extend('Controllers.HistoryController'));

            return new Class();

        }

    }
)(
    Pt.Controllers.BaseHistoryController
);

/**
 * Deposit Withdrawal Controller
 * Created by isda on 10/04/2017.
 */

(function (_baseDepositWithdrawal) {

        _.Class('Pt.History.DepositWithdrawal', DepositWithdrawal);

        /**
         * History Controller
         * @namespace Pt.History.DepositWithdrawal
         * @constructor
         */
        function DepositWithdrawal() {

            function Class() {

                _baseDepositWithdrawal.call(this);

            }

            Class.prototype = Object.create(_baseDepositWithdrawal.prototype);
            Class.prototype.constructor = Class;

            _.extend(Class.prototype, {

            }, Pt.Core.Extend('History.DepositWithdrawal'));

            return new Class();

        }

    }
)(
    Pt.History.BaseDepositWithdrawal
);

/**
 * Deposit Withdrawal Controller
 * Created by isda on 10/04/2017.
 */

(function (_baseAdjustments) {

        _.Class('Pt.History.Adjustments', Adjustments);

        /**
         * History Controller
         * @namespace Pt.History.Adjustments
         * @constructor
         */
        function Adjustments() {

            function Class() {

                _baseAdjustments.call(this);

            }

            Class.prototype = Object.create(_baseAdjustments.prototype);
            Class.prototype.constructor = Class;

            _.extend(Class.prototype, {

            }, Pt.Core.Extend('History.Adjustments'));

            return new Class();

        }

    }
)(
    Pt.History.BaseAdjustments
);

/**
 * Deposit Withdrawal Controller
 * Created by isda on 10/04/2017.
 */

(function (_baseFundTransfer) {

        _.Class('Pt.History.FundTransfer', FundTransfer);

        /**
         * History Controller
         * @namespace Pt.History.FundTransfer
         * @constructor
         */
        function FundTransfer() {

            function Class() {

                _baseFundTransfer.call(this);

            }

            Class.prototype = Object.create(_baseFundTransfer.prototype);
            Class.prototype.constructor = Class;

            _.extend(Class.prototype, {

            }, Pt.Core.Extend('History.FundTransfer'));

            return new Class();

        }

    }
)(
    Pt.History.BaseFundTransfer
);

/**
 * Deposit Withdrawal Controller
 * Created by isda on 10/04/2017.
 */

(function (_basePromotions) {

        _.Class('Pt.History.Promotions', Promotions);

        /**
         * History Controller
         * @namespace Pt.History.Promotions
         * @constructor
         */
        function Promotions() {

            function Class() {

                _basePromotions.call(this);

            }

            Class.prototype = Object.create(_basePromotions.prototype);
            Class.prototype.constructor = Class;

            _.extend(Class.prototype, {

            }, Pt.Core.Extend('History.Promotions'));

            return new Class();

        }

    }
)(
    Pt.History.BasePromotions
);

/**
 * Deposit Withdrawal Controller
 * Created by isda on 10/04/2017.
 */

(function (_baseReferralBonus) {

        _.Class('Pt.History.ReferralBonus', ReferralBonus);

        /**
         * History Controller
         * @namespace Pt.History.ReferralBonus
         * @constructor
         */
        function ReferralBonus() {

            function Class() {

                _baseReferralBonus.call(this);

            }

            Class.prototype = Object.create(_baseReferralBonus.prototype);
            Class.prototype.constructor = Class;

            _.extend(Class.prototype, {

            }, Pt.Core.Extend('History.ReferralBonus'));

            return new Class();

        }

    }
)(
    Pt.History.BaseReferralBonus
);

(function(
    BaseSpinwheelRedemptions
){
    'use strict';
    
    _.Class('Pt.History.SpinwheelRedemptions', SpinwheelRedemptions);

    /**
     * @namespace Pt.History.SpinwheelRedemptions
     * @constructor
     */
    function SpinwheelRedemptions() {

        BaseSpinwheelRedemptions.call(this);

    }

    SpinwheelRedemptions.prototype = Object.create(BaseSpinwheelRedemptions.prototype);

    _.extend(SpinwheelRedemptions.prototype, {

        constructor: SpinwheelRedemptions

    });
}
)(
    Pt.History.BaseSpinwheelRedemptions
);


/********************************
 * WEB CONTROLLER
 ********************************/

/**
 * Base Home Controller
 * Created by isda on 13/12/2016.
 */


(function (
    Widgets,
    absCtrl
) {

    "use strict";

    _.Class('Pt.Controllers.BaseHomeController', BaseHomeController);

    /**
     * @namespace Pt.Controllers.BaseHomeController
     * @constructor
     */
    function BaseHomeController() {

        this.container = '[data-js=home-container]';

    }

    BaseHomeController.prototype = _.extend(absCtrl, {

        resolve: function (next) {

            next();

        },

        init: function () {}
        
    });

})(
    Pt.Widgets,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Signup Controller
 * Created by isda on 15/12/2016.
 */


(function (
    $,
    _,
    $q,
    Config,
    Settings,
    Rules,
    Helpers,
    Widgets,
    Managers,
    Services,
    absCtrl
) {

    "use strict";

    _.Class( 'Pt.Controllers.BaseSignupController', BaseSignupController);

    /**
     * @namespace Pt.Controllers.BaseSignupController
     * @constructor
     */
    function BaseSignupController() {

        this.form = '[data-js=resend-verification-form]';
        this.actions = [
            [this.form, 'submit', '_onFormSubmit']

        ];

        //fast registration variables
        this.provinces = [];
        this.banks = [];
        this.member = [];
        this.paymentMethods = [];
        this.paymentInstructions = [];
        this.hiddenPaymentMethod = ['offline'];

        this.originalPaymentMethods = [];

        this.fundTransferSupportedBanks = [];

        this.fastRegSecondStepView = 'web.secondStepSignup';
        this.fastRegLastStepView = 'web.lastStepSignup';

        this.fastRegForm = '[data-js=quick-registration-final-form]';

        this.lastStepViewContainer= '[data-js=signup-last-step-form-container]';
        this.secondStepViewContainer = '[data-js=signup-second-step-container]';
        this.bankNativeNameContainerSelector = '[data-js=bank-name-native-wrapper]';

        this.bankNameNative = '[data-js=bank-name-native]';
        this.paymentMethodIdSelector = '[data-js=payment-method-id]';

        this.bankCodeSelector = '[data-js=bank-selection]';
        this.provinceSelector = '[data-js=province-selection]';
        this.citySelector = '[data-js=city-selection]';
        this.fullNameSelector = '[data-js=user-full-name]';
        this.bankAccountNameSelector = '[data-js=bank-account-name]';
        this.districtSelector = '[data-js=district-selection]';

        this.otherBankValue = 'OTHER';

        this.actions = [
            [ this.fastRegForm, 'submit', '_onFastRegFormSubmit' ],
            [ this.provinceSelector, 'change', '_onProvinceChange'],
            [ this.citySelector, 'change', '_onCityChange' ],
            [ this.bankCodeSelector, 'change', '_onBankChange'],
            [ this.fullNameSelector, 'change', '_onFullNameChange' ]
        ];

    }

    BaseSignupController.prototype = _.extend(absCtrl, {

        init: function () {

            if (! Settings.member.isLoggedIn) {

                Widgets.Signup.activate();

            }

        },

        external: function() {

            Widgets.Signup.activate(true);

        },

        verification: function () {

            this._bindEvents();

        },

        _onFullNameChange: function(e) {

            var self = e.data.context;

            $(self.bankAccountNameSelector).val($(this).val());

        },

        _onProvinceChange: function(e) {

            var self = e.data.context;
            var selected = _.findWhere( self.provinces, { id: + $(this).val() } );

            self._renderSelectionMarkup( [], self.citySelector, self.cityLabel );
            self._renderSelectionMarkup( [], self.districtSelector, self.districtLabel );

            self._fetchAndRender({
                element: self.citySelector,
                type: 'cities',
                service: selected,
                label: self.cityLabel
            });

        },

        _onCityChange: function(e) {

            var self = e.data.context;
            var selected = _.findWhere(self.cities, { id: + $(this).val() });

            self._renderSelectionMarkup( [], self.districtSelector, self.districtLabel);

            self._fetchAndRender({
                element: self.districtSelector,
                type: 'districts',
                service: selected,
                label: self.districtLabel
            });

        },

        _onFormSubmit: function (e) {

            e.preventDefault();

            var self = e.data.context;
            var frm = $(this);
            var memberCode = frm.find('input[name=memberCode]').val();

            self.secureFormRequest(self.form, true);

            Helpers.Nprogress.start();


            Services.Members.SessionService.resendVerification({
                memberCode: memberCode,
                operatorId: Settings.operator.msId
            }).then(function () {

                Services.Cms.WidgetService.get('signup_verification_message')
                    .then(function (res) {

                        Helpers.Modal.generic(res.resend_verification_message);

                    });

            }).fail(function (e) {

                var code = _.isArray(e) ? '_' + e[0].code : '';

                Helpers.Notify.error(
                    _.trans('session.signup_resend_verification_failed' + code ));

            }).finally(function () {

                self.secureFormRequest(self.form, false);
                Helpers.Nprogress.done();

            });


        },

        _filterPaymentMethod: function() {

            var self = this;

            self.paymentMethods = _.filter(self.paymentMethods, function (method) {

                return self.hiddenPaymentMethod.indexOf(method.get('methodCode')) === -1;

            });

        },

        _getPaymentMethods: function(){

            var self = this;

            var defer = $q.defer();

            var requests = [
                Services.Members.DepositService.getMethods(),
                Services.Cms.DepositInstructionService.init(),
                Services.Cms.WidgetService.get('bank_transfer_supported_banks')

            ];

            $q.all(requests)
                .then(function(data) {

                    self.paymentMethods = data[0];
                    self.originalPaymentMethods = data[0];
                    self.paymentInstructions = data[1];
                    self.fundTransferSupportedBanks = data[2];
                    defer.resolve(self);

                })
                .fail(function (errors) {

                    defer.reject(errors);

                });

            return defer.promise;

        },

        _showPaymentMethods: function(){

            var self = this;

            self._filterPaymentMethod();
            
            var view = Managers.Template.get(self.fastRegSecondStepView, {

                originalPaymentMethods:self.originalPaymentMethods, //to know if a hidden paymentmethod is recommended
                paymentMethods: self.paymentMethods,
                paymentInstructions: self.paymentInstructions,
                fundTransferSupportedBanks: self.fundTransferSupportedBanks ? self.fundTransferSupportedBanks.banks: []

            });

            self.render(self.secondStepViewContainer, view );
        },

        _onBankChange: function ( e ) {

            var self = e.data.context;
            var value = $(this).val();

            if (value === self.otherBankValue) {

                $(self.bankNameNative).val('');
                $(self.bankNativeNameContainerSelector).show();

            } else {

                $(self.bankNameNative).val($(this).find(':selected').text());
                $(self.bankNativeNameContainerSelector).hide();

            }

        },

        _saveBankAccount: function(data){

            var self  = this;

            var bankCode = data.get('bankCode');
            var bank = _.findWhere(self.banks, {
                bankCode: bankCode
            });

            data.set('isPreferred', true);
            data.set('bankName', bankCode !== self.otherBankValue ? bank.bankNameNative : data.get('bankNameNative'));
            data.set('bankNameNative', bankCode !== self.otherBankValue ? bank.bankNameNative : data.get('bankNameNative'));
            data.set('bankAddressId', data.get('bankProvince') + '|' + data.get('bankCity') + '|' +  data.get('bankDistrict') );
            data.set('bankAddress',  typeof data.get('bankAddress') !== 'undefined' ? data.get('bankAddress') : $(self.provinceSelector).find('option:selected').text() + '|' + $(self.citySelector).find('option:selected').text() + '|' +  $(self.districtSelector).find('option:selected').text() );

            Services.Members.BankService.addBankAccount(data.data)
                .then(function (res) {
                    
                    location.href = Settings['signup_redirect_url'] + '/' + $(self.paymentMethodIdSelector).val();

                })
                .fail(function (e) {

                    Helpers.Error.show(e);

                })
                .finally(function () {

                })
            ;

        },

        _onFastRegFormSubmit: function (e) {

            e.preventDefault();

            var self = e.data.context;

            self.validator.validate(self._onFastRegValidationSuccess, self);

        },

        _onFastRegValidationSuccess: function(data , self) {

            if (self.inProgress) {

                return self;

            }

            self.inProgress = true;
            self.secureFormRequest(self.fastRegForm, true);
            Helpers.Nprogress.start();
            Services.Members.MemberService.quickFinal(data.data)
                .then(function() {

                    self._saveBankAccount(data);
                    self.secureFormRequest(self.fastRegForm, false);

                })
                .fail(function(e){

                    Helpers.Nprogress.done();
                    self.secureFormRequest(self.fastRegForm, false, false);
                    Helpers.Error.show(e);
                    self.secureFormRequest(self.fastRegForm, false, false);

                })
                .finally(function () {

                    self.inProgress = false;
                    Helpers.Nprogress.done();
                    Widgets.Captcha.activate();

                });


        },

        secondStep: function(){

            var self = this;

            self._getPaymentMethods().then(function(data) {

                self._showPaymentMethods();

            });
        },

        _getLastStepData: function(){

            var self = this;

            var defer = $q.defer();

            var requests = [
                Services.Members.BankService.getBanks(),
                Services.Members.MemberService.getMember()
            ];

            if( Settings.member.currency === 'RMB' || Settings.member.currency ===  'VND') {

                requests.push(Services.Members.BankingAddressService.getProvinces());
            }

            $q.all(requests)
                .then(function(data) {

                    self.banks = data[0];

                    self.member = data[1];

                    if( Settings.member.currency === 'RMB' || Settings.member.currency ===  'VND') {

                        self.provinces = data[2];
                    }

                    defer.resolve(self);
                })
                .fail(function (errors) {

                    defer.reject(errors);

                });

            return defer.promise;

        },

        _showLastStepForm: function(){

            var self = this;

            var view = Managers.Template.get(self.fastRegLastStepView, {
                banks: self.banks,
                member: self.member,
                provinces: self.provinces,
                currency: Settings.member.currency
            });

            self.render(self.lastStepViewContainer, view );

        },

        _initComponents: function(){

            this._adJustValidationRules();

            this.validator = new Managers.Validation(this.fastRegForm, Rules.validation.fastRegistrationLastStep);
            this._initForm()
                ._bindEvents();

            this.validator
                .bindInput(true)
                .shouldSerialize(false)
                .init();

        },

        _initForm: function() {

            datepickerZhLocale($);
            datepickerKoLocale($);
            datepickerThLocale($);

            $('[data-js=date]').datepicker({

                endDate: moment(new Date()).subtract(18, 'years')._d,
                language: Managers.Cookie.get('lang'),
                defaultViewDate: moment(new Date()).subtract(18, 'years').format('YYYY-MM-DD')

            });

            return this;

        },

        _adJustValidationRules: function() {

            var currency = Settings.member.currency;

            if ( currency !== 'RMB' && currency !== 'VND' ) {

                Rules.validation.fastRegistrationLastStep.bankProvince = {};
                Rules.validation.fastRegistrationLastStep.bankCity = {};
                Rules.validation.fastRegistrationLastStep.bankDistrict = {};

            }

            if ( currency === 'VND' ) {

                Rules.validation.fastRegistrationLastStep.bankDistrict = {};
                Rules.validation.fastRegistrationLastStep.bankAddress = {};

            }

            if ( currency === 'RMB') {

                Rules.validation.fastRegistrationLastStep.bankAddress = {};

            }

        },

        finalStep: function () {

            var self = this;

            self._getLastStepData().then(function(data) {

                self._showLastStepForm();
                self._initComponents();

            });


        }

    });

})(
    jQuery,
    _,
    Q,
    Pt.Config,
    Pt.Settings,
    Pt.Rules,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Signup Controller
 * Created by isda on 15/12/2016.
 */


(function (
    $,
    _,
    $q,
    Settings,
    Rules,
    helpers,
    Widgets,
    Managers,
    Services,
    absCtrl
) {

    "use strict";

    _.Class( 'Pt.Controllers.BaseLoginController', BaseLoginController);

    /**
     * @namespace Pt.Controllers.BaseLoginController
     * @constructor
     */
    function BaseLoginController() { }

    BaseLoginController.prototype = _.extend(absCtrl, {

        init: function () {

            if (Settings.member.isLoggedIn) {

                location.href = '/';

                return false;

            }

            Widgets.Login.activate();

        }

    });

})(
    jQuery,
    _,
    Q,
    Pt.Settings,
    Pt.Rules,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Forgot Login Controller
 * Created by isda on 15/12/2016.
 */


(function (
    $,
    _,
    $q,
    Settings,
    Rules,
    helpers,
    Widgets,
    Managers,
    Services,
    absCtrl
) {

    "use strict";

    _.Class( 'Pt.Controllers.BaseForgotLoginController', BaseForgotLoginController);

    /**
     * @namespace Pt.Controllers.BaseForgotLoginController
     * @constructor
     */
    function BaseForgotLoginController() { }

    BaseForgotLoginController.prototype = _.extend(absCtrl, {

        init: function () {

            Widgets.ForgotLogin.activate();

        }

    });

})(
    jQuery,
    _,
    Q,
    Pt.Settings,
    Pt.Rules,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Lazy Loaded Slots Controller
 * Created by mike on April 5, 2018
 * 
 */

( function (
    Template,
    absCtrl
) {

    'use strict';

    _.Class('Pt.Controllers.LazySlotsController', LazySlotsController);

    function LazySlotsController() {

        this.slotsAppendContainer = '[data-js=slots-lazy-append]';
        this.currentBatch = 0;
        this.maxBatches = 0;
        this.rendering = false;
        this.cardsBottomDistance = 0;
        this.scrollHandlerActive = true;

    }

    LazySlotsController.prototype = _.extend({

        onFilter: function(games) {

            this.filteredGames = games;
            this.currentBatch = 0;
            this.renderCards()._bindEvents();
            this.scrollHandlerActive = true;

        },

        renderCards: function() {

            var self = this;
            var batch = self.currentBatch;

            this.maxBatches = Math.ceil(self.filteredGames.length / self.gamesPerPage) || 1;

            if ( batch < this.maxBatches ) {

                var limit = self.gamesPerPage;
                var games = _.paginate(self.filteredGames, batch * limit, limit);
                var view = Template.get('web.slotGameCard', { games: games });
                var append = Template.get('web.slotsLazyAppend');

                if ( batch ) {

                    self.rendering = true;
                    $(self.slotsAppendContainer).removeClass('hide');

                    // preload images before lazy loading
                    self.preload(view, function() {

                        // render to the last object of selector
                        var appendEl = $(self.slotsAppendContainer);
                        var renderEl = appendEl.eq(appendEl.length - 1);

                        self.render(renderEl, view + append);

                        setTimeout(function() {

                            renderEl.addClass('loaded');
                            self.rendering = false;

                        }, 50);

                    });

                } else {

                    // initial render
                    this.render(self.cardsContainer, view + append);

                }

                self.currentBatch = batch + 1;

            } else {

                self.scrollHandlerActive = false;
                
            }

            return this;

        },

        preload: function(view, cb) {

            var sources = [];
            view = $('<div></div>').html(view);

            $(view).find('img').each(function(index, imgEl) {

                var source =  $(imgEl).attr('src');
                    
                if ( source && sources.indexOf(source) === -1 ) {

                    sources.push(source);

                }

            });

            var ctr = 0;

            function count() {

                ctr++;

                if ( ctr === sources.length && cb ) {

                    cb();

                }

            }

            _.each(sources, function(source, index) {

                var image = new Image();

                image.onload = count;
                image.onerror = count;
                image.src = source;

            });

        },

        onWindowScroll: function(e) {

            var self = e.data.context;

            if ( self.scrollHandlerActive ) {

                var scrolledHeight = ( e.currentTarget.scrollY || $(window).scrollTop() ) + window.innerHeight;
                var cardsBottomDistance = $(self.cardsContainer).offset().top + $(self.cardsContainer)[0].offsetHeight;

                if ( scrolledHeight > cardsBottomDistance && ! self.rendering ) {

                    self.renderCards();

                }

            }

        }

    });

})(
    Pt.Managers.Template,
    _.clone(Pt.Controllers.SharedSlotsController)	
);
/**
 * Lazy Loaded Slots Controller
 * Created by mike on April 5, 2018
 * 
 */

( function (
    Template,
    PaginationHelper,
    absCtrl
) {

    'use strict';

    _.Class('Pt.Controllers.PaginationSlotsController', PaginationSlotsController);

    function PaginationSlotsController() {

        this.currentPage = 0;
        this.pagingInstance = null;
        this.paginationEl = '[data-js=slots-pagination]';

    }

    PaginationSlotsController.prototype = _.extend({

        onFilter: function(games) {

            this.pagingInstance = null;
            this.currentPage = 0;
            this.filteredGames = games;
            this.renderCards();

        },

        renderCards: function() {

            var self = this;
            var page = self.currentPage;
            var limit = self.gamesPerPage;
            var games = _.paginate(self.filteredGames, page * limit, limit);
            var view = Template.get('web.slotGameCard', { games: games });

            this.render(self.cardsContainer, view)
                .renderPagination();


            return this;

        },

        renderPagination: function() {

            var self = this;

            if (this.pagingInstance === null) {

                this.pagingInstance = PaginationHelper.generate(
                    self.paginationEl, 
                    _.bind(self._onPageClick, self), 
                    {
                        total: self.filteredGames.length,
                        limit: self.gamesPerPage
                    }
                );

            }

        },

        _onPageClick: function (event, page) {

            this.currentPage = page - 1;
            this.renderCards();

        },

        resetPaginationInstance : function() {

            this.pagingInstance = null;

        }

    });

})(
    Pt.Managers.Template,
    Pt.Helpers.PaginationHelper,
    _.clone(Pt.Controllers.SharedSlotsController)  
);
/**
 * Base Slots Controller
 * Created by isda on 13/12/2016.
 */


(function (
    Q,
    GameSettings,
    Settings,
    GameService,
    MembersService,
    Template,
    Cookie,
    Controllers,
    absCtrl
) {

    "use strict";

    var renderController = Controllers[ _.propertyValue( Pt.Settings, 'slots.layout' ) ] || null;
    renderController = renderController ? new renderController() : {};

    _.Class('Pt.Controllers.BaseSlotsController', BaseSlotsController);

    /**
     * @namespace Pt.Controllers.BaseSlotsController
     * @constructor
     */
    function BaseSlotsController() {

        this.club = '';
        this.promises = [];
        this.games = [];
        this.filteredGames = [];
        this.favoriteGames = [];
        this.historyGames = [];
        this.slotsGroupedByCategory = [];


        this.container = '[data-js=page-container]';
        this.filtersContainer = '[data-js=slot-filters]';
        this.cardsContainer = '[data-js=slot-cards]';
        this.realPlayButton = '[data-js=slots-btn-real]';
        this.favoritesButton = '[data-js=slots-btn-favorites]';
        this.search = '[data-js=game-filter-search]';
        this.dropdowns = '[data-js=game-filter-dropdown]';
        this.tabs = '[data-js=game-filter-tab]';

        this.gamesPerPage = parseInt( _.propertyValue(Settings, 'slots.items_per_page') || 24 );

        this.actions = [
            [ this.search, 'input', 'onSearchInput' ],
            [ this.dropdowns, 'input', 'onDropdownInput' ],
            [ this.tabs, 'click', 'onTabsClick' ],
            [ this.realPlayButton, 'click', 'onRealPlayClick' ],
            [ this.favoritesButton, 'click', 'onFavoritesButtonClick' ],
            [ window, 'scroll', 'onWindowScroll' ],
            ['[data-js=modal-show-toggle]', 'change', '_onModalShowToggleChange'],

        ];

        this.filterQuery = {
            method: 'all',
            searchString: '',
            tags: {}
        };

        this.filterViews = {
            tabs: 'web.slotsFilterTabs',
            dropdowns: 'web.slotsFilterDropdowns'
        };

        EventBroker.subscribe(EventBroker.events.games.launchRealPlay, '_onRealPlayLaunch', this)
    }

    BaseSlotsController.prototype = _.extend(absCtrl, {

        resolve: function (next, context) {

            var self = this;
            self.club = context.params.club || GameSettings.club;
            self.preRender();
            self.promises = [ GameService.getGames('slot_machines', this.club) ];

            if ( Settings.member.isLoggedIn ) {

                self.promises = _.union(self.promises, [
                    MembersService.FavoriteSlotGameService.getAll(true),
                    MembersService.SlotGameHistoryService.getAll(true)
                ]);

            }

            Q.allSettled(self.promises).then(function (res) {

                self.games = ( res[0].state === 'fulfilled' ? res[0].value.items : [] );
                self.filteredGames = self.games;

                var refreshCache = Cookie.get('refreshCache'); 

                if ( Settings.member.isLoggedIn ) {

                    self.favoriteGames = ( res[1].state === 'fulfilled' ? res[1].value : [] );
                    self.historyGames = ( res[2].state === 'fulfilled' ? res[2].value : [] );
                    self.extendFavorites();

                }

                if ( refreshCache ) {

                    Cookie.remove({ name : 'refreshCache'} );
                }

            }).finally(function () {

                next();

            });

        },

        preRender: function() {

            var self = this;
            var view = Template.get('web.slotsContainer', {
                club: self.club
            });

            self.render(self.container, view);

        },

        init: function() {

            this.renderCards()
                .renderFilters()
                ._bindEvents();

        },

        extendFavorites: function() {

            _.extendArrayObject(this.games, this.favoriteGames, 'gameId');
            _.extendArrayObject(this.historyGames, this.favoriteGames, 'gameId');

        },

        renderFilters: function() {

            var self = this;

            var filterOptions = {
                container: $(self.filtersContainer),
                type: _.propertyValue(Settings, 'slots.filter')
            };

            self.activateFilters(filterOptions);

            return this;

        },

        activateFilters: function(options) {

            var self = this;
            self.renderFiltersByType(options.container, options.type);

            return this;

        },

        onRealPlayClick: function(e) {

            var self = e.data.context;
            var button = $(this);
            var gameId = button.data('gameId').toString();
            var productCode = button.data('club');

            if ( Settings.member.isLoggedIn ) {

                var gameData = _.findWhere(self.games, { gameId: gameId }) ||
                    _.findWhere(self.favoriteGames, { gameId: gameId }) || {};

                var isAdded = false;

                if ( ! _.findWhere(self.historyGames, { gameId: gameId }) ) {

                    self.setHistory('add', gameData);
                    isAdded = true;

                }

                MembersService.SlotGameHistoryService.addToHistory(gameId, productCode).fail(function(e) {

                    // remove to history if fails
                    if ( isAdded ) {

                        self.setHistory('remove', gameData);

                    }

                });

            } 

        },

        onFavoritesButtonClick: function(e) {

            var self = e.data.context;
            var button = $(this);
            var refreshCache = Cookie.get('refreshCache');

            if ( ! button.isBusy ) {

                button.isBusy = true;

                var gameId = button.data('gameId').toString();
                var club = button.data('club');
                var isFavorite = ( button.hasClass('icon-heart') );
                var gameData = _.findWhere(self.games, { gameId: gameId }) ||
                    _.findWhere(self.historyGames, { gameId: gameId }) ||
                    _.findWhere(self.favoriteGames, { gameId: gameId }) || {};

                self.toggleFavoritesClass(button);

                if ( isFavorite ) {

                    var isRemoved = false;

                    if ( _.findWhere(self.favoriteGames, { gameId: gameId }) ) {

                        self.setFavorites('remove', gameData);
                        isRemoved = true;

                    }


                    MembersService.FavoriteSlotGameService.removeFromFavorites(gameId, club).then(function(){

                        if ( refreshCache ) {

                            Cookie.remove({name : 'refreshCache'});
                        
                        }
    
                        Cookie.set({ name : 'refreshCache', value: 1});

                    }).fail(function () {

                        self.toggleFavoritesClass(button);

                        // if fails, re-add favorites
                        if ( isRemoved ) {

                            self.setFavorites('add', gameData);

                        }

                        // re-render cards
                        self.filter(self.filterQuery);

                    }).finally(function() {

                        button.isBusy = false;

                    });

                    return true;

                }

                var isAdded = false;

                if ( ! _.findWhere(self.favoriteGames, { gameId: gameId }) ) {

                    self.setFavorites('add', gameData);
                    isAdded = true;

                }

                MembersService.FavoriteSlotGameService.addToFavorites(gameId, club)
                .then(function(response) {

                    if ( refreshCache ) {

                        Cookie.remove({name : 'refreshCache'});

                    }

                    Cookie.set({ name : 'refreshCache', value: 1});
                     

                }).fail(function () {

                    self.toggleFavoritesClass(button);

                    // if fails, remove added favorites
                    if ( isAdded ) {

                        self.setFavorites('remove', gameData);

                    }

                }).finally(function() {

                    button.isBusy = false;

                });

            }

        },

        toggleFavoritesClass: function(button) {

            if ( button.hasClass('icon-heart') ) {

                button.addClass('icon-heart-o').removeClass('icon-heart');

            } else if ( button.hasClass('icon-heart-o') ) {

                button.addClass('icon-heart').removeClass('icon-heart-o');

            }

        },

        setHistory: function(method, game) {

            if ( method === 'add' ) {

                this.historyGames.unshift(game);

            }

            if ( method === 'remove' ) {

                this.historyGames = _.filter(this.historyGames, function(historyGame) {

                    return historyGame.gameId !== game.gameId;

                });

            }

        },

        setFavorites: function(method, game) {

            if ( method === 'add' ) {

                game.isFavorite = true;
                this.favoriteGames.push(game);

                var historyGame = _.findWhere(this.historyGames, { gameId: game.gameId });

                if ( historyGame ) {

                    historyGame.isFavorite = true;

                }

            }

            if ( method === 'remove' ) {

                var game = _.findWhere(this.games, { gameId: game.gameId }) ||
                    _.findWhere(this.historyGames, { gameId: game.gameId }) ||
                    _.findWhere(this.favoriteGames, { gameId: game.gameId }) || {};

                game.isFavorite = false;

                var historyFavoriteGame = _.findWhere(this.historyGames, { gameId: game.gameId });

                if ( historyFavoriteGame ) {

                    historyFavoriteGame.isFavorite = false;

                }

                this.favoriteGames = _.filter(this.favoriteGames, function(favoriteGame) {

                    return favoriteGame.gameId !== game.gameId;

                });

            }

        },

        renderFiltersByType: function(container, type) {

            var self = this;
            var params = self.getTypeParams(type);
            var view = Template.get(self.filterViews[type], { params: params });

            self.render(container, view)
                ._bindEvents();

        },

        filterSlotsByCategories: function(allSlots){

            var self = this;

            var availableCategories = _.uniq(_.flatten(_.pluck(allSlots,'categories')));

            var neededCategories = _.pluck(Pt.GameSettings.filters.categories,'category_key') || [];

            _.each(neededCategories, function(neededCategory){

                if(_.contains(availableCategories,neededCategory)){

                    self.slotsGroupedByCategory[neededCategory] = _.pick(allSlots, function(value) {

                        return _.contains(value.categories, neededCategory);

                    });

                }

            });

            return this;
        },

        getTypeParams: function(type) {

            var self = this;
            var ret = {};

            switch ( type ) {

                case 'dropdowns':

                    var filterMap = [
                        { tag: 'category', items: [] },
                        { tag: 'playlines', items: [] },
                        { tag: 'style', items: [] }
                    ];

                    // collate all tags per filter
                    _.each(self.games, function(game) {

                        _.each(filterMap, function(filterMapItem) {

                            if ( game.tags && ! _.isEmpty(game.tags[filterMapItem.tag]) ) {

                                filterMapItem.items = _.union(filterMapItem.items, game.tags[filterMapItem.tag] || []);

                            }

                        });

                    });

                    // sort the filters
                    _.each(filterMap, function(filterMapItem) {

                        filterMapItem.items = self.sortFilters(filterMapItem.items)

                    });

                    ret = filterMap;

                break;

                case 'tabs':

                    // get from settings (slot filters widget)
                    var categories = _.propertyValue(Pt, 'GameSettings.filters.categories') || [];

                    ret = {
                        categories: categories,
                        selectedCategory: 'all'
                    };

                break;

            }

            return ret;

        },

        sortFilters: function(filters) {

            // remove empty filters
            filters = _.filter(filters, function(filter) {

                return ! _.isEmpty(filter);

            });

            // sort filters alphabetically
            filters.sort();

            // if numeric, sort filters numerically
            if ( !filters.some(isNaN) ) {

                filters.sort(function(a, b) {

                    return a - b;

                });

            }

            return filters;

        },

        setQuery: function(options) {

            var self = this;
            self.filterQuery.method = options.method;

            switch ( options.method ) {

                case 'search':

                    var searchString = options.searchString;
                    self.filterQuery.searchString = searchString.toLowerCase();


                break;

                case 'tags':

                    var category = options.tagCategory;
                    var tag = options.tag;

                    if ( tag === 'all' ) {

                        delete self.filterQuery.tags[category]

                    } else {

                        self.filterQuery.tags[category] = tag;

                    }

                break;

            }

            self.filter(self.filterQuery);

        },

        filter: function(query) {

            var self = this;
            var games = _.union([], self.games);

            if ( query ) {

                switch ( query.method ) {

                    case 'search':

                        // if empty return all, else filter
                        if ( ! _.isEmpty(query.searchString) ) {

                            games = _.filter(games, function(game) {

                                return game.title.toLowerCase().indexOf(query.searchString) > - 1;

                            });

                        }

                    break;

                    case 'tags':

                        _.each(query.tags, function(tag, tagCategory) {

                            games = _.filter(games, function(game) {

                                return game.tags[tagCategory] && game.tags[tagCategory].indexOf(tag) > -1;

                            });

                        });

                        // clear the search box
                        $(self.search).val('');

                    break;

                    case 'history':

                        games = self.historyGames;

                    break;

                    case 'favorites':

                        games = self.favoriteGames;

                    break;

                }

            }

            if ( self.onFilter ) {

                self.onFilter(games);

            }

            return games;

        },

        onSearchInput: function(e) {

            var self = e.data.context;
            var filterEl = $(this);

            self.setQuery({
                method: 'search',
                searchString: filterEl.val()
            });

            // make 'ALL' as active tab on search reset
            if (_.isEmpty(filterEl.val())) {
                $(self.tabs + '[data-tab-filter=all]').trigger('click');
            }
        },

        onDropdownInput: function(e) {

            var self = e.data.context;
            var filterEl = $(this);

            self.setQuery({
                method: 'tags',
                tagCategory: filterEl.data('filter'),
                tag: filterEl.val()
            });

        },

        onTabsClick: function(e) {

            var self = e.data.context;
            var filterEl = $(this);
            var filter = filterEl.data('tab-filter');
            var method = 'tags';

            if ( filter === 'history' || filter === 'favorites' ) {

                method = filter;

            }

            filterEl.addClass('active').siblings().removeClass('active');

            self.setQuery({
                method: method,
                tagCategory: 'category',
                tag: filter
            });

        },

        onWindowScroll: function() {},

        _onModalShowToggleChange: function(e) {

            var self = e.data.context;
            var $check = $(this);

            Cookie.set({
                name: 'slots_instructions_no_show_' + self.club,
                value: $check.is(":checked")
            });

        },

        /**
         * Listener for real play game launch event
         *
         * @param {Object} data
         * @returns {undefined}
         */
        _onRealPlayLaunch: function(data) {

            var self = this
                , game = _.findWhere(self.games, { gameId: data.gameId }) || _.findWhere(self.favoriteGames, { gameId: data.gameId });

            if (game) {
                self.setHistory('add', game);
            } else {
                GameService
                    .getGameByVendorAndId(data.vendor, data.gameId)
                    .then(function(response) {
                        if (response) {
                            self.setHistory('add', response);
                        }
                    });
            }
        }

    }, renderController);

})(
    Q,
    Pt.GameSettings,
    Pt.Settings,
    Pt.Services.Cms.GameService,
    Pt.Services.Members,
    Pt.Managers.Template,
    Pt.Managers.Cookie,
    Pt.Controllers,
    _.clone(Pt.Controllers.AbstractController)
);

/**
 * Base Slots Controller
 * Created by isda on 13/12/2016.
 */


(function (
    Q,
    Settings,
    GameSettings,
    Widgets,
    Managers,
    Services,
    absSlots
) {

    "use strict";

    _.Class('Pt.Controllers.BaseSlotsLandingController', BaseSlotsLandingController);

    /**
     * @namespace Pt.Controllers.BaseSlotsLandingController
     * @constructor
     */
    function BaseSlotsLandingController() {

        this.container = '[data-js=page-container]';

        this.pageDetails = null;

    }

    BaseSlotsLandingController.prototype = _.extend(absSlots, {

        resolve: function (next) {

            var self = this;

            Services.Cms.PageService.getPage('slots')
                .then(function (res) {

                    self.pageDetails = res;

                })
                .finally(function () {

                    next();

                });

        },

        init: function () {

            var view = Managers.Template.get('web.slotLanding', {

                page: this.pageDetails

            });

            this.render(this.container, view);

        }

    });

})(
    Q,
    Pt.Settings,
    Pt.GameSettings,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Base Casino Controller
 * Created by isda on 13/12/2016.
 */


(function (
    Q,
    Rules,
    Settings,
    Helpers,
    Widgets,
    Managers,
    Services,
    absCtrl
) {

    "use strict";

    _.Class('Pt.Controllers.BaseCasinoController', BaseCasinoController);

    /**
     * @namespace Pt.Controllers.BaseCasinoController
     * @constructor
     */
    function BaseCasinoController() {

        this.container = '[data-js=page-container]';
        this.pageDetails = null;

    }

    BaseCasinoController.prototype = _.extend(absCtrl, {

        init: function () { }

    });

})(
    Q,
    Pt.Rules,
    Pt.Settings,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Base Games Controller
 * Created by isda on 13/12/2016.
 */


(function (
    Q,
    Rules,
    Settings,
    Helpers,
    Widgets,
    Managers,
    Services,
    absCtrl
) {

    "use strict";

    _.Class('Pt.Controllers.BaseGamesController', BaseGamesController);

    /**
     * @namespace Pt.Controllers.BaseGamesController
     * @constructor
     */
    function BaseGamesController() {

        this.container = '[data-js=page-container]';
        this.pageDetails = null;

    }

    BaseGamesController.prototype = _.extend(absCtrl, {

        init: function () { }

    });

})(
    Q,
    Pt.Rules,
    Pt.Settings,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Base Lottery Controller
 * Created by isda on 13/12/2016.
 */


(function (
    Q,
    Rules,
    Settings,
    Helpers,
    Widgets,
    Managers,
    Services,
    absCtrl
) {

    "use strict";

    _.Class('Pt.Controllers.BaseLotteryController', BaseLotteryController);

    /**
     * @namespace Pt.Controllers.BaseLotteryController
     * @constructor
     */
    function BaseLotteryController() {

        this.container = '[data-js=lottery-container]';
        this.games = [];

    }

    BaseLotteryController.prototype = _.extend(absCtrl, {

        resolve: function (next) {

            var self = this;

            Services.Cms.GameService.getGames('keno_lotto', 'gpi')
                .then(function (res) {

                    self.games = res.items;

                })
                .finally(function () {

                    next();

                });

        },

        init: function () {

            var view = Managers.Template.get('web.lottery', {
                games: this.games
            });

            this.render(this.container, view)
                ._bindEvents();


        }

    });

})(
    Q,
    Pt.Rules,
    Pt.Settings,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Base Sports Controller
 * Created by isda on 13/12/2016.
 */


(function (
    Q,
    Rules,
    Settings,
    Helpers,
    Widgets,
    Managers,
    Services,
    absCtrl
) {

    "use strict";

    _.Class('Pt.Controllers.BaseSportsController', BaseSportsController);

    /**
     * @namespace Pt.Controllers.BaseSportsController
     * @constructor
     */
    function BaseSportsController() {

        this.container = '[data-js=lottery-container]';
        this.games = [];

    }

    BaseSportsController.prototype = _.extend(absCtrl, {

        init: function () {

            this._bindEvents();

        }

    });

})(
    Q,
    Pt.Rules,
    Pt.Settings,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractController)
);

/**
 * Base Casino Controller
 * Created by isda on 13/12/2016.
 */


(function (
    Q,
    Rules,
    Settings,
    Helpers,
    Widgets,
    Managers,
    Services,
    absCtrl
) {

    "use strict";

    _.Class('Pt.Controllers.BaseMahjongController', BaseMahjongController);

    /**
     * @namespace Pt.Controllers.BaseMahjongController
     * @constructor
     */
    function BaseMahjongController() {

        this.container = '[data-js=page-container]';
        this.pageDetails = null;

    }

    BaseMahjongController.prototype = _.extend(absCtrl, {

        resolve: function (next) {

            var self = this;

            Services.Cms.PageService.getPage('texas-mahjong')
                .then(function (res) {

                    self.pageDetails = res;

                })
                .finally(function () {

                    next();

                });

        },

        init: function () {

            var view = Managers.Template.get('web.mahjong', {

                page: this.pageDetails

            });

            this.render(this.container, view);


        }

    });

})(
    Q,
    Pt.Rules,
    Pt.Settings,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Base Casino Controller
 * Created by isda on 13/12/2016.
 */


(function (
    Q,
    Rules,
    Settings,
    Helpers,
    Widgets,
    Managers,
    Services,
    Modal,
    absCtrl
) {

    "use strict";

    _.Class('Pt.Controllers.BaseGrabController', BaseGrabController);

    /**
     * @namespace Pt.Controllers.BaseGrabController
     * @constructor
     */
    function BaseGrabController() {

        this.container = '[data-js=page-container]';
        this.pageDetails = null;
        this.validator = null;
        this.mailAFriendBtn     = '[data-js=email-invite-a-friend]';
        this.mailAFriendModalTpl   = 'web.grabMailToFriend';
        this.mailAFriendModal   = '[data-widget=generic-modal]';
        this.contentModalContainer = '[data-js=modal-content]';
        this.form = '[data-js=grab-a-friend-form]';
        this.emailFields = this.form + ' [data-js^=friend-email]';
        this.emailsAdd = '[data-validation-key=array-of-emails]';
        this.counter = 5;
        this.actions = [
            [ this.mailAFriendBtn, 'click', '_onClickInviteAfriend' ],
            [ self.mailAFriendModal, 'show.bs.modal', '_bindForm' ],
            [ this.emailsAdd, 'blur', '_validateEmails' ],
            [ this.emailFields, 'keyup', '_toggleSubmitBtn' ]
        ];

    }

    BaseGrabController.prototype = _.extend(absCtrl, {

        init: function () {

            Helpers.Hook.run('remove-if-not-auth');

            this._bindEvents();

        },

        _onClickInviteAfriend: function(e) {

            e.preventDefault();

            var self = e.data.context;

            var view = Managers.Template.get(self.mailAFriendModalTpl, {

                counter: self.counter

            });

            Modal.generic(view);

            self._toggleSubmitBtn(e);

        },

        _onFormSubmit: function (self) {

            var self = this;
            self.validator.validate(self._onValidationSuccess, self);

            return;

        },

        _toggleSubmitBtn: function(e){

            var self = e.data.context;

            var disable = true;

            $(self.emailFields).each(function(){

                var value = $(this).val();

                disable *= _.isEmpty(value);

            });

            $(self.form + " [type=submit]").prop('disabled', disable);

        },

        _onValidationSuccess: function() {

            var self = this;
            var formData =  $(this.form).serializeArray();
            var data     = {
                emails: [],
                names: []
            };

            var hasEntry = false;

            _.each(formData, function (formData) {

                if ( formData.name.indexOf('friendEmail') > -1 ) {

                    if (! _.isEmpty(formData.value)) {

                        hasEntry ++;
                        data.emails.push(formData.value);

                    }

                } else {

                    if (! _.isEmpty(formData.value)) {

                        data.names.push(formData.value);

                    }

                }

            });

            if (hasEntry) {

                self.secureFormRequest(self.form, true);

                Helpers.Nprogress.start();

                Services.Members.MemberService.referrals(data)
                    .then(function () {

                        Helpers.Notify.success(_.trans('global.add_referral_success'));
                        self.secureFormRequest(self.form, false, true);
                        $(self.mailAFriendModal).modal('hide');

                    })
                    .fail(function (e) {

                        self.secureFormRequest(self.form, false, false);
                        self._showMailError(e);

                    })
                    .finally(function () {

                        Helpers.Nprogress.done();


                    })
                ;


            }


        },


        _bindForm: function(e) {

            var self = e.data.context;

            $(self.form).on('submit', function(e) {

                e.preventDefault();
                self._onFormSubmit.call(self);

            });

            self._bindValidation();

        },

        _bindValidation: function() {

            this.validator = new Managers.Validation(this.form, Rules.validation.grabFriendForm);
            this.validator
                .bindInput(true)
                .init();

        },

        _validateEmails: function(e) {

            var callback = function() {

                return true;

            };

            var self = e.data.context;
            self.validator.validate(callback, self);

        },

        _showMailError: function(errors){

            var message = _.uniq(_.map(errors, function(error, key) {

                if ( _.isObject(error.message) && _.has(error.message, 'message')  ) {

                    if( _.has(error.message, 'email') ) {

                        return  _.str_replace_key( {
                                '__email__' : error.message.email
                            }, error.message.message
                        );
                    }

                    return error.message.message;

                }

                if( _.has(error, 'email') ) {

                    return  _.str_replace_key( {
                            '__email__' : error.email
                        }, error.message
                    );
                }

                if( _.has(error, 'message') ) {

                    return error.message;

                }

                return error;

            })).join("<br>");

            Pt.Helpers.Notify.error(message);

        }

    });

})(
    Q,
    Pt.Rules,
    Pt.Settings,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    Pt.Helpers.Modal,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Base Promo Controller
 * Created by isda on 13/12/2016.
 */


(function (Q,
           Rules,
           Settings,
           Helpers,
           Widgets,
           Managers,
           Services,
           absCtrl) {

    "use strict";

    _.Class('Pt.Controllers.BasePromoController', BasePromoController);

    /**
     * @namespace Pt.Controllers.BasePromoController
     * @constructor
     */
    function BasePromoController() {

        this.container = '[data-js=promotion-container]';
        this.detailsModal = '[data-js=promo-details-modal]';
        this.claimModal = '[data-js=promo-claim-modal]';
        this.welcomeBonusModal = '[data-js=welcome-bonus-modal]';
        this.detailsContainer = '[data-js=promo-details-modal-container]';
        this.claimContainer = '[data-js=promo-claim-modal-container]';
        this.welcomeBonusClaimContainer = '[data-js=welcome-bonus-modal-container]';
        this.claimForm = '[data-js=promo-claim-form]';
        this.welcomeBonusClaimForm = '[data-js=welcomebonus-claim-form]';
        this.copyToClipboardBtn = '[data-js=copy-to-clipboard-message]';

        this.promoInterval = null;
        this.inProgress = false;
        this.currentCategory = null;
        this.categories = [];
        this.promotions = [];
        this.promoWidget = {};
        this.validator = null;
        this.cardTimeTicker = false;
        this.cardTimeIntervals = [];
        this.selectedPromotion = null;
        this.promoName = _.getParameterByName('promo');

        this.spinWheelContainer = "[data-js=inner-wheel]";

        this.actions = [
            ['[data-js=btn-more-info]', 'click', '_onMoreInfoClick'],
            ['[data-js=btn-join-now]', 'click', '_onJoinNowClick'],
            ['[data-js=btn-claim-now]', 'click', '_onClaimNowClick'],
            ['[data-js=btn-apply-now]', 'click', '_onApplyNowClick'],
            [this.detailsModal, 'hidden.bs.modal', '_onDetailsModalClose'],
            [this.claimModal, 'shown.bs.modal', '_onClaimModalShown'],
            [this.welcomeBonusModal, 'shown.bs.modal', '_onWelcomeBonusClaimModalShown'],
            [this.claimModal, 'hidden.bs.modal', '_onClaimModalClose'],
            [this.welcomeBonusModal, 'hidden.bs.modal', '_onClaimModalClose'],
            [this.claimForm, 'submit', '_onClaimFormSubmit'],
            [this.welcomeBonusClaimForm, 'submit', '_onClaimFormSubmit'],
            ["[data-js=spin_trigger]", 'click', '_triggerSpin'],
            [this.spinWheelContainer, "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", "_onSpinFinish"],
            [this.copyToClipboardBtn, 'click', '_showCopyToClipBoardMessage']

        ];

        this.spin_degree = 1800;
        this.spin_count = 1;
        this.spins_available = 0;
        this.extra_spins_available = 0;
        this.is_prize_claimed = false;
        this.spinwheel_config = {};
        this.spin_condition = "";
        this.spinWheelItemSize = 45;
        this.welcomeBonusPromoMapping = {};

        this.isPromoSingle = function() {

            return ! _.isNull(this.promoId);

        }

        this.spinSuccessStatus = [1,7,0];

    }

    BasePromoController.prototype = _.extend(absCtrl, {

        resolve: function (next, requestContext) {

            //noinspection JSUnresolvedVariable
            this.currentCategory = requestContext.params.category || null;
            this.promoId = requestContext.params.promoId || null;

            var self = this;
            var promises = [
                Services.Cms.PromotionService.getPromotionsCategory(),
                Services.Cms.PromotionService.getPromotions(this.currentCategory),
                Services.Cms.WidgetService.get('promotions')
            ];


            Q.all(promises)
                .then(function (res) {

                    self.categories = res[0];
                    self.promotions = res[1];
                    self.promoWidget = res[2];

                    next();

                });

        },

        init: function () {

            this.currentCategory = this.currentCategory || _.findWhere(
                this.categories, { isDefaultCategory: true }).key;

            var view = "";
            this._generateWelcomeBonusPromoMapping();
            if ( this.isPromoSingle() ) {

                var promoDetails = _.findWhere(this.promotions, { hashId: this.promoId });
                var promoDuration = promoDetails.getPromoDuration();

                view = Managers.Template.get('web.promoDetails', {
                    isLoggedIn: Settings.member.isLoggedIn,
                    promoDetails: promoDetails,
                    welcomeBonusPromos: this.welcomeBonusPromoMapping,
                    duration: promoDuration
                });

                $(this.container).addClass('promo-single');

                this.render(this.container, view)
                    ._bindEvents();

                this._startTicker(promoDuration);

            } else {

                view = Managers.Template.get('web.promo', {
                    isLoggedIn: Settings.member.isLoggedIn,
                    promos: this.promotions,
                    currentCategory: this.currentCategory,
                    welcomeBonusPromos: this.welcomeBonusPromoMapping,
                    categories: this.categories,
                    promoWidget: this.promoWidget
                });

                this.render(this.container, view)
                    ._bindEvents();

                this._startCardTicker(this.promotions);

            }

            this._showPromoDetails();

        },

        _onMoreInfoClick: function (e) {

            e.preventDefault();

            var self = e.data.context;
            var el = $(this);
            var promoCard = el.closest('[data-js=promo-card]');
            var promoDetails = _.findWhere(self.promotions, { hashId: promoCard.data('promoId') });
            var promoDuration = promoDetails.getPromoDuration();

            var view = Managers.Template.get('web.promoDetails', {
                isLoggedIn: Settings.member.isLoggedIn,
                promoDetails: promoDetails,
                welcomeBonusPromos: self.welcomeBonusPromoMapping,
                duration: promoDuration
            });

            self.selectedPromotion = promoCard;

            self.render(self.detailsContainer, view);

            $(self.detailsModal).modal('show');

            self._startTicker(promoDuration);

        },

        _startCardTicker: function (promos) {

            if (! this.cardTimeTicker) {

                return this;

            }

            /**
             * CLEAR INTERVALS
             */

            if (this.cardTimeIntervals) {

                _.each(this.cardTimeIntervals, function (item) {

                    clearInterval(item);

                });

            }

            var self = this;
            var dateVariants = [
                'months', 'days', 'hours', 'minutes', 'seconds'
            ];

            _.each(promos, function (item) {

                var duration = item.getPromoDuration();

                self.cardTimeIntervals.push(setInterval(function () {

                    var isValid = false;

                    duration.subtract("00:00:01");

                    dateVariants.forEach(function (dVar) {

                        $('[data-promo-id=' + item.hashId + '] [data-js=value-' + dVar + ']').html(duration[dVar]());

                        if (+ duration[dVar]() > 0) {

                            isValid = true;

                        }

                    });

                    if (! isValid) {

                        $('[data-promo-id=' + item.hashId + ']').parent().remove();

                        var index = self.cardTimeIntervals.map(function (obj, index) {

                            if (obj.hashId === item.hashId) {

                                return index;

                            }

                        });

                        if (index) {

                            clearInterval(self.cardTimeIntervals[index]);

                        }

                    }

                }, 1000));

            });


        },

        _startTicker: function (duration) {

            var self = this;

            var dateVariants = [
                'months', 'days', 'hours', 'minutes', 'seconds'
            ];

            var bannerSelector = this.isPromoSingle() ?
                this.container + ' .banner-wrapper img' :
                this.detailsModal + ' img';

            $(bannerSelector).on('load', function () {

                $('[data-js=promo-timer-container]').removeClass('hide');

            });

            this.promoInterval = setInterval(function () {

                var isValid = false;

                duration.subtract("00:00:01");

                dateVariants.forEach(function (item) {

                    $('[data-js=value-' + item + ']').html(duration[item]());

                    if (+ duration[item]() > 0) {

                        isValid = true;

                    }

                });

                if (! isValid) {

                    $(self.detailsModal).modal('hide');
                    self.selectedPromotion.parent().remove();

                }

            }, 1000);

        },

        _onDetailsModalClose: function (e) {

            var self = e.data.context;

            clearInterval(self.promoInterval);

        },

        _onClaimNowClick: function (e) {

            e.preventDefault();

            var self = e.data.context;
            var el = $(this);
            var promoCard = el.closest('[data-js=promo-card]');
            var promoID = promoCard.data('promoId') ? promoCard.data('promoId') : el.data('promoId');
            var promoDetails = _.findWhere(self.promotions, { hashId: promoID });

            var view = Managers.Template.get('web.promoClaim', {
                memberCode: Settings.member.code,
                promoDetails: promoDetails
            });

            self.render(self.claimContainer, view)
                ._bindEvents();

            $(self.detailsModal).modal('hide');
            $(self.claimModal).modal('show');

        },

        _onApplyNowClick: function (e) {

            e.preventDefault();

            var self = e.data.context;
            var el = $(this);
            var promoCard = el.closest('[data-js=promo-card]');
            var promoID = el.data('promoId');
            if(!promoID) {

                promoID = promoCard.data('promoId') ? promoCard.data('promoId') : el.data('promoId');
            }

            var promoDetails = _.findWhere(self.promotions, { hashId: promoID });

            var view = Managers.Template.get('web.welcomeBonus', {
                memberCode: Settings.member.code,
                promoDetails: promoDetails,
                welcomeBonusDetails : self.welcomeBonusPromoMapping[promoID] || {}
            });

            self.render(self.welcomeBonusClaimContainer, view)
                ._bindEvents();

            $(self.detailsModal).modal('hide');
            $(self.welcomeBonusModal).modal('show');

        },

        _onClaimModalShown: function (e) {

            var self = e.data.context;

            self.validator = new Managers.Validation(self.claimForm, Rules.validation.promotionClaim);

            self.validator
                .bindInput(true)
                .init();

        },

        _onWelcomeBonusClaimModalShown: function (e) {

            var self = e.data.context;

            self.validator = new Managers.Validation(self.welcomeBonusClaimForm, Rules.validation.welcomeBonusClaim);

            self.validator
                .bindInput(true)
                .init();

        },

        _onClaimFormSubmit: function (e) {

            e.preventDefault();

            var self = e.data.context;

            self.validator.validate(self._onValidationSuccess, self);

        },

        _onValidationSuccess: function (data) {

            var promoCode = _.findWhere(data, { name: 'subjectCode' });
            var comment = _.findWhere(data, { name: 'comment' });
            var self = this;

            this._secureFormRequest(this.claimForm, true);

            Helpers.Nprogress.start();

            Services.Members.PromotionClaimService.claim(promoCode.value, comment.value)
                .then(function (message) {

                    if($(self.welcomeBonusModal).is(':visible')){

                        self._displaySuccessWelcomeBonusModal();
                        return false;

                    }

                    Helpers.Notify.success(message);
                    $(self.claimModal).modal('hide');

                })
                .fail(function (err) {

                    Helpers.Error.show(err);

                })
                .finally(function () {

                    self._secureFormRequest(self.claimForm, false);

                    Helpers.Nprogress.done();

                });

        },

        _onClaimModalClose: function (e) {

            var self = e.data.context;

            self.validator = null;

        },

        _secureFormRequest: function (form, secure) {

            if (secure) {

                if (this.inProgress) {

                    return this;

                }

                this.inProgress = true;

                Helpers.Form.lockForm(form, true);

            } else {

                this.inProgress = false;

                Helpers.Form.lockForm(form, false);

            }

        },


        _onJoinNowClick: function (e) {

            e.preventDefault();

            var self = e.data.context;

            $(self.detailsModal).modal('hide');

            Widgets.Signup.show();

        },

        _showPromoDetails: function () {

            if (this.promoName) {

                try {

                    $('[data-promo-id="' + this.promoName + '"]').find('[data-js="btn-more-info"]').trigger('click');
                    this.promoName = false;


                } catch (e) {

                }

            }

        },

        initSpinWheel: function () {

            var self = this;
            var promises = [
                Services.Members.SpinWheelService.getPrizes(),
                Services.Cms.WidgetService.get('spinwheel_config')
            ];

            Q.allSettled(promises)
                .then(function (res) {

                    res[0] = (res[0].state === 'fulfilled' ? res[0].value : res[0].reason);
                    res[1] = (res[1].state === 'fulfilled' ? res[1].value : res[1].reason);
                    self.prizeItems = res[0].prizeItems;
                    self.spinWheelItemSize = 360 / _.size(self.prizeItems) ;
                    self.spins_available = res[0].spins;
                    self.extra_spins_available = res[0].extraSpins;

                    if (res[1].web) {

                        self.spinwheel_config = res[1].web;

                    }
                    var message = "";
                    if (+ res[0].status !== 0) {

                        var amount = res[0].pendingAmount ? _.toCurrency(res[0].pendingAmount,2)  + Settings.member.currency : '';
                        var number_of_deposits = res[0].pendingDeposits ? res[0].pendingDeposits : '';
                        message =  _.str_replace_key({ ':amount': amount ,':number_of_deposits': number_of_deposits}, _.trans('global.spinwheel_message_' + res[0].status));
                        message = (typeof res[0].status  === 'undefined' ? "" : message);
                        self.spin_condition = message;

                    }

                    self.renderSpinWheel();

                });

        },
        renderSpinWheel: function () {

            var self = this;
            var spins_available_text = _.str_replace_key({ ':no_of_spins': self.spins_available }, _.trans('global.number_of_spins'));
            var extra_spins_available_text = _.str_replace_key({ ':extra_spins': self.extra_spins_available }, _.trans('global.extra_spins_message'));
            var spinwheelBackground = _.propertyValue(self.spinwheel_config,'background',false);
            var fontColor = _.propertyValue(self.spinwheel_config,'font_color','default');
            var customStyle='';
            if(spinwheelBackground){

                customStyle += 'background-image:url('+spinwheelBackground+');';
            }

            if(fontColor !== 'default'){

                customStyle += 'color:'+fontColor+';';

            }
            var view = Managers.Template.get('web.spinWheelContainer', {

                prizeItems: self.prizeItems,
                config: self.spinwheel_config,
                spins_available : (+ self.spins_available > 0 ? spins_available_text : self.spin_condition),
                extra_spins_available : (+ self.extra_spins_available > 0 ? extra_spins_available_text : ''),
                pieClass: 'pie-' + (_.size(self.prizeItems)),
                customStyle: customStyle
            });

            self.render(self.container, view)
                ._bindEvents();
            $('[data-class="spin_wheel"], [data-class="spin_wheel_"]').addClass('spin-wheel');
            $('[data-js="promotion-container"]').removeClass('container');
            self.checkAvailableSpins();

        },

        _spinWheel: function (index, infinite) {

            var self = this;
            var random_positioning = Math.floor(Math.random() * 10 ) - 8;
            var spin_target = ((self.spin_degree * 5) - ((index + 1) * self.spinWheelItemSize)) + random_positioning;


            if (infinite) {

                $(self.spinWheelContainer).addClass('infinite-rotating');

            } else {

                $(self.spinWheelContainer).removeClass('infinite-rotating');

                setTimeout(function () {

                    $('[data-js=inner-wheel]').css({
                        'transform': 'rotate(' + spin_target + 'deg)'
                    });

                }, 40);

            }


            self.spin_count ++;


        },

        _triggerSpin: function (e) {

            var self = e.data.context;
            var params = {

                PrizeItems: self.prizeItems
            };
            self.is_prize_claimed = false;
            self._spinWheel(0, true);

            $('[data-js="spin_trigger"]').addClass('hide');
            $('[data-js="no-spins-available"]').removeClass('hide');

            var getSpinWheelItems = Services.Members.SpinWheelService.claim(params);
            getSpinWheelItems.then(function (res) {

                if ( _.contains(self.spinSuccessStatus, +res.status)  && res.productCode ) {

                    var prize_index = _.findIndex(self.prizeItems, { ProductCode: res.productCode });

                    self._spinWheel(prize_index, false);

                    var view = Managers.Template.get('web.spinWheelSuccessModal', {

                        prizeDetails: _.findWhere(self.prizeItems, { ProductCode: res.productCode })

                    });

                    self.spin_message = view;

                    self.prizeItems = res.prizeItems;
                    self.spins_available = res.spins;
                    self.extra_spins_available = res.extraSpins;

                    var message = "";
                    if ( self.spins_available === 0) {

                        var amount = res.pendingAmount ? _.toCurrency(res.pendingAmount, 2) + Settings.member.currency : '';
                        var number_of_deposits = res.pendingDeposits ? res.pendingDeposits : '';
                        message = _.str_replace_key({
                            ':amount': amount,
                            ':number_of_deposits': number_of_deposits
                        }, _.trans('global.spinwheel_message_' + res.status));
                        message = (typeof res.status === 'undefined' ? "" : message);
                        self.spin_condition = message;
                    }


                } else {

                    var amount = res.pendingAmount ? res.pendingAmount + Settings.member.currency : '';
                    var number_of_deposits = res.pendingDeposits ? res.pendingDeposits : '';
                    var message =  _.str_replace_key({ ':amount': amount ,':number_of_deposits': number_of_deposits}, _.trans('global.spinwheel_message_' + res.status));
                    message = (typeof res.status  === 'undefined' ? "": message);
                    var confirmButton = _.propertyValue(self.spinwheel_config,'confirm_button', false);
                    var modalOptions = {
                        backdrop: 'static',
                        keyboard: false,
                        showCancel: false,

                    };
                    if(confirmButton){
                        modalOptions.confirmButton = '<img src="' + confirmButton + '">';
                    }

                    if(message === ""){
                        Helpers.Notify.error( _.trans( 'global.spinwheel_message_4' ) );
                        self.renderSpinWheel();
                        return false;
                    }

                    Helpers.Modal.info('', '<h3 class="win-congrats spin-wheel-error">' + message + '</h3>', function (cb) {

                            self.renderSpinWheel();

                        },modalOptions,
                        function () {


                        }
                    );

                }


            });


        },

        _onSpinFinish: function (e) {

            var self = e.data.context;

            $('[data-js="spin_trigger"]').removeClass('hide');
            $('[data-js="no-spins-available"]').addClass('hide');
            var confirmButton = _.propertyValue(self.spinwheel_config,'confirm_button', false);
            var modalOptions = {
                backdrop: 'static',
                keyboard: false,
                showCancel: false,

            };
            if(confirmButton){
                modalOptions.confirmButton = '<img src="' + confirmButton + '">';
            }

            Helpers.Modal.info('', self.spin_message, function (cb) {

                    self.renderSpinWheel();

                }, modalOptions, function () {


                }
            );

        },
        checkAvailableSpins: function () {

            var self = this;

            if (+ self.spins_available > 0) {

                $('[data-js="spin_trigger"]').removeClass('hide');
                $('[data-js="no-spins-available"]').addClass('hide');

            }

        },
        _generateWelcomeBonusPromoMapping: function(){

          var self = this;
          _.each(_.propertyValue(Settings,'welcome_bonus_promo_config.promotions',[]), function(item){

              self.welcomeBonusPromoMapping[item.promo_id] = item;

          });


        },
        _displaySuccessWelcomeBonusModal: function(){

            var self = this;
            var success_message = _.propertyValue(Settings,'welcome_bonus_promo_config.success_message','');

            var view = Managers.Template.get('web.welcomeBonusSuccess', {
                message: success_message,
            });

            $(self.welcomeBonusClaimContainer).html(view);
            $(self.detailsModal).modal('hide');
            $(self.welcomeBonusModal).modal('show');

        },
        _showCopyToClipBoardMessage: function (e) {

            if (document.execCommand("copy")) {

                Helpers.Notify.success(_.trans('global.success_copy_to_clip_board'));

            }

            
        },
    });

})(
    Q,
    Pt.Rules,
    Pt.Settings,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractController)
);

(function (Q,
           Rules,
           Settings,
           Helpers,
           Widgets,
           Managers,
           Services,
           absCtrl) {

    "use strict";

    _.Class('Pt.Controllers.BaseArticleController', BaseArticleController);

    /**
     * @namespace Pt.Controllers.BaseArticleController
     * @constructor
     */
    function BaseArticleController() {

        this.container = '[data-js=article-container]';
        this.detailsContainer = '[data-js=article-details-container]';
        this.cardsContainer = '[data-js=article-cards-container]';
        this.search = '[data-js=article-filter-search]';
        this.categoryFilter = '[data-js=article-category-filter]';

        this.inProgress = false;
        this.currentCategory = null;
        this.categories = [];
        this.articles = [];
        this.allArticles = [];
        this.articleWidget = {};
        this.selectedArticle = null;
        this.articleName = _.getParameterByName('article');
        this.articlePerPage = parseInt( _.propertyValue(Settings, 'article_settings.items_per_page', 8));
        this.route = _.propertyValue(Settings, 'article_settings.route_namespace', 'article');
        this.site = 'affiliate';
        this.banner = [];
        this.miniBanner = [];


        this.cardTimeTicker = false;
        this.cardTimeIntervals = [];
        this.carousel = null;

        this.currentPage = 0;
        this.pagingInstance = null;
        this.paginationEl = '[data-js=article-pagination]';

        this.actions = [
            [ this.search, 'submit', 'onSearchSubmit' ],
            [ this.categoryFilter, 'click', 'onCategoryFilter' ]
        ];

    }

    BaseArticleController.prototype = _.extend(absCtrl, {

        resolve: function (next, requestContext) {

            //noinspection JSUnresolvedVariable
            this.currentCategory = requestContext.params.category || null;
            this.articleId = requestContext.params.articleId || null;


            var self = this;
            var promises = [
                Services.Cms.ArticleService.getArticlesCategory(this.site),
                Services.Cms.ArticleService.getArticles(this.currentCategory, this.site),
                Services.Cms.WidgetService.get('article')
            ];


            Q.all(promises)
                .then(function (res) {

                    self.categories = res[0];
                    self.articles = res[1];
                    self.articleWidget = res[2];

                    next();

                });

        },

        init: function () {

            var self = this;

            var view = '';
            self.miniBanner = self.articleWidget.mini_banner || '';
            self.banner = self.articleWidget.banner || '';

            self.allArticles = self.articles;

            if( ! _.isNull(self.articleId) ) {

                var articleDetails = _.findWhere(self.articles, { hashId: self.articleId });


                self.container = self.detailsContainer;

                view = Managers.Template.get('web.articleDetails', {
                    isLoggedIn: Settings.member.isLoggedIn,
                    articleDetails: articleDetails,
                    currentCategory: self.currentCategory,
                    categories: self.categories,
                    mini_banner: self.miniBanner,
                    route: self.route
                });

                self.render(self.container, view)
                    ._bindEvents();

            } else {

                self.renderLanding();

            }

            if (self.banner.length > 1) {

                self.runCarousel('article-banner');

            }

            _.each(self.miniBanner, function(section, key) {

                var data = 'mini-banner-' + key;

                if (section.images.length > 1) {

                    self.runCarousel(data);

                }

            });

        },

        renderLanding: function() {

            var self = this;
            var view = '';

            view = Managers.Template.get('web.article', {

                isLoggedIn: Settings.member.isLoggedIn,
                currentCategory: self.currentCategory,
                categories: self.categories,
                banner: self.banner,
                mini_banner: self.miniBanner,
                route: self.route

            });

            self.render(self.container, view)
            ._bindEvents()
            .renderCards();

        },

        runCarousel: function (section) {

            var car = $('[data-js='+ section +'-carousel]');
            car.find('.hide').removeClass('hide');
            this.carousel = car.slick({
                dots: true,
                arrows: false,
                autoplay: true,
                vertical: false,
                verticalSwiping: false,
                pauseOnHover: true,
                pauseOnFocus: false,
                autoplaySpeed: parseInt(Settings.banner_interval, 10)
            });


        },

        renderCards: function() {

            var self = this;
            var page = self.currentPage;
            var limit = self.articlePerPage;

            self.articles = _.sortBy(self.articles, 'startDate').reverse();

            var articles = _.paginate(self.articles, page * limit, limit);
            var view = Managers.Template.get('web.articleCards', {
                articles: articles,
                currentCategory: self.currentCategory,
                categories: self.categories,
                route: self.route
            });

            self.render(self.cardsContainer, view);

            if (self.articles.length > limit) {
                self.renderPagination();
            }

            return this;

        },

        renderPagination: function() {

            var self = this;

            if (this.pagingInstance === null) {

                this.pagingInstance = Helpers.PaginationHelper.generate(
                    self.paginationEl,
                    _.bind(self._onPageClick, self),
                    { total: self.articles.length, limit: self.articlePerPage }
                );

            }

        },

        _onPageClick: function (event, page) {

            $('html, body').animate({
                scrollTop: $(this.cardsContainer).offset().top - 150
            }, 500);

            this.currentPage = page - 1;
            this.renderCards();

        },

        resetPaginationInstance : function() {

            this.pagingInstance = null;

        },

        onSearchSubmit: function(e) {

            e.preventDefault();

            var self = e.data.context;
            var view = '';
            var searchString = $(this).find('input').val().toLowerCase();

            if ( _.isEmpty(searchString.trim()) ) {

                return false

            }

            view = Managers.Template.get('web.articleSearch', {

                isLoggedIn: Settings.isLoggedIn,
                currentCategory: self.currentCategory,
                categories: self.categories,
                banner: self.banner,
                mini_banner: self.miniBanner,
                route: self.route,
                searchQuery: searchString

            });

            self.articles = _.filter(self.allArticles, function(article) {

                return article.title.toLowerCase().indexOf(searchString) > - 1;

            });

            self.render(self.container, view)
            ._bindEvents();

            self.onFilter();
            self.renderCards();

        },

        onCategoryFilter: function(e) {

            var self = e.data.context;
            self.onFilter();

        },

        onFilter: function() {

            this.pagingInstance = null;
            this.currentPage = 0;

        }

    });

})(
    Q,
    Pt.Rules,
    Pt.Settings,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractController)
);


( function (
    Q,
    WidgetService,
    Template,
    absCtrl
) {

    "use strict";

    _.Class('Pt.Controllers.BaseTournamentsController', BaseTournamentController);

    function BaseTournamentController() {

        this.container = '[data-js=page-container]';
        this.tournaments = [];
        this.tickers = '[data-js=ticker-instance]';
        this.tickerIntervals = [];
        this.actions = [
            [ '[data-js=hide_tournament_details]' , 'click', "_hideTournamentDetails" ],
            [ '[data-js=show_tournament_details]' , 'click', "_showTournamentDetails" ],
        ];

    }

    BaseTournamentController.prototype = _.extend(absCtrl, {

        resolve: function(next) {

            var self = this;
            var promises = [
                WidgetService.get('tournaments')
            ];

            Q.allSettled(promises).then(function(res) {

                self.tournaments = _.propertyValue(res[0], 'value.tournament_items') || [];
                next();

            });

        },

        init: function() {

            var self = this;

            var view = Template.get('web.tournaments', {
                tournaments: self.tournaments
            });

            this.render(this.container, view).startTickers();
            this._bindEvents();


        },

        startTickers: function() {


            var self = this;
            var tickers = $(this.tickers);

            tickers.each(function(index, ticker) {

                var remaining = moment.duration($(ticker).data('remaining'));
                var months = $(ticker).find('[data-js=ticker-months]');
                var days = $(ticker).find('[data-js=ticker-days]');
                var hours = $(ticker).find('[data-js=ticker-hours]');
                var minutes = $(ticker).find('[data-js=ticker-minutes]');
                var seconds = $(ticker).find('[data-js=ticker-seconds]');

                months.text(remaining.months() + ( remaining.years() * 12 ));
                days.text(remaining.days());
                hours.text(remaining.hours());
                minutes.text(remaining.minutes());
                seconds.text(remaining.seconds());

                self.tickerIntervals[index] = setInterval(function() {

                    remaining.subtract(1, 'seconds');

                    if ( remaining.valueOf() < 1 ) {

                        $(ticker).closest('[data-js=tournament-item]').hide();
                        clearInterval(self.tickerIntervals[index]);

                    }

                    months.text(remaining.months() + ( remaining.years() * 12 ));
                    days.text(remaining.days());
                    hours.text(remaining.hours());
                    minutes.text(remaining.minutes());
                    seconds.text(remaining.seconds());

                }, 1000);

            });

        },
        _hideTournamentDetails: function(){

            var tournament_container = $(this).closest('[data-js=tournament-item]');
            $('[data-js=show_tournament_details]', tournament_container).removeClass('hide');


        },
        _showTournamentDetails: function(){

            $(this).addClass('hide');

        }

    });


})(
    Q,
    Pt.Services.Cms.WidgetService,
    Pt.Managers.Template,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Base Info Controller
 * Created by isda on 13/12/2016.
 */


(function (
    Q,
    Rules,
    Settings,
    Helpers,
    Widgets,
    Managers,
    Services,
    absCtrl
) {

    "use strict";

    _.Class('Pt.Controllers.BaseInfoController', BaseInfoController);

    /**
     * @namespace Pt.Controllers.BaseInfoController
     * @constructor
     */
    function BaseInfoController() {

        this.container = '[data-js=page-container]';
        this.contentContainer = '[data-js=info-main-content]';
        this.currentCategory = null;
        this.currentCategorySlug = null;

        this.categories = [];
        this.categoryItems = {};
        this.actions = _.union(this.actions,[
            ['[data-js=info-center-submit-btn]', 'click', '_onBankingOptionsSubmit']
        ]);

    }

    BaseInfoController.prototype = _.extend(absCtrl, {

        resolve: function (next, context) {

            var self = this;

            Services.Cms.InfoCenter.getCategories()
                .then(function (res) {

                    if (_.isEmpty(res)) {

                        throw new Error('Infocenter Category not set.');

                    }

                    self.categories = res;

                    self.currentCategory = context.params.category || res[0].slug;

                    Services.Cms.InfoCenter.getList(res[0].id)
                        .then(function (items) {

                            self.categoryItems = items;

                            self.currentCategorySlug = context.params.slug || _.firstProp(items).slug;

                            next();

                        });

                }).fail(function (e) {

                    Helpers.Notify.error(e);

                });

        },

        init: function () {

            var view = Managers.Template.get('web.infoCenter', {

                categories: this.categories,
                categoryItems: this.categoryItems,
                currentCategory: this.currentCategory,
                currentCategorySlug: this.currentCategorySlug

            });


            this.render(this.container, view)
                .renderCategoryItem();

            this._bindEvents();

        },

        renderCategoryItem: function () {

            var self  = this;

            Services.Cms.InfoCenter.getDetailsBySlug(this.currentCategorySlug, this.currentCategory)
                .then(function (res) {


                    var view = Managers.Template.get('web.infoCenterContent', {
                        title: res.name,
                        content: _.propertyValue(res, 'content.body.code')
                    });

                    self.render(self.contentContainer, view);

                });

        },

        _onBankingOptionsSubmit: function (e) {
            e.preventDefault();

            var preferredCurrency = $('[data-js=preferred-currency-select]').val().toLowerCase(),
                transactionType = $('[data-js=transaction-type-select]').val().toLowerCase(),
                formContent = $('[data-js=info-center-banking-content]'),
                formContentType = $('[data-js=transaction-type-info]');

            formContent.addClass('hide');
            formContentType.addClass('hide');

            $('.' + preferredCurrency + '-table').removeClass('hide');

            if( transactionType === 'all' ) {
                formContentType.removeClass('hide');
            }

            if( transactionType !== 'all' && formContentType.hasClass(transactionType + '-info') ) {
                $('.' +  transactionType + '-info').removeClass('hide');
            }

        }

    });

})(
    Q,
    Pt.Rules,
    Pt.Settings,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractController)
);

(function (
    Q,
    Services,
    Config,
    Managers,
    DataTable,
    Router,
    Settings,
    absCtrl
) {

    "use strict";

    _.Class('Pt.Controllers.BaseGameExclusionController', BaseGameExclusionController);

    /**
     * @namespace Pt.Controllers.BaseGameExclusionController
     * @constructor
     */
    function BaseGameExclusionController() {

        this.nav = '[data-js=exclusion-nav]';
        this.contents = '[data-js=exclusion-content]';
        this.gameListTable = '[data-js=game-list-table]';
        this.clubs = [];
        this.validSelected = null;

    }

    BaseGameExclusionController.prototype = _.extend(absCtrl, {

        resolve: function ( next ) {

            next();

        },

        init: function ( e ) {

            var self = this;

            self.clubs = [];

            // convert config clubs to array
            _.each( _.propertyValue(Settings, 'products_settings.exclusion') || [], function( value ) {
                
                self.clubs.push({
                    key: value,
                    value: value
                });

                // valid selected tab
                if ( value === e.params.category ) {
                    
                    self.validSelected = value;

                }

            });


            // redirect if no selected category
            if ( ! e.params.category ) {

                Router.navigate('/exclusion/' + self.clubs[0].key);

            } else {

                // render nav
                this.renderNav();

                // render content
                this.fetchContent();

            }
 
        },

        renderNav: function() {

            var view = Managers.Template.get('web.exclusionNav', {
                clubs: this.clubs,
                validSelected: this.validSelected
            });

            this.render(this.nav, view);

        },

        fetchContent: function() {

            var self = this;

            this.render(this.contents, '<div class="loader"></div>');

            // fetch the games
            Services.Cms.GameService.getGames('slot_machines', this.validSelected ? this.validSelected : this.clubs[0].key )
                .then( function ( res ) {

                    var items = _.filter( res.items, function( item ) {

                        return item.exclusionList;

                    });

                    self.renderContent(items);

                });

        },

        renderContent: function(items) {

            var view = Managers.Template.get('web.exclusionContent', {
                datalist: items
            });

            this.render(this.contents, view);

            DataTable.render(this.gameListTable).page(0);

        }

    });

})(
    Q,
    Pt.Services,
    Pt.Config,
    Pt.Managers,
    Pt.Helpers.DataTable,
    Pt.Core.Router,
    Pt.Settings,
    _.clone(Pt.Controllers.AbstractController)
);
(function ( Router,
    Cookie,
    HttpClient,
    Settings,
    absCtrl ) {

    "use strict";

    _.Class( 'Pt.Controllers.TrackingController', BaseTrackerController );

    function BaseTrackerController() { }

    BaseTrackerController.prototype = _.extend( absCtrl, {

        init: function () {

            var context = Router.getContext();
            var self = this;

            var aId = Cookie.get( 'affiliateid' );
            var rawLandingPId = Cookie.get( 'landingpageid' );
            var landingPageId = ! _.isUndefined(rawLandingPId) ? parseInt(rawLandingPId, 10) : undefined;

            if ( ! _.isUndefined(aId) && aId === context.params.aid) {

                window.location.href = self._landingPageBuilder(landingPageId);

                return false;

            }

            HttpClient.post( Pt.Endpoints.urls.api.affiliate.track, {
                affiliateId: context.params.aid,
                tid: context.params.tid,
                cid: context.params.cid,
                ip: Pt.Settings.client_ip
            } )
                .then( function ( response ) {
                    Cookie.set( { name: 'affiliateid', value: context.params.aid, domain: Settings.main_domain } );
                    Cookie.set( { name: 'landingpageid', value: response.data.landingPageId } );

                    window.location.href = self._landingPageBuilder(response.data.landingPageId);

                    return false;
                    
                } )
                .fail( function () {

                    window.location.href = '/';

                } );


        },
        _landingPageBuilder : function(id) {

            if (_.isUndefined(id))  return '/';

            var landingPage = '';
            
            if (id === 1) {
                var settings = _.isEmpty(Pt.Settings.signup_settings) ? 
                            { ui_type: { type: 'page' } } : 
                            Pt.Settings.signup_settings;

                var host = window.location.protocol + '//' + window.location.host;

                landingPage = settings.ui_type.type === 'page' ? 
                    '/signup' : host + '#' + ( settings.ui_type.modal_id || 'signup' );

            
            } else if (id === 2) {

                landingPage = '/promotions';

            } else {

                landingPage = '/';

            }

            return landingPage;
            
        }

    } );


})(
    Pt.Core.Router,
    Pt.Managers.Cookie,
    Pt.Managers.HttpClient,
    Pt.Settings,
    _.clone( Pt.Controllers.AbstractController )
);
/**
 * Base Static Page Controller
 * Created by isda on 13/12/2016.
 */


(function (
    absCtrl
) {

    "use strict";

    _.Class('Pt.Controllers.BaseStaticPageController', BaseStaticPageController);

    /**
     * @namespace Pt.Controllers.BaseStaticPageController
     * @constructor
     */
    function BaseStaticPageController() {

    }

    BaseStaticPageController.prototype = _.extend(absCtrl, {

        init: function () {}

    });

})(
    _.clone(Pt.Controllers.AbstractController)
);
(function (Q,
           Rules,
           Settings,
           Helpers,
           Widgets,
           Managers,
           Services,
           WidgetService,
           Config,
           absCtrl) {

    "use strict";

    _.Class('Pt.Controllers.BaseEgamesLoginController', BaseEgamesLoginController);

    /**
     * @namespace Pt.Controllers.BaseEgamesLoginController
     * @constructor
     */
    function BaseEgamesLoginController() {

        this.container = '.main-container';
        this.pageDetails = null;
        this.formValidator = null;
        this.loginForm = '[data-js=egames-login-form]';
        this.configs = {

            api_url: '',
            api_key: '',
            class_id: ''

        };
        this.actions = [

            [this.loginForm, 'submit', "_onFormSubmit"]

        ];

    }

    BaseEgamesLoginController.prototype = _.extend(absCtrl, {


        resolve: function (next) {

            var self = this;
            WidgetService.get('egames_login_config')
                .then(function (configs) {

                    self.configs = configs;

                }).finally(function () {

                    next();

                });


        },


        init: function () {

            var self = this;

            var view = Managers.Template.get('web.egamesLoginPage', {

                logo: Settings.logo,
                title: Settings.operator.name,
                configs: self.configs,
                toShowForm : Settings.member.isLoggedIn,
                livechat_link: Settings.livechat_link

            });

            this.render(this.container, view);

            if (this.formValidator !== null) {

                this.formValidator.destroy();
                this.formValidator = null;

            }

            this.formValidator = new Managers.Validation(this.loginForm, Rules.validation.login);
            this.formValidator.bindInput(true).init();

            this._bindEvents();

            if(Settings.member.isLoggedIn){

                this.initVendorAuthentication();

            }


        },
        _onFormSubmit: function (e) {

            e.preventDefault();
            e.stopPropagation();
            var self = e.data.context;
            self.formValidator.validate(self._onValidationSuccess, self);


        },

        _onValidationSuccess: function (data, self) {

            Helpers.Nprogress.start();

            self.inProgress = true;

            Helpers.Form.lockForm(self.loginForm, true);

            var username = _.findWhere(data, {name: 'username'});
            var password = _.findWhere(data, {name: 'password'});

            Services.Members.SessionService.login(username.value, password.value)
                .then(function (result) {

                    Managers.Analytics.trackEvent(
                        Managers.Analytics.eventMap.MEMBER_ACTIONS,
                        Managers.Analytics.actionMap.LOG_IN_SUCCESS,
                        username.value
                    );

                    Managers.Cookie.set({name: Config.tokenKey, value: result.token, expires: -1});
                    Managers.Cookie.set({name: Config.msSessionKey, value: result.sessionId, expires: -1});

                    Managers.Cookie.set({name: Config.tokenKey, value: result.token, domain: Settings.main_domain});
                    Managers.Cookie.set({name: Config.msSessionKey, value: result.sessionId, domain: Settings.main_domain});

                    location.reload();

                })
                .fail(function (e) {

                    self.inProgress = false;

                    Helpers.Form.lockForm(self.loginForm, false);

                    if (e.length) {

                        Managers.Analytics.trackEvent(
                            Managers.Analytics.eventMap.MEMBER_ACTIONS,
                            Managers.Analytics.actionMap.LOG_IN_FAIL,
                            e[0].message
                        );

                    }

                    Helpers.Nprogress.done();

                    Helpers.Error.show(e);

                });

        },

        initVendorAuthentication: function(){

            var self = this;
            var datestamp = moment().format('YYYYMMDDhhmmss');
            var token = Managers.Cookie.get('s');
            var params = {

                'op': Settings.app,
                'token': token,
                'datestamp': datestamp,
                'sign': md5(token + datestamp + self.configs.api_key),
                'service_endpoint':self.configs.api_url

            };

            var user_id = Settings.member.code;

            Helpers.Nprogress.start();


            Services.Members.GameAuthenticationService.login(params).then(function(data){

                Settings.member.isLoggedIn = true;
                Managers.Cookie.set({name: Config.tokenKey, value: '', expires: -1 });
                Managers.Cookie.set({name: Config.msSessionKey, value: '', expires : -1});
                Managers.Cookie.set({name: Config.tokenKey, value: '', expires: -1, domain: Settings.app_domain });
                Managers.Cookie.set({name: Config.msSessionKey, value: '', expires : -1, domain: Settings.app_domain});

                try{
                    var tokenpwd = md5(params.sign);
                    window.external.Js2CppEvent (user_id, tokenpwd, params.token);
                    window.SetUserInfor(user_id,tokenpwd);

                }catch(e){}


            }).fail(function(e){

                Helpers.Error.show(e);
                Settings.member.isLoggedIn = false;
                self.init();

            }).finally(function(){

                Helpers.Nprogress.done();



            });

        }


    });

})(
    Q,
    Pt.Rules,
    Pt.Settings,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    Pt.Services.Cms.WidgetService,
    Pt.Config,
    _.clone(Pt.Controllers.AbstractController)
);
(function(
    $,
    $q,
    Template,
    WidgetService,
    GameIntegration,
    Validation,
    Rules,
    Helpers,
    Settings,
    AbstractController
) {
    'use strict';

    _.Class('Pt.Controllers.IDNPokerController', IDNPokerController);

    function IDNPokerController() {
        
        this.view = 'web.idnPoker';
        this.subViews = {
            index: 'web.idnPokerAccount',
            create: 'web.idnPokerCreateAccount',
            update: 'web.idnPokerUpdatePassword',
            success: 'web.idnPokerRegistrationSuccess'
        };

        this.container = '[data-js=page-container]';
        this.subContainer = '[data-js=sub-container]';
        this.form = '[data-js=idn-poker-registration]';

        this.actions = [
            [this.form, 'submit', '_onFormSubmit'],
            ['.update-pass-link', 'click', '_onUpdatePasswordClick'],
            ['.change-cancel', 'click', '_onCancelChangePasswordClick']
        ];
    }

    IDNPokerController.prototype = Object.create(AbstractController);

    _.extend(IDNPokerController.prototype, {

        constructor: IDNPokerController,

        resolve: function(next) {

            var self = this
                , promises = [
                    GameIntegration.getIDNPokerAccount(),
                    WidgetService.get('idn_poker_registration')
                ];

            $q
                .all(promises)
                .then(function(response) {
                    self.account = response[0];
                    self.settings = response[1] || {};
                })
                .finally(function() {
                    next();
                });
        },

        init: function() {

            var self = this
                , view
                , subView;

            if (! this.account.loginId || ! this.account.password) {
                subView = this._getCreateAccountView(this.settings);
            } else {
                subView = this._getAccountView(this.account, this.settings);
            }

            view = Template.get(this.view, {
                settings: self.settings || {},
                subContent: subView
            });

            this.render(this.container, view)
                ._bindEvents();

            $('[data-toggle="tooltip"]').tooltip();
        },

        _onFormSubmit: function(e) {

            e.preventDefault();

            var self = e.data.context;

            var validator = new Validation(self.form, Rules.validation.idnPoker);
            validator.bindInput(true).init();
            validator.validate(self._onValidationSuccess, self);
        },

        _onUpdatePasswordClick: function(e) {

            e.preventDefault();

            var self = e.data.context
                , view = self._getUpdatePasswordView(self.account, self.settings);

            $(self.subContainer).html(view);
            $('[data-toggle="tooltip"]').tooltip();

            self._bindEvents();
        },

        _onCancelChangePasswordClick: function(e) {

            e.preventDefault();

            var self = e.data.context
                , view = self._getAccountView(self.account, self.settings);

            $(self.subContainer).html(view);

            self._bindEvents();
        },

        _getAccountView: function(account, settings) {

            var welcomeMessage = _.str_replace_key({
                    ':memberCode': Settings.member.code
                }, _.trans('poker.idn_welcome_message'));

            return Template.get(this.subViews.index, {
                welcomeMessage: welcomeMessage,
                username: account.loginId,
                download: settings.download
            });
        },

        _getCreateAccountView: function(settings) {

            var loginIdValidation
                , passwordValidation;

            loginIdValidation = this._validationRulesAsHTML(! _.isEmpty(settings.validation_messages) ? settings.validation_messages.login_id : []);
            passwordValidation = this._validationRulesAsHTML(! _.isEmpty(settings.validation_messages) ? settings.validation_messages.password : []);

            loginIdValidation = _.str_replace_key({ ':title': _.trans('poker.idn_label_username_rules') }, loginIdValidation);
            passwordValidation = _.str_replace_key({ ':title': _.trans('poker.idn_label_password_rules') }, passwordValidation);

            return Template.get(this.subViews.create, {
                loginIdValidation: loginIdValidation,
                passwordValidation: passwordValidation
            });
        },

        _getUpdatePasswordView: function(account, settings) {

            var passwordValidation = this._validationRulesAsHTML(! _.isEmpty(settings.validation_messages) ? settings.validation_messages.password : []);

            passwordValidation = this._validationRulesAsHTML(! _.isEmpty(settings.validation_messages) ? settings.validation_messages.password : []);
            
            passwordValidation = _.str_replace_key({ ':title': _.trans('poker.idn_label_password_rules') }, passwordValidation);

            return Template.get(this.subViews.update, {
                username: account.loginId,
                passwordValidation: passwordValidation
            });
        },

        _getSuccessfulRegistrationView: function(settings) {

            return Template.get(this.subViews.success, {
                download: settings.download
            });
        },

        _validationRulesAsHTML: function(rules) {

            if (! rules || ! rules.length) {
                return '';
            }

            var html = '<div class="title_tooltip">:title</div><ul class="poker_reg_tips">';
            _.each(rules, function(rule) {
                html += '<li>' + rule + '</li>';
            });

            return _.escapeHTML(html + '</ul>');
        },

        _onValidationSuccess: function(data, self) {

            var self = this
                , body = {}
                , result;

            _.each(data, function(item) {
                body[item.name] = item.value;
            });

            Helpers.Nprogress.start();

            if (body.isUpdate === '1') {
                result = self._updatePassword(body);
            } else {
                result = self._createAccount(body);
            }

            result
                .then(function(response) {
                    self.account = response;

                    var view;

                    if (body.isUpdate === '1') {
                        Helpers.Notify.success(_.trans('poker.idn_update_success_message'));
                        view = self._getAccountView(self.account, self.settings);
                    } else {
                        view = self._getSuccessfulRegistrationView(self.settings);
                    }

                    $(self.subContainer).html(view);
                })
                .catch(function(error) {
                    Helpers.Error.show(error);
                })
                .finally(function() {
                    Helpers.Nprogress.done();
                });
        },

        _createAccount: function(data) {

            return GameIntegration.createIDNPokerAccount(data);
        },

        _updatePassword: function(data) {

            return GameIntegration.updateIDNPokerAccountPassword(data);
        }
    });

})(
    jQuery,
    Q,
    Pt.Managers.Template,
    Pt.Services.Cms.WidgetService,
    Pt.Services.Members.GameIntegration,
    Pt.Managers.Validation,
    Pt.Rules,
    Pt.Helpers,
    Pt.Settings,
    _.clone(Pt.Controllers.AbstractController)
);


/**
* PrometheusFrontend
* Created by isda on 13/12/2016.
*/

(function (
    Widgets,
    _baseHomeController) {

    _.Class('Pt.Controllers.HomeController', HomeController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.HomeController
     * @constructor
     */
    function HomeController() {

        function Class() {

            _baseHomeController.call(this);

        }

        Class.prototype = Object.create(_baseHomeController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

            init: function () {

                Widgets.SportsMatch.activate();
                Widgets.SportsLiveFeed.activate();
                Widgets.Jackpot.activate();

            }

        }, Pt.Core.Extend('Controllers.HomeController'));

        return new Class();

    }

}
)(
    Pt.Widgets,
    Pt.Controllers.BaseHomeController
);

/**
 * PrometheusFrontend
 * Created by isda on 15/12/2016.
 */

(function (_baseSignupController) {

    _.Class('Pt.Controllers.SignupController', SignupController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.SignupController
     * @constructor
     */
    function SignupController() {

        function Class() {

            _baseSignupController.call(this);

        }

        Class.prototype = Object.create(_baseSignupController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Controllers.SignupController'));

        return new Class();

    }

})(
    Pt.Controllers.BaseSignupController
);
/**
 * PrometheusFrontend
 * Created by isda on 15/12/2016.
 */

(function (_baseLoginController) {

    _.Class('Pt.Controllers.LoginController', LoginController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.LoginController
     * @constructor
     */
    function LoginController() {

        function Class() {

            _baseLoginController.call(this);

        }

        Class.prototype = Object.create(_baseLoginController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Controllers.LoginController'));

        return new Class();

    }

})(
    Pt.Controllers.BaseLoginController
);
/**
 * PrometheusFrontend
 * Created by isda on 15/12/2016.
 */

(function (_baseForgotLoginController) {

    _.Class('Pt.Controllers.ForgotLoginController', ForgotLoginController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.ForgotLoginController
     * @constructor
     */
    function ForgotLoginController() {

        function Class() {

            _baseForgotLoginController.call(this);

        }

        Class.prototype = Object.create(_baseForgotLoginController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Controllers.ForgotLoginController'));

        return new Class();

    }

})(
    Pt.Controllers.BaseForgotLoginController
);
/**
* Slots Controller
* Created by isda on 13/12/2016.
*/

(function (
        Q,
        GameSettings,
        Widgets,
        Managers,
        Services,
        _baseSlotsController ) {

    'use strict';

    _.Class('Pt.Controllers.SlotsController', SlotsController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.SlotsController
     * @constructor
     */
    function SlotsController() {

        function Class() {

            _baseSlotsController.call(this);

        }

        Class.prototype = Object.create(_baseSlotsController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Controllers.SlotsController'));

        return new Class();

    }

}
)(
    Q,
    Pt.GameSettings,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    Pt.Controllers.BaseSlotsController
);

/**
* Slots Controller
* Created by isda on 13/12/2016.
*/

(function (
        Q,
        GameSettings,
        Widgets,
        Managers,
        Services,
        _baseSlotsLandingController ) {

    'use strict';

    _.Class('Pt.Controllers.SlotsLandingController', SlotsLandingController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.SlotsLandingController
     * @constructor
     */
    function SlotsLandingController() {

        function Class() {

            _baseSlotsLandingController.call(this);

        }

        Class.prototype = Object.create(_baseSlotsLandingController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Controllers.SlotsLandingController'));

        return new Class();

    }

}
)(
    Q,
    Pt.GameSettings,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    Pt.Controllers.BaseSlotsLandingController
);

/**
* PrometheusFrontend
* Created by isda on 13/12/2016.
*/

(function (_baseCasinoController) {

    _.Class('Pt.Controllers.CasinoController', CasinoController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.CasinoController
     * @constructor
     */
    function CasinoController() {

        function Class() {

            _baseCasinoController.call(this);

        }

        Class.prototype = Object.create(_baseCasinoController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Controllers.CasinoController'));

        return new Class();

    }

}
)(
    Pt.Controllers.BaseCasinoController
);

/**
* PrometheusFrontend
* Created by isda on 13/12/2016.
*/

(function (_baseGamesController) {

    _.Class('Pt.Controllers.GamesController', GamesController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.GamesController
     * @constructor
     */
    function GamesController() {

        function Class() {

            _baseGamesController.call(this);

        }

        Class.prototype = Object.create(_baseGamesController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Controllers.GamesController'));

        return new Class();

    }

}
)(
    Pt.Controllers.BaseGamesController
);

/**
* PrometheusFrontend
* Created by isda on 13/12/2016.
*/

(function (_baseLotteryController) {

    _.Class('Pt.Controllers.LotteryController', LotteryController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.LotteryController
     * @constructor
     */
    function LotteryController() {

        function Class() {

            _baseLotteryController.call(this);

        }

        Class.prototype = Object.create(_baseLotteryController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Controllers.LotteryController'));

        return new Class();

    }

}
)(
    Pt.Controllers.BaseLotteryController
);

/**
* PrometheusFrontend
* Created by isda on 13/12/2016.
*/

(function (_baseSportsController) {

    _.Class('Pt.Controllers.SportsController', SportsController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.SportsController
     * @constructor
     */
    function SportsController() {

        function Class() {

            _baseSportsController.call(this);

        }

        Class.prototype = Object.create(_baseSportsController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Controllers.SportsController'));

        return new Class();

    }

}
)(
    Pt.Controllers.BaseSportsController
);

/**
* PrometheusFrontend
* Created by isda on 13/12/2016.
*/

(function (_baseMahjongController) {

    _.Class('Pt.Controllers.MahjongController', MahjongController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.MahjongController
     * @constructor
     */
    function MahjongController() {

        function Class() {

            _baseMahjongController.call(this);

        }

        Class.prototype = Object.create(_baseMahjongController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Controllers.MahjongController'));

        return new Class();

    }

}
)(
    Pt.Controllers.BaseMahjongController
);

/**
* PrometheusFrontend
* Created by isda on 13/12/2016.
*/

(function (_baseGrabController) {

    _.Class('Pt.Controllers.GrabController', GrabController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.GrabController
     * @constructor
     */
    function GrabController() {

        function Class() {

            _baseGrabController.call(this);

        }

        Class.prototype = Object.create(_baseGrabController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Controllers.GrabController'));

        return new Class();

    }

}
)(
    Pt.Controllers.BaseGrabController
);

/**
* Promo Controller
* Created by isda on 13/12/2016.
*/

(function (_basePromoController) {

    _.Class('Pt.Controllers.PromoController', PromoController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.PromoController
     * @constructor
     */
    function PromoController() {

        function Class() {

            _basePromoController.call(this);

        }

        Class.prototype = Object.create(_basePromoController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Controllers.PromoController'));

        return new Class();

    }

}
)(
    Pt.Controllers.BasePromoController
);

/**
 * PrometheusFrontend
 * Created by isda on 13/12/2016.
 */

(function (_baseInfoController) {

        _.Class('Pt.Controllers.InfoController', InfoController);

        /**
         * Home Controller
         * @namespace Pt.Controllers.InfoController
         * @constructor
         */
        function InfoController() {

            function Class() {

                _baseInfoController.call(this);

            }

            Class.prototype = Object.create(_baseInfoController.prototype);
            Class.prototype.constructor = Class;

            _.extend(Class.prototype, {

            }, Pt.Core.Extend('Controllers.InfoController'));

            return new Class();

        }

    }
)(
    Pt.Controllers.BaseInfoController
);


(function (_baseGameExclusionController) {

    _.Class('Pt.Controllers.GameExclusionController', GameExclusionController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.GameExclusionController
     * @constructor
     */
    function GameExclusionController() {

        function Class() {

            _baseGameExclusionController.call(this);

        }

        Class.prototype = Object.create(_baseGameExclusionController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Controllers.GameExclusionController'));

        return new Class();

    }

}
)(
    Pt.Controllers.BaseGameExclusionController
);

/**
* PrometheusFrontend
* Created by isda on 13/12/2016.
*/

(function (
    _baseStaticPageController
) {

    _.Class('Pt.Controllers.StaticPageController', StaticPageController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.StaticPageController
     * @constructor
     */
    function StaticPageController() {

        function Class() {

            _baseStaticPageController.call(this);

        }

        Class.prototype = Object.create(_baseStaticPageController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Controllers.StaticPageController'));

        return new Class();

    }

}
)(
    Pt.Controllers.BaseStaticPageController
);



(function (_baseEgamesLoginController) {

    _.Class('Pt.Controllers.EgamesLoginController', EgamesLoginController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.GamesController
     * @constructor
     */
    function EgamesLoginController() {

        function Class() {

            _baseEgamesLoginController.call(this);

        }

        Class.prototype = Object.create(_baseEgamesLoginController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Controllers.EgamesLoginController'));

        return new Class();

    }

}
)(
    Pt.Controllers.BaseEgamesLoginController
);


/**
 * Routing Manager
 * Created by mike on March 20, 2018
 */

/** @namespace Pt.Core.Widget */

(function () {

    "use strict";

    var routeContext = null;

    _.Class('Pt.Core.Widget', new Widget());

    /**
     * Widget Manager
     * @constructor
     */
    function Widget() {

        var instances = [];

        return {
            activate: activate,
            createWrapper: createWrapper,
            add: add,
            get: get,
            destroy: destroy
        }

        function activate(widget, widgetList) {

            var self = this;
            var widgetController = $(widget).attr('controller') ? $(widget).attr('controller').split('@') : [];
            var widgetWrapper = $(widget).attr('wrapper');

            // replace widget element with html element
            widget = self.createWrapper(widget, widgetWrapper);

            if ( widgetController.length ) {

                var widgetName = widgetController[0];
                var widgetMethod = widgetController[1];
                var widgetInstance = widgetList[widgetName];

                if ( typeof widgetInstance === 'function' ) {

                    widgetInstance = new widgetInstance();

                }

                if ( widgetInstance && widgetInstance[widgetMethod || 'activate'] ) {

                    // add the widget to instances
                    self.add(widget);

                    // give the widget element to the widget controller
                    widgetInstance.widgetContainer = widget;

                    // run the specified method
                    widgetInstance[widgetMethod || 'activate']();

                }

            }

        }

        function createWrapper(widget, customElement) {

            var wrapper = document.createElement(customElement || 'div');
            var $wrapper = $(wrapper);

            // pass all attributes of <widget> element to new html element
            _.each(widget.attributes, function(attr) {

                $wrapper.attr(attr.nodeName, attr.nodeValue);

            });

            $(widget).replaceWith($wrapper);

            return $wrapper;

        }

        function add(widget) {

            instances.push(widget);

        }

        function get(widgetKey) {

            return instances[widgetKey];

        }

        function destroy(widget) {

            if ( $(widget).destroy ) {

                $(widget).destroy();

            }

            $(widget).remove();

        }

    }

})();
/**
 * Application Hook
 * Created by isda on 23/03/2017.
 */

(function (
    Settings,
    Config,
    Helpers,
    Managers,
    Cache,
    Widgets,
    CoreWidget,
    WidgetService,
    Router,
    _bindTrait
) {

    'use strict';



    /**
     * @namespace Pt.Hooks
     * @constructor
     */
    function Hook() {

        this.loginModalEl = '[data-widget=login]';
        this.windowDefaultProperties = 'width=1050, height=785';
        this.slickEl = '[data-hook=slickers]';
        this.isFetchingData = false;

        this.activeWindows = [];

        this.loadStyle = {
            self: '_self',
            normal: '_self',
            new_window: '_blank',
            new_tab: '_blank',
            pop: 'pop',
            pop_up: 'pop',
            navigate: '_navigate',
            _self: '_self',
            _blank: '_blank'
        };

        this.behaviorMap = {
            tab: '_blank',
            pop: null,
            pop_up: null,
            self: '_self',
            navigate: '_navigate'
        };

        this.actions = [

            [ '[data-hook=module-router] a', 'click', 'onModuleRouterLinkClick' ],
            [ '[data-hook^=launch-or-signup]', 'click', 'onLaunchOrSignUpClick' ],
            [ '[data-hook^=launch-if-auth]', 'click', 'onLaunchIfAuthClick' ],
            [ '[data-hook^=launch-trial]', 'click', 'onLaunchTrialClick' ],
            [ '[data-hook^=launch-livechat]', 'click', 'onLaunchLiveChatClick' ],
            [ '[data-hook=force-numeric]', 'keydown', 'forceNumericHandler' ],
            [ '[data-hook=scroll-to]', 'click', 'onScrollToClick' ],
            [ '[data-hook=show-password]', 'click', 'onShowPasswordClick'],
            [ '[data-hook=floating-label-form] input', 'focus', "_onInputFocus" ],
            [ '[data-hook=floating-label-form] input', 'blur', "_onInputBlur" ],
            [ '[data-hook=modal-centered]', 'shown.bs.modal', '_onModalShow'],
            [ '[data-hook=to-top]', 'click', 'onToTopClick' ],
            [ '[data-hook=link]', 'click', 'onLinkClick' ],
            [ '[data-hook=modal]', 'click', 'onModalTriggerClick' ],
            [ '[data-hook=widget-modal]', 'click', 'onWidgetModalClick' ],
            [ '[data-hook=copy-to-clipboard]', 'click', 'onCopyToClipboardClick' ],
            [ '[data-hook=dl-mobile-app]', 'click', 'onDownloadMobileAppClick' ],

        ];

        EventBroker.subscribe(EventBroker.events.routes.changed, '_RouteChanged', this);
        EventBroker.subscribe(EventBroker.events.domChanged, '_DomChanged', this);

    }

    Hook.prototype = _.extend(_bindTrait, {

        init: function () {

            this.activateSlick();
            this.activateTooltips();
            this._bindEvents();
            this._generateQrCodes();

        },

        _generateQrCodes: function(){

            var $el = $("[data-hook=generate-qr-code]");

            if($el.length > 0){

                var qrCodeGenerator = Helpers.QrCode;


                $el.each(function(){

                    try{

                        var $currentEl = $(this);

                        var site = $currentEl.data('site') ||_.getMobileSite();

                        var elementId = $currentEl.attr('id');

                        //added img padding to make the qrcode more readable
                        $currentEl.addClass('qr-code-gen-wrapper');

                        if(!elementId)
                        {
                            elementId = _.uniqueId('qrGen_');
                            $currentEl.attr("id", elementId);
                        }

                        if($('#'+elementId).find('img').length > 0)
                        {
                            return;
                        }

                        var downloadPath = $currentEl.data("dl-path") || "";
                        downloadPath = _.parseUrl(downloadPath,"pathname") + _.parseUrl(downloadPath,"search");
                        downloadPath = downloadPath[0] === "/"? downloadPath.substring(1): downloadPath;

                        var url = site + downloadPath;

                        var params = {

                            id: document.getElementById(elementId),
                            height: $currentEl.attr("height") || 250,
                            width: $currentEl.attr("width") || 250,
                            url: url

                        };

                        qrCodeGenerator.generate(params);

                    }catch (e)
                    {
                        void 0;
                        void 0;
                    }

                });

            }

            return true;

        },

        /**
         * Handle Activation of Slick Elements
         */
        activateSlick: function () {

            var el = $(this.slickEl);

            var opts = _.extend(Config.slickOptions, {
                slide: ''
            });

            _.delay(function () {

                try {

                    el.slick('unslick').slick(Config.slickOptions);

                } catch (e) {

                    el.find('img').css('display', 'block');

                    el.slick(opts);

                }

            }, 1000);

        },

        activateTooltips: function() {

            $('[data-toggle="tooltip"]').tooltip();

        },

        /**
         * Handle Redirection For InterModule
         * @param e
         */
        onModuleRouterLinkClick: function (e) {

            e.preventDefault();

            var el = $(this);
            var href = el.attr('href');
            var segment = _.urlSegments(href, 0, 1);

            var m = Config.moduleMap[segment] || 'Web';

            if (Settings.module === m) {

                Router.redirect(href);

                return e;

            }

            location.href = href;

        },

        /**
         * Handle downloading of mobile app
         */
        onDownloadMobileAppClick: function (e) {

            e.preventDefault();

            var $el = $(this);

            try{

                var origin = _.getMobileSite();

                var downloadLink = $el.attr('href') || $el.data('dl-path');

                //get clean download path
                downloadLink = _.parseUrl(downloadLink,"pathname") + _.parseUrl(downloadLink,"search");
                downloadLink = downloadLink[0] === "/"? downloadLink.substring(1): downloadLink;

                var link = origin + downloadLink;

                window.open(link);

            }catch (e)
            {
                void 0;
            }

        },

        /**
         * Handle Signup or Launch when clicked
         * @usage data-js="launch-or-signup|tab,pop,self|modal,redirect"
         * @param e
         * @return {Pt.Hook}
         */
        onLaunchOrSignUpClick: function (e) {

            e.preventDefault();
            e.stopPropagation();

            var self = e.data.context;

            var hook = $(this).attr('data-hook').split('|');
            var loadStyle = $(this).attr('data-load-style');
            var windowProps = $(this).attr('data-pop-properties');

            var ls = self.loadStyle[ hook[1] || 'pop_up'];

            ls = self.loadStyle[loadStyle] || ls;

            if (Managers.Cookie.get(Config.tokenKey)) {

                var href = $(this).attr('href') || $(this).data('href');

                if (ls === 'pop' ) {

                    self._launchWindow(href, 'LaunchOrSignUp', windowProps || self.windowDefaultProperties );

                } else {

                    self._launchWindow(href, ls);

                }



                return this;

            }

            var signupTypeHandler = {

                redirect: function () {

                    location.href = '/signup';

                },

                modal: function () {

                    $('[data-widget=signup]').modal('show');

                }
            };

            signupTypeHandler[hook[2] || 'redirect']();

        },

        /**
         * Handle Launch After Authenticate
         * @usage data-js="launch-if-auth|tab,pop,_self,_blank"
         * @param e
         * @return {Pt.Hook}
         */
        onLaunchIfAuthClick: function (e) {

            e.preventDefault();
            e.stopPropagation();

            var self = e.data.context;

            var hook = $(this).attr('data-hook').split('|');
            var loadStyle = $(this).attr('data-load-style');
            var windowProps = $(this).attr('data-pop-properties');


            var ls = self.loadStyle[hook[1] || 'pop_up'];

            ls = self.loadStyle[loadStyle] || ls;

            if (Managers.Cookie.get(Config.tokenKey)) {

                var href = $(this).attr('href') || $(this).data('href');

                var launch = {

                    _self: function () {

                        location.href = href;

                    },

                    _navigate: function () {

                        Router.navigate(href);

                    },

                    _blank: function () {

                        self._launchWindow(href, ls, '');

                    },

                    pop: function () {

                        self._launchWindow(href, 'LaunchIfAuthHook', windowProps || self.windowDefaultProperties);

                    }
                };

                launch[ls]();

                return this;

            }

            $(self.loginModalEl).modal('show');

            var dropLogin = $('[data-js=dropdown-login]');

            if (dropLogin.length) {

                dropLogin.addClass('open');

            }

        },

        /**
         * Handle Launch Trial Mode
         * @usage data-js="launch-trial|tab,pop,_self,_blank"
         * @param e
         * @return {Pt.Hook}
         */
        onLaunchTrialClick: function (e) {

            e.preventDefault();
            e.stopPropagation();

            var self = e.data.context;

            var hook = $(this).attr('data-hook').split('|');
            var loadStyle = $(this).attr('data-load-style');
            var windowProps = $(this).attr('data-pop-properties');


            var ls = self.loadStyle[hook[1] || 'pop_up'];

            ls = self.loadStyle[loadStyle] || ls;

            var href = $(this).attr('href') || $(this).data('href');

            var launch = {

                _self: function () {

                    location.href = href;

                },

                _navigate: function () {

                    Router.navigate(href);

                },

                _blank: function () {

                    self._launchWindow(href, ls, '');

                },

                pop: function () {

                    self._launchWindow(href, 'LaunchOnTrialHook', windowProps || self.windowDefaultProperties);

                }
            };

            launch[ls]();

            return this;

        },

        /**
         * @usage data-js="launchLivechat|tab,pop,_self,_blank"
         * @param e
         * @return {Pt.Hook}
         */
        onLaunchLiveChatClick: function (e) {

            e.preventDefault();

            var self = e.data.context;

            var hook = $(this).attr('data-hook').split('|');
            var loadStyle = $(this).attr('data-load-style');
            var windowProps = $(this).attr('data-pop-properties');
            var href = $(this).attr('href') || $(this).data('href');

            var ls = self.loadStyle[hook[1] || 'pop_up'];

            ls = self.loadStyle[loadStyle] || ls;


            if (ls === 'pop' ) {

                self._launchWindow(href, 'LaunchLivechat', windowProps || self.windowDefaultProperties );

            } else {

                self._launchWindow(href, ls);

            }

        },

        /**
         * Handle Force numeric on input
         * @param e
         */
        forceNumericHandler: function (e) {

            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== - 1 ||
                // Allow: Ctrl+A, Command+A
                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40)) {

                // let it happen, don't do anything
                return;

            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {

                e.preventDefault();

            }

        },

        /**
         * Handle Smooth Scrolling
         * target based on href
         * @param e
         */
        onScrollToClick: function (e) {

            e.preventDefault();

            var el = $(this);
            var id = el.attr('href');
            var targetEl = $(id);

            if (targetEl.length) {

                $('html,body').animate({
                    scrollTop: targetEl.offset().top - 100
                }, 1000);

            }

        },

        /**
         * Handle Show Password
         * @param e
         */
        onShowPasswordClick: function (e) {

            e.preventDefault();

            var el = $(this);
            var input = el.closest('div').find('[data-js=show-password]');

            if (el.hasClass('active')) {

                if (input.attr('type') == 'password') {
                    input.attr('type', 'password');
                } else {
                    input.addClass('conceal');
                }

                el.removeClass('active');

            } else {

                if (input.attr('type') == 'password') {
                    input.attr('type', 'text');
                } else {
                    input.removeClass('conceal');
                }

                el.addClass('active');

            }

        },

        onToTopClick: function (e) {

            e.preventDefault();

            $("html, body").animate({ scrollTop: 0 }, 300);

        },

        onLinkClick: function(e) {

            e.preventDefault();

            location.href = $(this).attr('href');

        },

        onModalTriggerClick: function (e) {

            e.preventDefault();

            var id = $(this).data('target');

            $(id).modal('show');

        },

        onWidgetModalClick: function(e) {

            e.preventDefault();

            var self = e.data.context,
                widgetId = $(this).data('widget'),
                widgetProperty = $(this).data('widget-property'),
                modalSize = $(this).data('modal-size');

            if ( widgetId && ! self.isFetchingData ) {

                Helpers.Nprogress.start();
                self.isFetchingData = true;

                WidgetService.get(widgetId).then(function(res) {

                    Helpers.Modal.generic(
                        _.propertyValue(res, widgetProperty), 
                        { additionalClass: 'widget-modal ' + widgetId + ( modalSize ? ' ' + modalSize : '' ) }
                    );

                    Helpers.Nprogress.done();
                    self.isFetchingData = false;

                });

            }

        },

        onCopyToClipboardClick: function(e) {

            e.preventDefault();
            var button = $(this);

            if ( button.data('target') ) {

                var target = $(button.data('target'));

                if ( target.length ) {

                    target = target[0];
        
                    var range, selection;

                    if ( $(target).is('input') ) {

                        $(target).select();
                        document.execCommand('copy');

                    } else if ( document.body.createTextRange ) {

                        range = document.body.createTextRange();
                        range.moveToElementText(target);
                        range.select();
                        document.execCommand('copy');

                    } else if ( window.getSelection ) {

                        selection = window.getSelection();        
                        range = document.createRange();
                        range.selectNodeContents(target);
                        selection.removeAllRanges();
                        selection.addRange(range);
                        document.execCommand('copy');

                    }

                }

            }

        },

        /**
         * Handle Route Change Event
         * @param requestContext
         * @private
         */
        _RouteChanged: function (requestContext) {

            this._navHighlighter(requestContext);
            this._bindWidgets();

        },

        /**
         * Handle Navigation activation
         * @param context
         * @private
         */
        _navHighlighter: function (context) {

            var el = $('[data-ui-active-uri^="/' + _.urlSegments(context.path, 0, 2) + '"]');
            var uriElements = '[data-ui-active-uri^="/"]';

            $(uriElements).removeClass('active');

            if (el.length) {

                el.addClass('active');

            }

            var exactEl = $('[data-ui-active-uri-exact="' + context.path + '"]');
            var exactUriElements = '[data-ui-active-uri-exact^="/"]';

            $(exactUriElements).removeClass('active');

            if (exactEl.length) {

                exactEl.addClass('active');

            }

        },


        /**
         * Handle Floating Label on Focus
         * @private
         */
        _onInputFocus: function () {

            var onClass = "input-has-focus";

            var label = $(this).closest('.form-group').find("label:first");

            label.addClass(onClass);

        },

        /**
         * Handle Floating Label on Blur
         * @private
         */
        _onInputBlur: function () {

            var onClass = "input-has-focus";
            var showClass = "input-has-value";

            var label = $(this).closest('.form-group').find("label:first");

            var el = $(this);

            if (! _.isEmpty(el.val())) {

                label.addClass(showClass);

            } else {

                label.removeClass(onClass);
                label.removeClass(showClass);

            }

        },

        _onModalShow: function () {

            var _modal = $(this);

            if ( _modal.innerHeight() <= _modal.find('.modal-dialog').innerHeight() + 60) {

                _modal.addClass('modal-large-content');

            } else {

                _modal.removeClass('modal-large-content');

            }

        },

        _launchWindow: function(href, name, props) {

            var openedWindow = null;

            if (props) {

                openedWindow = window.open( href, name, props);

            } else {

                openedWindow = window.open( href, name);

            }

            //TODO: think of a way for redirecting launchers
            // Widgets.FreezeTimer.freezeTime(openedWindow);
            // this._checkWindowInstance(openedWindow);
        },

        _checkWindowInstance: function(openedWindow){

            if(!Settings.member.isLoggedIn)
            {
                return;
            }

            var isRedirectLauncher = false;

            var isClosedTimer = setInterval(function(){

                try{

                    var currentUrl = openedWindow.location.href;

                    if(currentUrl !== 'about:blank')
                    {
                        clearInterval(isClosedTimer);
                    }

                }catch(e){
                    //game redirected
                    isRedirectLauncher = true;
                }

                if(isRedirectLauncher && openedWindow.closed)
                {
                    var fTimer = Widgets.FreezeTimer;

                    fTimer._removeFromActiveWindows(fTimer);

                    if(!fTimer.hasActiveWindows()){

                        Cache.set('lastActionTime', moment());

                    }

                    clearInterval(isClosedTimer);
                }

            }, 1000);

        },

        _bindWidgets: function(container) {

            var self = this;

            var widgets = $(container || 'body').find('widget');

            if ( widgets.length ) {

                _.each(widgets, function(widget) {

                    CoreWidget.activate(widget, Widgets);

                });

            }

        },

        _DomChanged: function(domChangeData) {

            if ( domChangeData && domChangeData.container ) {

                this._bindWidgets(domChangeData.container);

            }

        },

    });

    _.Class('Pt.Hooks', new Hook());

})(
    Pt.Settings,
    Pt.Config,
    Pt.Helpers,
    Pt.Managers,
    Pt.Managers.Cache,
    Pt.Widgets,
    Pt.Core.Widget,
    Pt.Services.Cms.WidgetService,
    Pt.Core.Router,
    _.clone(Pt.Core.BindTrait)
);

/**
 * @namespace Pt
 *
 * Prom Routes
 * Created by isda on 08/02/2017.
 */

(function () {

    /**
     * @namespace Pt.Routes
     * @type {{}}
     */
    var Routes = {

        web: [
            {
                route: "/",
                controller: 'Pt.Controllers.HomeController@init'
            },

            {
                route: "/signup",
                controller: 'Pt.Controllers.SignupController@init'
            },

            {
                route: "/signup/second-step",
                controller: 'Pt.Controllers.SignupController@secondStep'
            },

            {
                route: "/signup/last-step/:methodId?",
                controller: 'Pt.Controllers.SignupController@finalStep'
            },

            {
                route: "/sports",
                controller: 'Pt.Controllers.SportsController@init'
            },

            {
                route: "/slots/",
                controller: 'Pt.Controllers.SlotsLandingController@init'
            },

            {
                route: "/slots/:club",
                controller: 'Pt.Controllers.SlotsController@init'
            },

            {
                route: "/casino",
                controller: 'Pt.Controllers.CasinoController@init'
            },

            {
                route: "/games",
                controller: 'Pt.Controllers.GamesController@init'
            },

            {
                route: "/p2p",
                controller: 'Pt.Controllers.GamesController@init'
            },

            {
                route: "/fishing",
                controller: 'Pt.Controllers.GamesController@init'
            },

            {
                route: "/egames/login/",
                controller: 'Pt.Controllers.EgamesLoginController@init'
            },

            {
                route: "/lottery",
                controller: 'Pt.Controllers.LotteryController@init'
            },

            {
                route: "/texas-mahjong",
                controller: 'Pt.Controllers.MahjongController@init'
            },

            {
                route: "/refer-a-friend",
                controller: 'Pt.Controllers.GrabController@init'
            },

            {
                route: "/tournaments",
                controller: 'Pt.Controllers.TournamentsController@init'
            },

            {
                route: "/promotions/:category?/:promoId?",
                controller: 'Pt.Controllers.PromoController@init'
            },

            {
                route: "/article/:category?/:articleId?",
                controller: 'Pt.Controllers.ArticleController@init'
            },

            {
                route: "/content/:category?/:articleId?",
                controller: 'Pt.Controllers.ArticleController@init'
            },

            {
                route: "/info-center/:category?/:slug?",
                controller: 'Pt.Controllers.InfoController@init'
            },

            {
                route: "/exclusion/:category?",
                controller: 'Pt.Controllers.GameExclusionController@init'
            },

            {
                route: "/tracker/:aid/:cid?/:tid?",
                controller: 'Pt.Controllers.TrackingController@init'
            },

            {
                route: "/external-signup",
                controller: 'Pt.Controllers.SignupController@external'
            },
            {
                route: "/spin-wheel",
                controller: 'Pt.Controllers.PromoController@initSpinWheel'
            },
            {
                route: "/poker/idn/account",
                controller: 'Pt.Controllers.IDNPokerController@init'
            },
            {
                route: "/:page?/:subpage?",
                controller: 'Pt.Controllers.StaticPageController@init'
            }
        ],

        profile: [

            {
                route: "/profile/edit",
                controller: 'Pt.Controllers.MemberController@init'
            },

            {
                route: "/profile/delivery-address",
                controller: 'Pt.Controllers.DeliveryAddressController@init'
            },

            {
                route: "/profile/change-password",
                controller: 'Pt.Controllers.PasswordController@init'
            },

            {
                route: "/profile/banking-details",
                controller: 'Pt.Controllers.BankDetailsController@init'
            },

            {
                route: "/profile/private-messages/:module?/:messageId?",
                controller: 'Pt.Controllers.PrivateMessageController@init'
            },
            {
                route: "/profile/verify-sms",
                controller: 'Pt.Controllers.VerifyAccountController@init'
            },
            {
                route: "/profile/verify-email",
                controller: 'Pt.Controllers.VerifyAccountController@init'
            }
        ],

        funds: [

            {
                route: "/funds/transfer",
                controller: 'Pt.Controllers.FundTransferController@init'
            },

            {
                route: "/funds/freebet",
                controller: 'Pt.Controllers.FreeBetController@init'
            },

            {
                route: "/funds/rebate",
                controller: 'Pt.Controllers.RebateController@init'
            },

            {
                route: "/funds/history/:type?",
                controller: 'Pt.Controllers.HistoryController@init'
            },

            {
                route: "/funds/deposit/:type?",
                controller: 'Pt.Controllers.DepositController@init'
            },

            {
                route: "/funds/withdrawal/:method?",
                controller: 'Pt.Controllers.WithdrawalController@init'
            },

            {
                route: "/cashier/transfer",
                controller: 'Pt.Controllers.FundTransferController@init'
            },

            {
                route: "/cashier/deposit/:type?",
                controller: 'Pt.Controllers.DepositController@init'
            },

            {
                route: "/cashier/withdrawal/:method?",
                controller: 'Pt.Controllers.WithdrawalController@init'
            }


        ]

    };

    _.Class('Pt.Routes', Routes);

})();
/**
 * PrometheusFrontend
 * Created by isda on 13/12/2016.
 */

/** @namespace Pt.GameSettings */
/** @namespace Pt.GameSettings.filterDefaults */
/** @namespace Pt.Settings */
/** @namespace Pt.Settings.jackpotValue */

/** @namespace Pt.Contracts */


(function (
    $,
   _,
   $q,
   Settings,
   Helpers,
   Widgets,
   Components,
   Managers,
   Config,
   WidgetService
) {

    "use strict";

    _.Class('Pt.BaseBootstrap', Bootstrap);

    var NonShowableException = [
        /api\/v2\/announcements/g,
        /api\/v2\/members\/[a-zA-z]*\/favorite-slot-games/g,
        /members\/session-check[\w\W]*/g
    ];

    /**
     * @namespace Pt.BaseBootstrap
     * @constructor
     */
    function Bootstrap() {

        if (! window.location.origin) {

            window.location.origin =
                window.location.protocol + "//" + window.location.hostname +
                (window.location.port ? ':' + window.location.port : '' );

        }



    }

    Bootstrap.prototype = {

        boot: function () {

            this.shareSession();
            this.bootHooks();
            this.bootModalBehavior();
            this.userAgentCustom();
            this.bootBladeTranslator();
            this.cleanUrlParams();

            var defer = $q.defer();

            var promises = [
                Managers.Template.init()
            ];

            if ( _.propertyValue(Settings, 'cache_settings.' + Settings.site.toLowerCase() + '.active') === 'true' ) {
                
                var bundleMap = {
                    MemberSite: 'member-bundle',
                    AffiliateSite: 'affiliate-bundle'
                };

                promises.push(WidgetService.getBundle(bundleMap[Settings.site]));

            }

            $q.all(promises).then(function () {

                defer.resolve(true);

            }).fail(function (e) {

                defer.reject(e);

            });

            return defer.promise;

        },

        bootWidgets: function () {

            Widgets.Banners.activate({ banner_page: Settings.banner_page });

            var handlers = {

                MemberSite: function () {

                    Widgets.Announcements.activate();
                   

                    if (! Settings.member.isLoggedIn) {

                        Widgets.ForgotLogin.activate();
                        Widgets.Login.activate();
                        Widgets.Signup.activate();

                    } else {
                        Widgets.Confetti.activate();
                        Widgets.IdleCheck.activate();

                        if ( Widgets.QuickFundTransfer ) {
                            
                            Widgets.QuickFundTransfer.activate();
                            
                        }                        

                    }


                    Widgets.Splash.activate();
                    Widgets.FloatingSideNav.activate();

                },

                AffiliateSite: function () {

                    Widgets.AffiliateAnnouncements.activate();

                    if ( Settings.affiliate && ! Settings.affiliate.isLoggedIn) {

                        Widgets.AffiliateLogin.activate();
                        Widgets.ForgotLogin.activate();

                    }

                }
            };

            handlers[Settings.site]();

        },

        bootComponents: function () {

            Components.Header.init();
            

        },

        bootHooks: function () {

            Pt.Hooks.init();
            Pt.Helpers.Hook.run();

            if (Pt.Settings.session_polling &&
                Pt.Managers.Session &&
                Pt.Settings.site === 'MemberSite') {

                Pt.Managers.Session.handle();

            }

            // set locale
            if (Config.languages[Managers.Cookie.get('lang')]) {

                moment.locale(Config.languages[Managers.Cookie.get('lang')].locale);

            }

            this.extendValidation();

            var checkUrlException = function (exception, obj) {

                var flag = false;

                _.each(exception, function (pattern) {

                    if (pattern.test(obj)) {

                        flag = true;

                    }

                });

                return flag;

            };

            EventBroker.subscribe(EventBroker.events.memberUnauthorized, function (obj) {

                if (checkUrlException(NonShowableException, obj)) {

                    return this;

                }

                Helpers.Notify.error(_.trans('errors.session_expired_notification'), 0);

            });


            EventBroker.subscribe(EventBroker.events.requestTimeout, function (obj) {

                if (checkUrlException(NonShowableException, obj)) {

                    return this;

                }

                Helpers.Notify.error(_.trans('errors.request_timeout_notification'), 0);


            });

            _.mixin({

                include: function (view, data) {

                    data = _.isArguments(data) ? data[0] : data;

                    return Managers.Template.get(view, data);

                }

            });

        },

        bootModalBehavior: function () {

            if (! $('.hero').length) {

                $('body').addClass('no-banner');

            }

            $(document).on('show.bs.modal', function(e) {

                var active_modal = $('.modal.fade.in');
                if ( active_modal[0] !== e.target && e.namespace === 'bs.modal' ) {

                    $(active_modal[0]).modal('hide');

                }

            });

        },

        bootBladeTranslator: function(){

            var translatableElem = $('[data-trans]');

            var elem = null;

            $.map(translatableElem, function(i){

                elem = $(i);

                elem.html(_.trans(elem.data('trans')));

            });

        },

        extendValidation: function () {

            // Before using it we must add the parse and format functions
            // Here is a sample implementation using moment.js
            //noinspection JSUnresolvedVariable,JSUnresolvedFunction
            validate.extend(validate.validators.datetime, {
                // The value is guaranteed not to be null or undefined but otherwise it
                // could be anything.
                parse: function (value) {

                    return + moment.utc(value);

                },
                // Input is a unix timestamp
                format: function (value, options) {

                    var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
                    return moment.utc(value).format(format);

                }
            });

            validate.validators.creditCardExpiry = function (value, options, key, attributes) {

                var month = $("[data-validation-key=expiry-month]");
                var year = $("[data-validation-key=expiry-year]");

                if (year.val() !== '' && month.val() !== '') {

                    var expiryDate = moment(year.val() + '-' + month.val());
                    var currentDate = moment(moment().year() + '-' + moment().month());
                    var diff = expiryDate.diff(currentDate);

                    if (diff <= 0 || isNaN(diff)) {

                        return options.message;

                    }

                }

            };

            validate.validators.emails = function (value, options, key, attributes) {

                var emails = $("[data-validation-key=array-of-emails]");
                var hasDuplicate = false;

                _.each(emails, function (email) {

                    email = $(email);

                    if (value !== '' && email.val() !== '' && key !== email.attr('id') && value === email.val()) {

                        hasDuplicate = true;

                    }

                });

                if (hasDuplicate) {

                    return options.message;

                }

            };

            validate.validators.addressFormat = function (value, options, key, attributes) {
                
                var addressPattern = /^[^~@$%^*_+={}[\]"<>|?!\\`]+/gi;

                if ( ! addressPattern.test(value) ) {

                    return options.message;

                }

            };

            validate.validators.notnumeric = function(value, options, key, attributes) {

                if(value === null) {

                    return;
               }
               value = value + '';

                var pattern =  /(?!^\d+$)^.+$/;

                if(!pattern.test(value.trim())){

                    return options.message;

                }

            };

            validate.validators.depositImage = function (value, options) {

                if ( value.length ) {

                    var allowedExtensions = [ 'jpeg', 'jpg', 'gif', 'png' ];
                    var filename = value[0].name || '';
                    var extension = filename.indexOf('.') ? 
                        filename.split('.').pop().toLowerCase() : '';

                    if ( ! ~allowedExtensions.indexOf(extension) ) {

                        return options.message;

                    }

                }

            };

            validate.validators.imageType = function (value, options) {

                if ( value.length ) {

                    var allowedExtensions = [ 'jpeg', 'jpg', 'gif', 'png' ];
                    var filename = value[0].name || '';
                    var extension = filename.indexOf('.') ?
                        filename.split('.').pop().toLowerCase() : '';

                    if ( ! ~allowedExtensions.indexOf(extension) ) {

                        return options.message;

                    }

                }

            };

            validate.validators.depositFileSize = function (value, options) {

                if ( value.length ) {

                    var allowedSize = 5242880;
                    var fileSize = value[0].size;

                    if ( fileSize > allowedSize ) {

                        return options.message;

                    }

                }

            };

            validate.validators.imageSize = function (value, options) {

                if ( value.length ) {

                    var allowedSize = options.maximum;
                    var fileSize = value[0].size;

                    if ( fileSize > allowedSize ) {

                        return options.message;

                    }

                }

            };

            /**
             * Must contain at least 1 alphabet and 1 number.
             * Accepts special characters.
             */
            validate.validators.idnPokerPassword = function (value, options) {

                if (value !== null && value.length) {
                    var containsAlphabet = /[a-zA-Z]/.test(value)
                        , containsNumber = /[0-9]/.test(value)
                        , match;

                    match = containsAlphabet && containsNumber;

                    if (! match) {
                        return options.message;
                    }
                }
            };

            /**
             * require description only on paymentType === "cash"
             */
            validate.validators.paymentTypeDescription = function (value, options, key, attributes) {
                if (attributes.paymentType === "cash" && _.isEmpty(value)) {
                    return options.message;
                }
            };

            /**
             * require attachment only on paymentType === "cash"
             */
            validate.validators.paymentTypeAttachment = function (value, options, key, attributes) {
                if (attributes.paymentType === "cash" && !value.length) {
                    return options.message;
                }
            };
        },

        userAgentCustom: function () {

            var ua = window.navigator.userAgent.toLocaleLowerCase();

            if (_.isIe()) {

                $('body').addClass('ua-msie');

                return false;

            }

            _.find(Config.browserKeywords, function (browser, key) {

                if (ua.indexOf(key) > - 1) {

                    $('body').addClass('ua-' + browser);

                    return true;

                }

                return false;

            });

        },

        shareSession: function() {

            var token = Managers.Cookie.get('pt_token') || '';
            var lang = Managers.Cookie.get('lang') || 'en';
            var tokenValue = lang + '/' + token.substring(token.length - 10);
            var isShared = Managers.Cache.get(this.sessionShareKey) === tokenValue;

            if ( ! isShared ) {

                var domains = this.getDomains();

                _.each(domains, function(domain) {

                    if ( ! _.isEmpty(domain) ) {
                
                        var iframe = document.createElement('iframe');
                        iframe.style.display = 'none';
                        iframe.src = window.location.protocol + '//' + 
                            domain + '/auth/' + lang + '/' + token;
                        document.body.appendChild(iframe);

                        iframe.onload = function() {

                            setTimeout(function() {

                                if ( document.body.contains(iframe) ) {

                                    document.body.removeChild(iframe);

                                }

                            }, 15000);

                        };

                    }

                });

                Managers.Cache.set(this.sessionShareKey, tokenValue);

            }

        },

        getDomains: function() {

            var domains = [];

            if ( Settings.site === 'MemberSite' ) {

                var memberDomainMap = _.propertyValue(Settings.domain, 'membersite', []),
                    hostName = window.location.hostname.replace(/^(www\.)/g,'');
                    
                    _.each(memberDomainMap, function(mapItem) {

                        if ( hostName === mapItem.member_domain ) {

                        domains.push(mapItem.rewards_domain);

                    }

                });

            }

            return domains;

        },

        cleanUrlParams: function() {

            // remove forced-web param if exist

            var fwParam = 'forced-web=true';

            if ( window.location.href.indexOf(fwParam) ) {

                window.history.replaceState(null, null, window.location.href.replace(fwParam, ''));

            }

        }
        
    };

})(
    jQuery,
    _,
    Q,
    Pt.Settings,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Components,
    Pt.Managers,
    Pt.Config,
    Pt.Services.Cms.WidgetService
);



/**

 * PrometheusFrontend

 * Created by isda on 13/12/2016.

 */





(function (

    Settings,

    Widgets,

    _baseBootstrap

) {



    "use strict";



    _.Class('Pt.Bootstrap', Bootstrap);



    /** @namespace Pt.Bootstrap **/

    function Bootstrap() {



        function Class() {



            _baseBootstrap.call(this);



        }



        Class.prototype = Object.create(_baseBootstrap.prototype);

        Class.prototype.constructor = Class;



        _.extend(Class.prototype, {



        }, Pt.Core.Extend('Bootstrap'));





        return new Class();



    }





})(

    Pt.Settings,

    Pt.Widgets,

    Pt.BaseBootstrap

);



/**
 * Created by isda on 13/12/2016.
 */
$(function() {

    //noinspection JSUnresolvedFunction
    var bootstrap = new Pt.Bootstrap();
    var app = bootstrap.boot();

    app.then(function() {

        function initApp() {

            Pt.Core.Router.add(Pt.Routes[Pt.Settings.module.toLowerCase()]);
            bootstrap.bootComponents();
            bootstrap.bootWidgets();

        }

        try {

            if ( Pt.Settings.member.isLoggedIn ) {

                Pt.Services.Members.SessionService.validate().finally(function() {

                    initApp();

                });

            } else {

                initApp();

            }

        } catch (e) {

            void 0;

        }

    })
    .fail(function(e) {

        void 0;

    });



});


