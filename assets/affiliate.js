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

    window.prom_template_version = '1583986258661';
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


window.promJsSdk={version:"v3.0.182"},window.EventBroker=new function(){var i={},s=i.hasOwnProperty;return{events:{slidebar:{close:"onClose"},routes:{changed:"onRouteChanged"},announcements:{ready:"onAnnouncementReady"},funds:{balance:{ready:"onBalanceReady"},transfer:{walletSelect:"onWalletSelect",bonusCodeSelect:"onBonusCodeSelect",bonusCodeFetchStart:"onBonusCodeFetchStart",bonusCodeFetchEnd:"onBonusCodeFetchEnd",complete:"onFundTransferComplete"},freebet:{success:"onFreebetSuccess"}},privateMessage:{read:"onPrivateMessageRead",refresh:"onPrivateMessageRefresh"},requestTimeout:"requestTimeout",navigate:"onNavigate",memberUnauthorized:"memberUnauthorized",domChanged:"onDomChanged",games:{launchRealPlay:"launchRealPlay"}},subscribe:function(e,t,n){s.call(i,e)||(i[e]=[]),"string"==typeof t&&(t=_.bind(n[t],n));var r=i[e].push(t)-1;return{remove:function(){delete i[e][r]}}},dispatch:function(e,t){s.call(i,e)&&i[e].forEach(function(e){e(void 0!==t?t:{})})}}},function(){"use strict";function e(){}_.Class("Pt.Contracts.AbstractModel",e),e.prototype={get:function(e){var t="get"+this._ucFirst(e);return t in this?this[t]():this[e]},set:function(e,t){var n="set"+this._ucFirst(e);return e in this&&(n in this?this[n](t):this[e]=t),this},_ucFirst:function(e){return e.charAt(0).toUpperCase()+e.slice(1)}}}(),function(e,t){"use strict";function n(){this.categories=null,this.club=null,this.clubs=null,this.gameId=null,this.gameLinks=null,this.image=null,this.tags=null,this.title=null,this.isFavorite=!1,this.exclusionList=!1}e.Class("Pt.Contracts.Games",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.items=[],this.pagination=0}e.Class("Pt.Contracts.CmsCollection",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(r,e){"use strict";r.Class("Pt.Contracts.RebateProduct",t);function t(){return this.category=null,this.claimCode=null,this.claimedRebateAmount=null,this.isClaimable=null,this.minimumClaimableAmount=null,this.pendingRebateAmount=null,this.productCode=null,this.rebateAmount=null,this.rebatePercentage=null,this.remainingRebateAmount=null,this.totalEligibleBet=null,this.promotionCode=null,this.canRefresh=null,this}function n(e){return r.isNull(this[e])?r.trans("rebates.empty_content"):r.toCurrency(this[e])}r.extend(t.prototype,e.prototype,{getName:function(){return r.trans("games."+this.get("productCode"))},getClaimedRebateAmount:function(){return n.call(this,"claimedRebateAmount")},getPendingRebateAmount:function(){return n.call(this,"pendingRebateAmount")},getMinimumClaimableAmount:function(){return n.call(this,"minimumClaimableAmount")},getRebateAmount:function(){return n.call(this,"rebateAmount")},getTotalEligibleBet:function(){return n.call(this,"totalEligibleBet")},getRebatePercentage:function(){return r.isNull(this.rebatePercentage)?r.trans("rebates.empty_content"):this.rebatePercentage+" %"},get:function(e){var t="get"+this._ucFirst(e);if(t in this){var n=this[t]();return r.isNull(n)?r.trans("rebates.empty_content"):n}return r.isNull(this[e])?r.trans("rebates.empty_content"):this[e]}})}(_,Pt.Contracts.AbstractModel),function(c,d,e){"use strict";function t(a){var t=["live_casino","lottery","slots","sportsbook"],o={},u={},l="sportsbook_promotion_codes";return c.isFalsy(a.products),c.each(a.products,function(e,s){if(c.isFalsy(e)||t.indexOf(s)<0)return!1;o[s]=[],c.each(e,function(e){if(c.isFalsy(e))return!1;var t={productCode:e,claimCode:e.replace("_"," ")};if("sportsbook"===s){var n=e+"_promotion_prefix";if(c.has(a,l)&&c.has(a.sportsbook_promotion_codes,n)){var r=moment(new Date),i=a.sportsbook_promotion_codes[n]||"";i+=r.isoWeek(),i+=r.year().toString().slice(2),t.promotionCode=i}}o[s].push(c.extendOnly(new d,t))})}),c.each(a.daily_rebate_products,function(e,s){if(c.isFalsy(e)||t.indexOf(s)<0)return!1;u[s]=[],c.each(e,function(e){if(c.isFalsy(e))return!1;var t={productCode:e,claimCode:e.replace("_"," ")};if("sportsbook"===s){var n=e+"_promotion_prefix";if(c.has(a,l)&&c.has(a.sportsbook_promotion_codes,n)){var r=moment(new Date),i=a.sportsbook_promotion_codes[n]||"";i+=r.isoWeek(),i+=r.year().toString().slice(2),t.promotionCode=i}}u[s].push(c.extendOnly(new d,t))})}),this.startDate=a.start_date||"",this.products=o,this.daily_rebate_products=u,this}c.Class("Pt.Contracts.RebateSettings",t),c.extend(t.prototype,e.prototype,{getStartDate:function(){return this.startDate}})}(_,Pt.Contracts.RebateProduct,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.code=null,this.message=null,this.source=null}e.Class("Pt.Contracts.Error",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(a,e){"use strict";function t(){this.PartialReg=null,this.address=null,this.city=null,this.countryCode=null,this.countryName=null,this.currencyCode=null,this.dob=null,this.email=null,this.firstName=null,this.gender=null,this.languageCode=null,this.lastName=null,this.memberCode=null,this.mobile=null,this.oddsType=null,this.postal=null,this.securityAnswer=null,this.securityQuestion=null}a.Class("Pt.Contracts.Member",t),a.extend(t.prototype,e.prototype,{getFullName:function(){return this.lastName?this.lastName+" "+this.firstName:this.firstName},getMaskedEmail:function(){if(!this.email)return this.email;var e=this.email.split("@")[0],t=2===e.length?2:Math.ceil(e.length/2),n=Array(t+1).join("*"),r=e.length-t,i=Math.ceil(r/2),s=e.length-i-t;return a.maskString(e,i,s,n)+"@"+this.email.split("@")[1]},getMaskedMobile:function(){if(!this.mobile)return this.mobile;var e=this.mobile.split("-")[1],t=Math.ceil(e.length/2),n=Array(t+1).join("*"),r=e.length-t;return this.mobile.split("-")[0]+"-"+a.maskString(e,0,r,n)}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.category_id=null,this.id=null,this.message=null,this.start_date=null}e.Class("Pt.Contracts.Announcements",n),e.extend(n.prototype,t.prototype,{compileMessage:function(){this.message=e.unescape(this.message)}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.id=null,this.name=null,this.translation=null}e.Class("Pt.Contracts.AnnouncementCategories",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.AnnouncementDetails=null,this.announcementCatId=null,this.announcementCatName=null,this.announcementId=null}e.Class("Pt.Contracts.CashierAnnouncement",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.Row=null,this.RowDesc=null,this.Sender=null,this.SenderDate=null,this.messageId=null,this.messageText=null,this.flagImportant="false",this.status=null,this.subjectId=null,this.subjectText=null,this.replies=null,this.parentMessageId=null}e.Class("Pt.Contracts.PrivateMessage",n),e.extend(n.prototype,t.prototype,{getFlagImportant:function(){return e.booleanString(this.flagImportant)}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.createdBy=null,this.createdDate=null,this.languageCode=null,this.sequence=null,this.status=null,this.subjectGrouping=null,this.subjectId=null,this.subjectText=null,this.subjectType=null}e.Class("Pt.Contracts.PrivateMessageSubject",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.currencyCode=null,this.limitDaily=null,this.maxWithdrawal=null,this.methodId=null,this.methodName=null,this.minWithdrawal=null,this.paymentMode=null,this.totalAllowed=null}e.Class("Pt.Contracts.WithdrawalMethod",n),e.extend(n.prototype,t.prototype,{getMinimumAmount:function(){return+this.minWithdrawal},getMaximumAmount:function(){return+this.maxWithdrawal},isDailyUnlimited:function(){return 0==+this.limitDaily}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.bankCode=null,this.bankName=null,this.bankNameNative=null}e.Class("Pt.Contracts.Bank",n),e.extend(n.prototype,t.prototype,{getValue:function(){return this.bankCode},getLabel:function(){return this.bankNameNative}})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.bankAccountName=null,this.bankAccountNumber=null,this.bankAddress=null,this.bankBranch=null,this.bankCode=null,this.bankName=null,this.bankNameNative=null,this.memberBankAccountId=null,this.memberCode=null,this.operatorId=null,this.preferred=null,this.supported=!1}e.Class("Pt.Contracts.BankDetail",n),e.extend(n.prototype,t.prototype,{bankSupported:function(){return this.supported=!0,this},isBankSupported:function(){return this.supported},isPreferred:function(){return"true"===this.preferred},hasBeenSet:function(){return null!==this.bankCode},bankHasBeenDeactivated:function(){return this.hasBeenSet()&&!this.isBankSupported()}})}(_,Pt.Contracts.AbstractModel),function(n,e){"use strict";function t(){this.accountId=null,this.accountName=null,this.accountNumber=null,this.image=null,this.bankCode=null,this.bankBranch=null,this.bankNameNative=null,this.bankDowntimeId=null,this.dateFrom=null,this.dateTo=null,this.descriptionExternal=null,this.showBankInfo=null}n.Class("Pt.Contracts.SystemBankAccount",t),n.extend(t.prototype,e.prototype,{shouldShowBankInfo:function(){return this.showBankInfo},isCurrentlyDown:function(){if(null===this.bankDowntimeId||""===this.bankDowntimeId)return!1;var e=moment(this.dateFrom,"YYYY-MM-DDTHH:mm:ss"),t=moment(this.dateTo,"YYYY-MM-DDTHH:mm:ss"),n=moment(new Date).format("YYYY-MM-DDTHH:mm:ss");return n=moment(n,"YYYY-MM-DDTHH:mm:ss"),null!==this.dateFrom&&null===this.dateTo?e<=n:n.isBetween(e,t)},downDownTooltip:function(){var e="-";if(null!==this.dateFrom&&""!==this.dateFrom)e=moment(this.dateFrom).format("MM/DD/YYYY HH:mm:ss");var t="-";if(null!==this.dateTo&&""!==this.dateTo)t=moment(this.dateTo).format("MM/DD/YYYY HH:mm:ss");return'<div class="systembank-account-tootltip"><span cass="systembankaccount-tooltip-main-label">'+n.trans("funds.label_downtime")+"</span><br />"+n.trans("funds.label_downtime_from")+" "+e+"<br />"+n.trans("funds.label_downtime_to")+" "+t+"</div>"},getMaskedAccountNumber:function(){return this.accountNumber.substring(0,11)+"****"+this.accountNumber.substring(this.accountNumber.length-4)}})}(_,Pt.Contracts.AbstractModel),function(i,e){function t(){var e;this.id=null,this.methodCode=null,this.mode=null,this.currencyCode=null,this.dailyLimit=null,this.maximumAmount=null,this.minimumAmount=null,this.totalAllowed=null,this.launcherUrl=null,this.processType=null,this.supportedBanks=[],this.customFields={},this.bankingType=null,this.processingFeeSupported=["alipay","wechat","selection","none"],this.fee={a:(e=parseFloat(Math.random().toFixed(2)),.49<e&&(e=parseFloat((e/2).toFixed(2))),e),b:parseFloat(Math.random().toFixed(2)),c:parseFloat(Math.random().toFixed(2))},this.formFields=[]}i.Class("Pt.Contracts.DepositMethod",t),i.extend(t.prototype,e.prototype,{getMinimumAmount:function(){return+this.minimumAmount},getMaximumAmount:function(){return+this.maximumAmount},isDailyUnlimited:function(){return 0===this.dailyLimit},isBankTransfer:function(){return"bank_transfer"===this.processType},getCustomFields:function(e){return i.has(this.customFields,e)?this.customFields[e]:this.customFields},isExternalLink:function(){return"external"===this.processType},getCustomFieldsByKey:function(e){return i.has(this.customFields,e)?this.customFields[e]:null},isExcluded:function(){if(this.isExternalLink()){var e=this.getCustomFieldsByKey("custom_deposit_link").platform||["web"];return-1===i.indexOf(e,"web")}return!1},getProcessingFee:function(){var e=this.getCustomFields("processing_fee");return i.booleanString(e)},hasProcessingFee:function(){return this.getProcessingFee()},getProcessingFeeMessage:function(){return i.str_replace_key({":method":this.getMethodName(),":member":Pt.Settings.member.code},i.trans("funds.processing_fee_message"))},isProcessingFeeSupported:function(){return-1<i.indexOf(this.processingFeeSupported,this.bankingType)},getActualAmount:function(e){var t=0;return t=(e=+e)<22?e+this.fee.a:22<e&&e<101?e+this.fee.b:e-this.fee.c,Number.isInteger(t)?this.getActualAmount(t):parseFloat(t).toFixed(2)},getMethodName:function(){return i.trans("transaction_methods.method_"+this.get("id"))},hasFormFields:function(){return!i.isEmpty(this.formFields)},isAmountReadOnly:function(){var e=this.getCustomFieldsByKey("read-only_amount");return i.booleanString(e)},getAmountSelectors:function(){var e=this.getCustomFieldsByKey("amount_selections");return i.size(e)?e:i.isNull(e)?void 0:["50","100","300","500","1000"]},getNonZeroAmount:function(e){e=Math.floor(e);var t=this.getCustomFieldsByKey("non-zero_amount_range");t=(t=t||"1-5").split("-");var n=[];if(e%10!=0)return e;if(!i.isArray(t)||i.size(t)<2)return e;for(var r=+t[0];i.size(n)<+t[1];)n.push(r),r++;return e+i.sample(n)},getNoDecimalAmount:function(t){try{return-1<(t+="").indexOf(".")?(t=t.split(".")[0],t*=1):Math.floor(t)}catch(e){return t}},isConvertibleToNearestHundreds:function(){try{return-1<this.getCustomFieldsByKey("nearest_hundreds_amount").platform.indexOf("mobile")}catch(e){return!1}}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.fieldName=null,this.inputType=null,this.selections=null,this.validationRules=null,this.encryptionType="private"}e.Class("Pt.Contracts.FormFields",n),n.prototype=e.extend(t.prototype,{getLabel:function(){return e.trans("funds."+this.fieldName.toLowerCase())},hasValidations:function(){return!e.isEmpty(this.validationRules)},isRequired:function(){return-1<e.indexOf(this.validationRules,"presence")},isEncryptPrivate:function(){return"private"===this.encryptionType},isEncryptBasic:function(){return!this.isEncryptPrivate()}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.invId=null,this.methodCode=null,this.methodid=null,this.paymentMethod=null,this.paymentType=null,this.requestAmount=null,this.requestDate=null,this.source=null,this.status=null,this.transAmount=null,this.statusCode=null}e.Class("Pt.Contracts.DepositWithdrawalHistory",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.categoryCode=null,this.dateRequested=null,this.message=null,this.productCode=null,this.requestedAmount=null,this.status=null,this.statusCode=null,this.transactionId=null,this.transactionType=null,this.transferredAmount=null}e.Class("Pt.Contracts.AdjustmentsHistory",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.amount=null,this.currency=null,this.dateTime=null,this.status=null,this.statusCode=null,this.transactionId=null,this.totalBonus=0,this.totalInvitees=0,this.totalRegistered=0,this.totalSuccessful=0}e.Class("Pt.Contracts.ReferralBonusHistory",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.createdBy=null,this.createdDateTime=null,this.currencyAmount=null,this.memberCode=null,this.transferAmount=null,this.transferFromWalletId=null,this.transferId=null,this.transferStatus=null,this.transferStatusText=null,this.transferToWalletId=null,this.status=null,this.statusCode=null}e.Class("Pt.Contracts.FundTransferHistory",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.createdBy=null,this.createdDateTime=null,this.currencyAmount=null,this.memberCode=null,this.transferAmount=null,this.transferFromWalletId=null,this.transferId=null,this.transferStatus=null,this.transferStatusText=null,this.transferToWalletId=null,this.status=null,this.statusCode=null}e.Class("Pt.Contracts.PromotionHistory",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.comment=null,this.memberId=null,this.memberPromoRegId=null,this.operatorId=null,this.subjectCode=null,this.submissionDate=null,this.submissionOnBehalf=null}e.Class("Pt.Contracts.PromotionClaimsHistory",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.code=null,this.name=null}e.Class("Pt.Contracts.BankingOption",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.name=null,this.shouldDisplay=!0,this.defaultValue=null}e.Class("Pt.Contracts.OfflineDepositField",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e){"use strict";function t(){this.bankAccountName=null,this.bankAccountNumber=null,this.bankCode=null,this.bankNameNative=null,this.requestAmount=null}_.Class("Pt.Contracts.DepositPreferredBank",t),_.extend(t.prototype,e.prototype,{getRequestAmount:function(){return+this.requestAmount},hasBeenSet:function(){return!_.isEmpty(this.bankCode)}})}(Pt.Contracts.AbstractModel),function(t,e){"use strict";function n(){this.code=null,this.denominations=[]}t.Class("Pt.Contracts.CardType",n),t.extend(n.prototype,e.prototype,{setDenominations:function(e){var n=t.isArray(e)?e:[e];return t.each(n,function(e,t){n[t]=+e}),this.denominations=n,this}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.category=null,this.claimCode=null,this.claimedRebateAmount=null,this.isClaimable=null,this.minimumClaimableAmount=null,this.pendingRebateAmount=null,this.productCode=null,this.productName=null,this.rebateAmount=null,this.rebatePercentage=null,this.remainingRebateAmount=null,this.totalEligibleBet=null}e.Class("Pt.Contracts.RebateDetail",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.rebateCode=null,this.claimable=null}e.Class("Pt.Contracts.PromoCode",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.id=null,this.hashId=null,this.title=null,this.summary=null,this.body=null,this.promoName=null,this.cardImage=null,this.bannerImage=null,this.promoCode=null,this.endDate=null}e.Class("Pt.Contracts.Promotion",n),e.extend(n.prototype,t.prototype,{getBannerImage:function(){return e.isEmpty(this.bannerImage)?"/assets/images/no-image.gif":(this.bannerImage[0],this.bannerImage)},getCardImage:function(){return e.isEmpty(this.cardImage)?"/assets/images/no-image.gif":(this.cardImage[0],this.cardImage)},hasPromoCode:function(){return!!this.promoCode},getPromoDuration:function(){var e=moment(new Date(this.endDate)),t=moment(new Date);return moment.duration(e.diff(t))}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.bonusAmount=null,this.categoryDescription=null,this.categoryId=null,this.code=null,this.productCode=null,this.rollOverAmount=null,this.title=null,this.walletId=null,this.promoType=null}e.Class("Pt.Contracts.BonusCode",n),e.extend(n.prototype,t.prototype,{hasRollOver:function(){return-1!==this.rollOverAmount}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.gameId=null,this.productCode=null,this.lastUpdated=null}e.Class("Pt.Contracts.SlotGame",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.id=null,this.balance=null,this.currency=null,this.name=null,this.status=null}e.Class("Pt.Contracts.Wallet",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.code=null,this.message=null,this.rolloverAmount=null}e.Class("Pt.Contracts.PromoCodeStatus",n),e.extend(n.prototype,t.prototype,{setCode:function(e){this.code=parseInt(e,10)}})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.bankAccountId=null,this.bankAccountName=null,this.bankAccountNumber=null,this.bankAddress=null,this.bankAddressId=null,this.bankBranch=null,this.bankCode=null,this.bankName=null,this.bankNameNative=null,this.isPreferred=!1,this.state=null}e.Class("Pt.Contracts.BankingDetails",n),e.extend(n.prototype,t.prototype,{isActive:function(){return"Active"===this.state},isRegular:function(){return"regular"===this.type},getDisplayName:function(){if(this.isRegular())return this.bankNameNative+" - ******"+this.bankAccountNumber.substring(this.bankAccountNumber.length-4);var e=this.bankAccountNumber.indexOf("@");return-1<e?this.bankAccountNumber.substring(0,e).length<10?this.bankAccountNumber.substring(0,1)+"**"+this.bankAccountNumber.substring(e-1):this.bankAccountNumber.substring(0,3)+"***"+this.bankAccountNumber.substring(e-4):this.bankAccountNumber.length<10?this.bankAccountNumber.substring(0,1)+"**"+this.bankAccountNumber.substring(this.bankAccountNumber.length-1):this.bankAccountNumber.substring(0,3)+"***"+this.bankAccountNumber.substring(this.bankAccountNumber.length-4)},getDisplayNumber:function(){if(this.isRegular())return"******"+this.bankAccountNumber.substring(this.bankAccountNumber.length-4)},shouldShow:function(e){return"THB"===e||"THB"!==e&&this.isActive()},shouldShowPreferredButton:function(){return this.isRegular()&&this.isActive()}})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.type="regular"}e.Class("Pt.Contracts.RegularBank",n),e.extend(n.prototype,t,{})}(_,new Pt.Contracts.BankingDetails),function(e,t){function n(){this.type="alipay"}e.Class("Pt.Contracts.AlipayBank",n),e.extend(n.prototype,t,{})}(_,new Pt.Contracts.BankingDetails),function(e,t){function n(){this.type="qq"}e.Class("Pt.Contracts.QqBank",n),e.extend(n.prototype,t,{})}(_,new Pt.Contracts.BankingDetails),function(e,t){function n(){this.type="regular"}e.Class("Pt.Contracts.RegularBank",n),e.extend(n.prototype,t,{})}(_,new Pt.Contracts.BankingDetails),function(e,t){function n(){this.type="wechat"}e.Class("Pt.Contracts.WechatBank",n),e.extend(n.prototype,t,{})}(_,new Pt.Contracts.BankingDetails),function(e,t){function n(){this.type="momo"}e.Class("Pt.Contracts.MomoBank",n),e.extend(n.prototype,t,{})}(_,new Pt.Contracts.BankingDetails),function(e,t){function n(){this.accounts=[],this.type=null,this.consumed=0,this.limit=0,this.allowed=0,this.active=0}e.Class("Pt.Contracts.BankingList",n),e.extend(n.prototype,t.prototype,{getAccounts:function(){return this.accounts},getType:function(){return this.type},canAdd:function(){return 0<this.allowed},canDelete:function(){return!this.isMPay()},remainingLabel:function(){return this.isMPay()?0===this.allowed?e.trans("profile.label_mpay_contact_cs"):this.allowed==this.limit?e.str_replace_key({__count__:this.allowed},e.trans("profile.label_mpay_none_consumed")):e.str_replace_key({__count__:this.allowed},e.trans("profile.label_mpay_has_consumed")):e.str_replace_key({__count__:this.allowed},0===this.consumed?e.trans("profile.label_max_banks"):e.trans("profile.label_add_more_bank"))},isRegular:function(){return"regular"===this.getType()},isMPay:function(){return"momo"===this.getType()},canEdit:function(){return this.isRegular()},shouldShowBankingType:function(e){return this.isRegular()||!this.isRegular()&&"RMB"===e||this.isMPay()&&"VND"===e},hasActive:function(){return 0<this.active}})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.id=null,this.nativeName=null,this.name=null,this.getCities=function(){}}e.Class("Pt.Contracts.BankingProvince",n),e.extend(n.prototype,t.prototype,{getLabel:function(){return this.nativeName},getValue:function(){return this.id}})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.id=null,this.nativeName=null,this.name=null,this.provinceId=null,this.getDistricts=function(){}}e.Class("Pt.Contracts.BankingCity",n),e.extend(n.prototype,t.prototype,{getLabel:function(){return this.nativeName},getValue:function(){return this.id}})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.id=null,this.nativeName=null,this.name=null,this.cityId=null}e.Class("Pt.Contracts.BankingDistrict",n),e.extend(n.prototype,t.prototype,{getLabel:function(){return this.nativeName},getValue:function(){return this.id}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.sessionId=null,this.token=null,this.resetPassword=null,this.shouldVerify=null}e.Class("Pt.Contracts.SignIn",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.code=null,this.message=null,this.data=null}e.Class("Pt.Contracts.ForgotPassword",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.wallet_id=null,this.amount=null,this.currency=null}e.Class("Pt.Contracts.Balance",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.id=null,this.nativeName=null,this.name=null,this.getCities=function(){}}e.Class("Pt.Contracts.BankingProvince",n),e.extend(n.prototype,t.prototype,{getLabel:function(){return this.nativeName},getValue:function(){return this.id}})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.id=null,this.nativeName=null,this.name=null,this.provinceId=null,this.getDistricts=function(){}}e.Class("Pt.Contracts.BankingCity",n),e.extend(n.prototype,t.prototype,{getLabel:function(){return this.nativeName},getValue:function(){return this.id}})}(_,Pt.Contracts.AbstractModel),function(e,t){function n(){this.id=null,this.nativeName=null,this.name=null,this.cityId=null}e.Class("Pt.Contracts.BankingDistrict",n),e.extend(n.prototype,t.prototype,{getLabel:function(){return this.nativeName},getValue:function(){return this.id}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.CurrencyCode=null,this.claimed=null,this.memberCode=null,this.operatorId=null,this.verificationBonusAmount=null}e.Class("Pt.Contracts.MemberProfile",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.statusCode=null,this.statusText=null,this.code=null,this.data=null,this.message=null}e.Class("Pt.Contracts.Generic",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.dateTime=null,this.rolloverAmount=null,this.statusCode=null,this.statusText=null,this.totalStakeAmount=null,this.transferAmount=null,this.transferAmountAllowed=null,this.transferFromBalanceAfter=null,this.transferFromBalanceBefore=null,this.transferId=null,this.transferStatus=null,this.transferToBalanceAfter=null,this.transferToBalanceBefore=null}e.Class("Pt.Contracts.FundTransfer",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.sessionId=null,this.token=null,this.resetPassword=null,this.shouldVerify=null}e.Class("Pt.Contracts.SignUp",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t,n){"use strict";function r(){this.transType=null,this.frequency=null,this.limitAmount=null,this.validFrom=null,this.validTo=null}e.Class("Pt.Contracts.TransactionLimit",r),e.extend(r.prototype,n.prototype,{getValidFrom:function(e){return e=e||"YYYY-MM-DD",t(this.validFrom).format(e)},getValidTo:function(e){return e=e||"YYYY-MM-DD",t(this.validTo).format(e)}})}(_,moment,Pt.Contracts.AbstractModel),function(e){"use strict";function t(){this.bankAccountName=null,this.bankAccountNumber=null,this.bankCode=null,this.bankNameNative=null,this.requestAmount=null}_.Class("Pt.Contracts.DepositPreferredBank",t),_.extend(t.prototype,e.prototype,{getRequestAmount:function(){return+this.requestAmount},hasBeenSet:function(){return!_.isEmpty(this.bankCode)}})}(Pt.Contracts.AbstractModel),function(e){"use strict";function t(){this.bankAccountName=null,this.bankAccountNumber=null,this.bankAddress=null,this.bankBranch=null,this.bankCode=null,this.bankName=null,this.memberBankAccountWdlId=null,this.memberCode=null,this.memberMobile=null,this.operatorId=null,this.preferred=null}_.Class("Pt.Contracts.WithdrawalPreferredBank",t),_.extend(t.prototype,e.prototype,{getRequestAmount:function(){return+this.requestAmount},hasBeenSet:function(){return null!==this.bankCode}})}(Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.invId=null,this.payMethodDescription=null,this.payMethodId=null,this.requestAmount=null,this.requestDate=null,this.status=null}e.Class("Pt.Contracts.WithdrawalTransaction",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.claimed=null,this.promoCode=null}e.Class("Pt.Contracts.PromoClaim",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.accountName=null,this.accountNumber=null,this.amount=null,this.bankCode=null,this.bankName=null,this.transactionId=null,this.status=null}e.Class("Pt.Contracts.AlipayTransferTransaction",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.dateTime=null,this.rolloverAmount=null,this.statusCode=null,this.statusText=null,this.totalStakeAmount=null,this.transferAmount=null,this.transferAmountAllowed=null,this.transferFromBalanceAfter=null,this.transferFromBalanceBefore=null,this.transferId=null,this.transferStatus=null,this.transferToBalanceAfter=null,this.transferToBalanceBefore=null}e.Class("Pt.Contracts.FundTransfer",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(n,e){function t(){this.denominations=[]}n.Class("Pt.Contracts.ScratchCardDenominations",t),n.extend(t.prototype,e.prototype,{getTelcos:function(e){var t=n.map(this.denominations,function(e){return e||{}});return e||0===e?t[e]:t},getTelcoAmounts:function(t){return n.find(this.denominations,function(e){return e.vendorCode===t}).amounts||[]},isMultipleTelcos:function(){return 1<this.getTelcos().length},hasMultipleTelcoAmounts:function(e){return 1<n.size(this.getTelcoAmounts(e))}})}(_,Pt.Contracts.AbstractModel),function(t,e){"use strict";function n(){this.bankDetailCompleted=!1,this.bankDetailCompletedAmount=0,this.bankDetailCompletedClaimedAmount=0,this.emailVerified=0,this.emailVerifiedAmount=0,this.emailVerifiedClaimedAmount=0,this.phoneVerified=!1,this.phoneVerifiedAmount=0,this.phoneVerifiedClaimedAmount=0,this.profileCompleted=!1,this.profileCompletedAmount=0,this.profileCompletedClaimedAmount=0,this.claimed=!1,this.minimumWithdrawal=0,this.minimumDeposit=0}t.Class("Pt.Contracts.SafetyRating",n),t.extend(n.prototype,e.prototype,{getProfileCompleteness:function(){var e=[],t={level:0,label:"needs_validation"};switch(this.bankDetailCompleted&&e.push("true"),this.emailVerified&&e.push("true"),this.phoneVerified&&e.push("true"),this.profileCompleted&&e.push("true"),e.length){case 1:t.level="25",t.label="partially_validated";break;case 2:t.level="50",t.label="partially_validated";break;case 3:t.level="75",t.label="normal";break;case 4:t.level="100",t.label="fully_validated";break;default:t.level="0",t.label="needs_validation"}return t},isBankDetailsVerified:function(){return this.bankDetailCompleted},isProfileVerified:function(){return this.profileCompleted},isEmailVerified:function(){return this.emailVerified},isSmsVerified:function(){return this.phoneVerified},getMinimumWithdrawal:function(){return t.toCurrency(this.minimumWithdrawal,2)},getTotalClaimableAmount:function(){var e=parseInt(this.phoneVerifiedAmount,10)+parseInt(this.emailVerifiedAmount,10)+parseInt(this.profileCompletedAmount,10)+parseInt(this.bankDetailCompletedAmount,10);return t.toCurrency(e,2)},getMinimumDeposit:function(){return t.toCurrency(this.minimumDeposit,2)}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.memberCode=null,this.claimCode=null,this.hasClaimed=null,this.walletId=null,this.startDate=null,this.endDate=null,this.amount=null}e.Class("Pt.Contracts.CustomPromotion",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(i,e){"use strict";function t(){this.name="",this.description="",this.startDate=moment().format("YYYY-MM-DD HH:mm:ss"),this.endDate=moment().format("YYYY-MM-DD HH:mm:ss"),this.leaderboard=[]}i.Class("Pt.Contracts.Leaderboard",t),i.extend(t.prototype,e.prototype,{getLeaderboardList:function(e,t){var r=this.leaderboard;if(r.length){var a=(e=e||{by:"rank",order:"asc"}).by.split("|"),o=e.order.split("|");(function(e,t){var n=!0;e.length!=t.length&&(n=!1);return i.each(e,function(e){i.isUndefined(r[0][e])&&(n=!1)}),n})(a,o)&&(r=r.sort(function(e,t){return function e(t,n,r){r=r||0;if(r<a.length){var i=o[r],s=a[r];return t[s]===n[s]?e(t,n,r+1):"asc"===i?t[s]-n[s]:n[s]-t[s]}return!0}(e,t)})),r=r.slice(0,t||30)}return r}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.loginId=null,this.password=null}e.Class("Pt.Contracts.IDNPokerAccount",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.category=null,this.date=null,this.id=null,this.name=null,this.points=null,this.remarks=null,this.status=null}e.Class("Pt.Contracts.SpinwheelRedemption",n),e.extend(n.prototype,n.prototype,{constructor:n,getStatusText:function(){return this.status},getStatusCode:function(){return-1!==["Successful","สำเร็จ","成功"].indexOf(this.status)?"success":"pending"}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.actualBalance=0,this.adjustedPoints=0,this.cartPoints=0,this.expiredPoints=0,this.pointsBalance=0,this.totalEarnings=0,this.totalRedemptions=0,this.totalStake=0}e.Class("Pt.Contracts.Rewards",n),e.extend(n.prototype,t.prototype,{getPointsBalance:function(){return e.toCurrencyTruncate(this.pointsBalance)}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.currency=null,this.details=null,this.duration=null,this.maximum=null,this.minimum=null,this.name=null,this.transaction_type=null,this.className=null,this.redirectTo=null}e.Class("Pt.Contracts.Cms.BankingOption",n),e.extend(n.prototype,t.prototype,{getClassName:function(){return this.className},getMin:function(){return e.trans("funds.label_banking_options_"+this.currency)+" "+this.minimum},getMax:function(){return e.trans("funds.label_banking_options_"+this.currency)+" "+this.maximum}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.items=[],this.pagination=0}e.Class("Pt.Contracts.CmsCollection",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.categories=null,this.club=null,this.clubs=null,this.gameId=null,this.gameLinks=null,this.image=null,this.tags=null,this.title=null,this.isFavorite=!1,this.exclusionList=!1}e.Class("Pt.Contracts.Games",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(r,e){"use strict";r.Class("Pt.Contracts.RebateProduct",t);function t(){return this.category=null,this.claimCode=null,this.claimedRebateAmount=null,this.isClaimable=null,this.minimumClaimableAmount=null,this.pendingRebateAmount=null,this.productCode=null,this.rebateAmount=null,this.rebatePercentage=null,this.remainingRebateAmount=null,this.totalEligibleBet=null,this.promotionCode=null,this.canRefresh=null,this}function n(e){return r.isNull(this[e])?r.trans("rebates.empty_content"):r.toCurrency(this[e])}r.extend(t.prototype,e.prototype,{getName:function(){return r.trans("games."+this.get("productCode"))},getClaimedRebateAmount:function(){return n.call(this,"claimedRebateAmount")},getPendingRebateAmount:function(){return n.call(this,"pendingRebateAmount")},getMinimumClaimableAmount:function(){return n.call(this,"minimumClaimableAmount")},getRebateAmount:function(){return n.call(this,"rebateAmount")},getTotalEligibleBet:function(){return n.call(this,"totalEligibleBet")},getRebatePercentage:function(){return r.isNull(this.rebatePercentage)?r.trans("rebates.empty_content"):this.rebatePercentage+" %"},get:function(e){var t="get"+this._ucFirst(e);if(t in this){var n=this[t]();return r.isNull(n)?r.trans("rebates.empty_content"):n}return r.isNull(this[e])?r.trans("rebates.empty_content"):this[e]}})}(_,Pt.Contracts.AbstractModel),function(c,d,e){"use strict";function t(a){var t=["live_casino","lottery","slots","sportsbook"],o={},u={},l="sportsbook_promotion_codes";return c.isFalsy(a.products),c.each(a.products,function(e,s){if(c.isFalsy(e)||t.indexOf(s)<0)return!1;o[s]=[],c.each(e,function(e){if(c.isFalsy(e))return!1;var t={productCode:e,claimCode:e.replace("_"," ")};if("sportsbook"===s){var n=e+"_promotion_prefix";if(c.has(a,l)&&c.has(a.sportsbook_promotion_codes,n)){var r=moment(new Date),i=a.sportsbook_promotion_codes[n]||"";i+=r.isoWeek(),i+=r.year().toString().slice(2),t.promotionCode=i}}o[s].push(c.extendOnly(new d,t))})}),c.each(a.daily_rebate_products,function(e,s){if(c.isFalsy(e)||t.indexOf(s)<0)return!1;u[s]=[],c.each(e,function(e){if(c.isFalsy(e))return!1;var t={productCode:e,claimCode:e.replace("_"," ")};if("sportsbook"===s){var n=e+"_promotion_prefix";if(c.has(a,l)&&c.has(a.sportsbook_promotion_codes,n)){var r=moment(new Date),i=a.sportsbook_promotion_codes[n]||"";i+=r.isoWeek(),i+=r.year().toString().slice(2),t.promotionCode=i}}u[s].push(c.extendOnly(new d,t))})}),this.startDate=a.start_date||"",this.products=o,this.daily_rebate_products=u,this}c.Class("Pt.Contracts.RebateSettings",t),c.extend(t.prototype,e.prototype,{getStartDate:function(){return this.startDate}})}(_,Pt.Contracts.RebateProduct,Pt.Contracts.AbstractModel),function(t,e){"use strict";function n(){this.games=[],this.data=null}t.Class("Pt.Contracts.TopPlayedGames",n),t.extend(n.prototype,e.prototype,{getById:function(e){return t.findWhere(this.games.items,{gameId:e})}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.announcementId=null,this.announcementDetails=null,this.effectiveDate=null,this.effectiveDateEnd=null}e.Class("Pt.Contracts.AffiliateAnnouncements",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.groups=null,this.languages=null,this.trackingNames=null}e.Class("Pt.Contracts.CreativeTrackers",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.affiliateurl=null,this.affiliatememberurlid=null}e.Class("Pt.Contracts.AffiliateWebsite",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(t,e){"use strict";function n(){this.expenses=null,this.user=null,this.settlementId=null,this.previousNegativeNetRevenue=null,this.grossCommission=null,this.subAffiliateCommission=null,this.previousCommission=null,this.commission=null,this.adjustment=null,this.negativeNetRevenue=null,this.commissionRollOverNextMonth=null,this.activeMember=null,this.settlements=[],this.paymentFee=null,this.reward=null,this.royalty=null,this.bonus=null,this.rebate=null,this.netTurnOver=null,this.grossRevenue=null,this.rakesAmount=null,this.firstTimeDeposits=null,this.signUps=null}function r(e){return t.isNull(this[e])||0===this[e]?t.trans("affiliate.reports_zero_value"):t.toCurrencyTruncate(this[e])}t.Class("Pt.Contracts.CommissionReport",n),t.extend(n.prototype,e.prototype,{getExpenses:function(){return r.call(this,"expenses")},getPreviousNegativeNetRevenue:function(){return r.call(this,"previousNegativeNetRevenue")},getGrossCommission:function(){return r.call(this,"grossCommission")},getSubAffiliateCommission:function(){return r.call(this,"subAffiliateCommission")},getPreviousCommission:function(){return r.call(this,"previousCommission")},getCommission:function(){return r.call(this,"commission")},getAdjustment:function(){return r.call(this,"adjustment")},getNegativeNetRevenue:function(){return r.call(this,"negativeNetRevenue")},getCommissionRollOverNextMonth:function(){return r.call(this,"commissionRollOverNextMonth")},getNetTurnOver:function(){return r.call(this,"netTurnOver")},getGrossRevenue:function(){return r.call(this,"grossRevenue")},getPaymentFee:function(){return r.call(this,"paymentFee")},getRebatePromotion:function(){var e=this.bonus+this.rebate;return t.isNull(e)||0===e?t.trans("affiliate.reports_zero_value"):t.toCurrency(e)},getRoyalty:function(){return r.call(this,"royalty")},getSettlements:function(){return this.settlements},getRakesAmount:function(){return r.call(this,"rakesAmount")},getSignUps:function(){return this.signUps},getFirstTimeDeposits:function(){return this.firstTimeDeposits}})}(_,Pt.Contracts.AbstractModel),function(t,e){"use strict";function n(){this.totalStakeAmount=null,this.totalWinLoseAmount=null,this.productKey=null,this.productName=null,this.settlementId=null,this.stakeAmount=null,this.winloseAmount=null,this.rakesAmount=null}function r(e){return t.isNull(this[e])||0===this[e]?t.trans("affiliate.reports_zero_value"):t.toCurrency(this[e])}t.Class("Pt.Contracts.CommissionSettlement",n),t.extend(n.prototype,e.prototype,{getTotalStakeAmount:function(){return r.call(this,"totalStakeAmount")},getTotalWinLoseAmount:function(){return r.call(this,"totalWinLoseAmount")},getStakeAmount:function(){return r.call(this,"stakeAmount")},getWinloseAmount:function(){return r.call(this,"winloseAmount")},getRakesAmount:function(){return r.call(this,"rakesAmount")}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.dateOfBirth=null,this.address=null,this.affiliateId=null,this.username=null,this.isFundingAllowed=null,this.city=null,this.commissionType=null,this.messenger=null,this.countryCode=null,this.currencyCode=null,this.languageCode=null,this.email=null,this.fullName=null,this.loginAttempts=null,this.mobileNumber=null,this.operatorCode=null,this.operatorId=null,this.payout=null,this.postal=null,this.websites=null,this.securityAnswer=null,this.redirectionPage=null,this.accountName=null,this.accountNumber=null,this.bankAddress=null,this.bankBranch=null,this.bankName=null,this.bankSwiftCode=null,this.securityQuestion=null}e.Class("Pt.Contracts.Affiliate.Member",n),e.extend(n.prototype,t.prototype,{getDateOfBirth:function(){return this.dateOfBirth.format("YYYY-MM-DD")},getMobileNumber:function(){return this.mobileNumber.split("-")[1]||this.mobileNumber},getMobileNumberCode:function(){return this.mobileNumber.split("-")[0]||this.mobileNumber}})}(_,Pt.Contracts.AbstractModel),function(r,e){"use strict";function t(){this.createDate=null,this.currencyCode=null,this.memberCode=null,this.memberStatus=null,this.signUpIp=null,this.signUpSiteUrl=null,this.dateTransaction=null,this.formats={dateFormat:"YYYY/MM/DD",timeFormat:"hh:mm:ss A"}}r.Class("Pt.Contracts.MemberProfileSummary",t),r.extend(t.prototype,e.prototype,{formatReportDateTime:function(e,t){var n=this.formats;return"object"==typeof t&&(n=r.extend(n,t)),'<span class="report-data-date">'+e.format(n.dateFormat)+"</span>"+" "+('<span class="report-data-time">'+e.format(n.timeFormat)+"</span>")},getCreateDate:function(e){return!r.isNull(this.createDate)&&r.isFunction(this.createDate.format)?this.formatReportDateTime(this.createDate,e):this.this.formatReportDateTime(moment(new Date),e)},getMemberCode:function(){return r.maskString(this.memberCode,3,2,r.trans("affiliate.reports_username_mask"))},getDateTransaction:function(e){if(this.dateTransaction){var t=moment(this.dateTransaction);return!r.isNull(t)&&r.isFunction(t.format)?this.formatReportDateTime(t,e):this.formatReportDateTime(moment(new Date),e)}return""}})}(_,Pt.Contracts.AbstractModel),function(t,e){"use strict";function n(){this.bonusAmount=null,this.bonusAmountInUSD=null,this.depositAmount=null,this.depositAmountInUSD=null,this.memberCode=null,this.memberId=null,this.otherFeeAmount=null,this.otherFeeAmountInUSD=null,this.paymentFeeAmount=null,this.paymentFeeAmountInUSD=null,this.rebateAmount=null,this.rebateAmountInUSD=null,this.withdrawalAmount=null,this.withdrawalAmountInUSD=null,this.currency=null}function r(e){return t.isNull(this[e])||0===this[e]?t.trans("affiliate.reports_payment_zero_value"):t.toCurrencyTruncate(this[e])}t.Class("Pt.Contracts.PaymentReport",n),t.extend(n.prototype,e.prototype,{getBonusAmount:function(){return r.call(this,"bonusAmount")},getBonusAmountInUSD:function(){return r.call(this,"bonusAmountInUSD")},getDepositAmount:function(){return r.call(this,"depositAmount")},getDepositAmountInUSD:function(){return r.call(this,"depositAmountInUSD")},getOtherFeeAmount:function(){return r.call(this,"otherFeeAmount")},getOtherFeeAmountInUSD:function(){return r.call(this,"otherFeeAmountInUSD")},getPaymentFeeAmount:function(){return r.call(this,"paymentFeeAmount")},getPaymentFeeAmountInUSD:function(){return r.call(this,"paymentFeeAmountInUSD")},getRebateAmount:function(){return r.call(this,"rebateAmount")},getRebateAmountInUSD:function(){return r.call(this,"rebateAmountInUSD")},getWithdrawalAmount:function(){return r.call(this,"withdrawalAmount")},getWithdrawalAmountInUSD:function(){return r.call(this,"withdrawalAmountInUSD")},getMemberCode:function(){return t.maskString(this.memberCode,3,2,t.trans("affiliate.reports_username_mask"))}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.activeMember=null,this.products=null,this.totalCompanyWinLossAmount=null,this.totalRakesAmount=null,this.totalTurnoverAmount=null}e.Class("Pt.Contracts.ProductOverview",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(t,e){"use strict";function n(){this.baseStakeAmount=null,this.baseWinLoseAmount=null,this.clickAble=null,this.productCode=null,this.productGroup=null,this.productName=null,this.stakeAmount=null,this.winLoseAmount=null,this.currencyCode=null}function r(e){return t.isNull(this[e])||0===this[e]?t.trans("affiliate.reports_win_loss_zero_value"):t.toCurrencyTruncate(this[e])}t.Class("Pt.Contracts.ProductReport",n),t.extend(n.prototype,e.prototype,{getProductName:function(){return t.trans("games."+this.productCode)},getBaseStakeAmount:function(){return r.call(this,"baseStakeAmount")},getBaseWinLoseAmount:function(){return r.call(this,"baseWinLoseAmount")},getStakeAmount:function(){return r.call(this,"stakeAmount")},getWinLoseAmount:function(){return r.call(this,"winLoseAmount")}})}(_,Pt.Contracts.AbstractModel),function(t,e){"use strict";function n(){this.productCode=null,this.rakesAmount=null,this.stakeAmount=null,this.activePlayer=null,this.winLossAmount=null}function r(e){return t.isNull(this[e])||0===this[e]?t.trans("affiliate.reports_payment_zero_value"):t.toCurrencyTruncate(this[e])}t.Class("Pt.Contracts.ProductSummary",n),t.extend(n.prototype,e.prototype,{getProductName:function(){return t.trans("affiliate.product_"+this.productCode)},getRakesAmount:function(){return r.call(this,"rakesAmount")},getStakeAmount:function(){return r.call(this,"stakeAmount")},getWinLossAmount:function(){return r.call(this,"winLossAmount")},getActivePlayer:function(){return this.activePlayer}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.newSignup=null,this.newSignupWithDeposit=null}e.Class("Pt.Contracts.SignupOverview",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.commission_types=null,this.countries=null,this.currencies=null,this.languages=null}e.Class("Pt.Contracts.SignupSettings",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.activeMember=null,this.products=null,this.totalWinLossAmount=null}e.Class("Pt.Contracts.SubAffiliate",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.code=null,this.name=null}e.Class("Pt.Contracts.TrackingName",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.clicks=null,this.uniqueClicks=null,this.code=null,this.name=null,this.date=null}e.Class("Pt.Contracts.TrackingStatistics",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.totalClicks=null,this.totalUniqueClicks=null,this.trackingStatistics=null}e.Class("Pt.Contracts.MainTrackingStatistics",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.status=null,this.message=null}e.Class("Pt.Contracts.AffiliateSignUp",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(t,e){"use strict";function n(){this.id=null,this.memberCode=null,this.parentId=null,this.parentMemberCode=null,this.currency=null,this.balance=null,this.registrationDate=null,this.status=null}t.Class("Pt.Contracts.Downline",n),t.extend(n.prototype,e.prototype,{canTopup:function(){return 1===this.status||20===this.status},getMemberCode:function(){return this.memberCode},getMaskedMemberCode:function(){return t.maskString(this.memberCode,3,2,t.trans("affiliate.reports_username_mask"))},getParentMemberCode:function(){return this.parentMemberCode},getBalance:function(){return function(e){return t.isNull(this[e])||0===this[e]?t.trans("affiliate.reports_payment_zero_value"):t.toCurrencyTruncate(this[e])}.call(this,"balance")}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.createdAt=null,this.reference=null,this.memberCode=null,this.amount=null,this.status=null}e.Class("Pt.Contracts.TopupHistory",n),e.extend(n.prototype,t.prototype,{getStatus:function(){return 1===this.status?e.trans("affiliate.option_status_success"):e.trans("affiliate.option_status_unsuccessful")}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.id=null,this.balance=null,this.currency=null}e.Class("Pt.Contracts.AffiliateBalance",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(t,e){function n(){var e;this.id=null,this.methodCode=null,this.mode=null,this.currencyCode=null,this.dailyLimit=null,this.maximumAmount=null,this.minimumAmount=null,this.totalAllowed=null,this.launcherUrl=null,this.processType=null,this.supportedBanks=[],this.customFields={},this.bankingType=null,this.processingFeeSupported=["alipay","wechat","selection","none"],this.formFields=[],this.fee={a:(e=parseFloat(Math.random().toFixed(2)),.49<e&&(e=parseFloat((e/2).toFixed(2))),e),b:parseFloat(Math.random().toFixed(2)),c:parseFloat(Math.random().toFixed(2))},this.selfLimit=null,this.hasSelfLimit=!1}t.Class("Pt.Contracts.AffiliateDepositMethods",n),t.extend(n.prototype,e.prototype,{getMinimumAmount:function(){return+this.minimumAmount},getMaximumAmount:function(){return+this.maximumAmount},isDailyUnlimited:function(){return 0===this.dailyLimit},isBankTransfer:function(){return"bank_transfer"===this.processType},getCustomFields:function(e){return t.has(this.customFields,e)?this.customFields[e]:this.customFields},getProcessingFee:function(){var e=this.getCustomFields("processing_fee");return t.booleanString(e)},hasProcessingFee:function(){return this.getProcessingFee()},getProcessingFeeMessage:function(){return t.str_replace_key({":method":this.getMethodName(),":member":Pt.Settings.member.code},t.trans("funds.processing_fee_message"))},isProcessingFeeSupported:function(){return-1<t.indexOf(this.processingFeeSupported,this.bankingType)},getActualAmount:function(e){return(e=+e)<22?e+this.fee.a:e<101?e+this.fee.b:e-this.fee.c},getMethodName:function(){return t.trans("transaction_methods.method_"+this.get("id"))},hasFormFields:function(){return!t.isEmpty(this.formFields)}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.bankCode=null,this.bankName=null,this.bankNativeName=null}e.Class("Pt.Contracts.AffiliateBankAccounts",n),e.extend(n.prototype,t.prototype,{getValue:function(){return this.bankCode},getLabel:function(){return this.bankNameNative}})}(_,Pt.Contracts.AbstractModel),function(n,e){"use strict";function t(){this.accountId=null,this.accountName=null,this.accountNumber=null,this.bankCode=null,this.bankBranch=null,this.bankDowntimeId=null,this.bankName=null,this.dateFrom=null,this.dateTo=null,this.externalDescription=null,this.showBankInfo=null}n.Class("Pt.Contracts.AffiliateSystemBankAccount",t),n.extend(t.prototype,e.prototype,{shouldShowBankInfo:function(){return this.showBankInfo},isCurrentlyDown:function(){if(null===this.bankDowntimeId||""===this.bankDowntimeId)return!1;var e=moment(this.dateFrom,"YYYY-MM-DDTHH:mm:ss"),t=moment(this.dateTo,"YYYY-MM-DDTHH:mm:ss"),n=moment(new Date).format("YYYY-MM-DDTHH:mm:ss");return n=moment(n,"YYYY-MM-DDTHH:mm:ss"),null!==this.dateFrom&&null===this.dateTo?e<=n:n.isBetween(e,t)},downDownTooltip:function(){var e="-";if(null!==this.dateFrom&&""!==this.dateFrom)e=moment(this.dateFrom).format("MM/DD/YYYY HH:mm:ss");var t="-";if(null!==this.dateTo&&""!==this.dateTo)t=moment(this.dateTo).format("MM/DD/YYYY HH:mm:ss");return'<div class="systembank-account-tootltip"><span cass="systembankaccount-tooltip-main-label">'+n.trans("funds.label_downtime")+"</span><br />"+n.trans("funds.label_downtime_from")+" "+e+"<br />"+n.trans("funds.label_downtime_to")+" "+t+"</div>"}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.paymentType=null,this.invId=null,this.methodCode=null,this.source=null,this.requestCurrency=null,this.requestAmount=null,this.requestBaseAmount=null,this.receivedCurrency=null,this.receivedAmount=null,this.receivedBaseAmount=null,this.status=null,this.requestDate=null,this.createdBy=null}e.Class("Pt.Contracts.FundsHistory",n),e.extend(n.prototype,t.prototype,{getPaymentMethod:function(){return e.trans("affiliate.funds_method_"+this.methodCode)},getSubmittedAmount:function(){return e.toCurrency(this.requestAmount,2)},getSubmittedAmountRMB:function(){return e.toCurrency(this.requestBaseAmount,2)},getReceivedAmount:function(){return e.toCurrency(this.receivedAmount,2)},getReceivedAmountRMB:function(){return e.toCurrency(this.receivedBaseAmount,2)},getStatus:function(){return e.trans("affiliate.option_status_"+this.status.toLowerCase())}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.id=null,this.hashId=null,this.title=null,this.summary=null,this.body=null,this.cardImage=null,this.startDate=null,this.categories=null}e.Class("Pt.Contracts.Article",n),e.extend(n.prototype,t.prototype,{getCardImage:function(){return e.isEmpty(this.cardImage)?"/assets/images/no-image.gif":"/"!==this.cardImage[0]?"/"+this.cardImage:this.cardImage},getStartDate:function(){return moment(this.startDate).format("MM/DD/YYYY")}})}(_,Pt.Contracts.AbstractModel),function(e,t){"use strict";function n(){this.affiliateId=null,this.currencyCode=null,this.deposit=0,this.memberCode=null,this.memberId=null,this.promotionClaim=0,this.rebate=0,this.withdrawal=0}e.Class("Pt.Contracts.DownlineHistory",n),e.extend(n.prototype,t.prototype,{})}(_,Pt.Contracts.AbstractModel),function(e){"use strict";var n={jpeg:"image/jpeg",jpg:"image/jpeg",png:"image/png",gif:"image/gif"};function t(){this.affiliateId=0,this.attachments=null,this.createdBy=null,this.createdDate=null,this.description=null,this.fileName=null,this.paymentType=null,this.paymentTypeId=0,this.settlementId=0}_.Class("Pt.Contracts.Affiliate.PaymentType",t),_.extend(t.prototype,e.prototype,{constructor:t,generateImgSource:function(){var e=(this.fileName||"").split(".").slice(-1)[0].toLowerCase(),t=n[e];return void 0!==t?"data:"+t+";base64, "+this.attachments:""}})}(Pt.Contracts.AbstractModel),function(a){"use strict";Pt.Cache={};var o={"<":function(e,t){return e<t},"<=":function(e,t){return e<=t},">":function(e,t){return t<e},">=":function(e,t){return t<=e}};a.mixin({snakeCaseUri:function(e){var t=a.toSnakeCase(e,"/");return a.toSnakeCase(t,"-")},str_replace_key:function(e,t){var n,r;for(n in e)e.hasOwnProperty(n)&&(r=new RegExp(n,"g"),t=t.replace(r,e[n]));return t},propertyValue:function(e,t,n){var r=t.split(".");try{for(var i=0;i<r.length;i++)null!==n&&i+1===r.length&&(e[r[i]]=e[r[i]]||n),e=e[r[i]];return e}catch(e){return n}},capitalize:function(e){return e.charAt(0).toUpperCase()+e.substring(1).toLowerCase()},limitWords:function(e,t){var n="",r=e.replace(/\s+/g," ").split(" "),i=0;if(t<r.length){for(i=0;i<t;i++)n=n+" "+r[i]+" ";return n+"..."}return e},ucfirst:function(e){return e.charAt(0).toUpperCase()+e.slice(1)},toSnakeCase:function(e,t){var n=a.isUndefined(t)?/\s/gi:new RegExp(t,"g");return"_"===(e=(e=e.replace(n,"_")).toLowerCase())[0]?e.substr(1):e},toCamelCase:function(e){return e.replace(/_([a-z])/g,function(e){return e[1].toUpperCase()})},urlSegments:function(e,t,n){n="undefined"===n?0:n;try{e=e.replace(/(\?.*)|(#.*)/g,"");var r=a.trimSlash(e).split("/");return(r=r.slice(t,n)).join("/")}catch(e){}return e},trimTrailingSlash:function(e){return e.replace(/\/$/,"")},trimSlash:function(e,t){switch(t=t||"left"){case"left":if("/"===e[0])return e.substr(1);break;case"right":if("/"===e[e.length-1])return e.substr(0,e.length-1)}return e},maskString:function(e,t,n,r){return e+="",a.isEmpty(e)?r:(t=+t,n=+n,e.substr(0,t)+r+e.substr(e.length-n,n))},firstProp:function(e){for(var t in e)return e[t]},extendArrayObject:function(r,n,i){return"index"===(i=i||"index")?a.each(r,function(e,t){a.extend(e,n[t])}):a.each(n,function(e){var t={};t[i]=e[i];var n=a.findWhere(r,t);a.isEmpty(n)||a.extend(n,e)}),r},extendOnly:function(n,r){return a.each(n,function(e,t){n[t]=void 0===r[t]?n[t]:r[t]}),n},getUniqueByProp:function(n,r){var e=a.uniq(a.pluck(n,r));return a.map(e,function(e){var t={};return t[r]=e,a.findWhere(n,t)})},dottedObject:function(e,t){var n=t;try{for(var r=e.split("."),i=0;i<r.length;i++)n=n[r[i]];return n}catch(e){return!1}},sortStringInteger:function(e){return e.sort(function(e,t){return e-t})},sortByReference:function(e,r,i){if(a.isEmpty(e))return r;var s=[];return a.each(e,function(e){var t={};t[i]=e;var n=a.findWhere(r,t)||{};a.isEmpty(n)||s.push(n)}),s},mergeByProperty:function(e,t){var n=[];return a.each(e,function(e){n.push(e[t])}),a.flatten(n)},getBaseDomain:function(){return a.str_replace_key({"www.":""},location.hostname)},toFullUrl:function(e,t){return t?t+"/"+this.trimSlash(e):location.protocol+"//"+location.host+"/"+this.trimSlash(e)},parseUrl:function(e,t){var n=document.createElement("a");return n.href=e,n[t]},urlHash:function(){return location.hash.replace("#","")},addRouteParamsToUri:function(e,t){var n={};return a.each(e,function(e,t){n[":"+t]=e}),this.str_replace_key(n,t)},getParameterByName:function(e){e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var t=new RegExp("[\\?&]"+e+"=([^&#]*)").exec(location.search);return null===t?"":decodeURIComponent(t[1].replace(/\+/g," "))},encodeObjToUri:function(e,t){var n="",r=0,i="function"==typeof encodeURI;return a.each(e,function(e,t){n+=r?"&":"?",n+=t+"=",n+=i?encodeURI(e):e,r++}),a.isEmpty(t)?n:t+n},isIe:function(e){var t,n,r,i,s=(navigator&&navigator.userAgent||"").toLowerCase().match(/(?:msie |trident.+?; rv:)(\d+)/);return null!==s&&(t=s[1],r=+((n=e+"").match(/\d+/)||NaN),i=n.match(/^[<>]=?|/)[0],o[i]?o[i](t,r):t===r||r!=r)},isMobile:function(){return window._isMobileDevice.any},isAndroid:function(){return window._isMobileDevice.android.device},isIos:function(){return window._isMobileDevice.apple.device},mobileDevice:function(){return window._isMobileDevice.android.device?"android":window._isMobileDevice.apple.device?"ios":window._isMobileDevice.windows.device?"windows":window._isMobileDevice.amazon.device?"amazon":"other"},toInt:function(e){var t=parseInt(e);return isNaN(t)?0:t},toFloat:function(e){if(a.isNumber(e))return e;e=e.replace(new RegExp("(,)","gi"),"");var t=parseFloat(e);return isNaN(t)?0:t},negativeToZero:function(e){return isNaN(e)?0:parseFloat(e)<0?0:parseFloat(e)},paginate:function(e,t,n){return a.chain(e).rest(t).first(n)._wrapped},isSameRoute:function(e,t){return!a.isEmpty(e)&&(e.canonicalPath===t.canonicalPath&&e.params.path===t.params.path&&e.params.pathname===t.params.pathname&&e.state.path===t.state.path)},getRange:function(e,t,n){return a.first(a.rest(e,t),n)},imgPathResolver:function(e,t){try{var n=e.image.relative_uri;return a.isEmpty(t)||a.isEmpty(e[t])||(n=e[t].relative_uri),a.isEmpty(n)||"/"===n[0]||(n="/"+n),n}catch(e){return""}},showCurrency:function(e){var t=Pt.Settings.member.currency||"RMB";return void 0===e||a.isEmpty(e)||"-"===e||"*"===e||"_"===e?t:e},toCurrency:function(e,t){var n=new RegExp("(\\d)(?=(\\d{3})+(?!\\d))","gi");return((e=a.toFloat(e)).toFixed(t||2)+"").replace(n,"$1,")},toCurrencyTruncate:function(e){var t=new RegExp("(\\d)(?=(\\d{3})+(?!\\d))","gi");return((e=0<(e=a.toFloat(""+e))?Math.floor(100*e)/100:Math.ceil(100*e)/100)+"").replace(t,"$1,")},booleanString:function(e){return a.isBoolean(e)?e:!(void 0===e||a.isNull(e)||a.isEmpty(e)||0<a.allKeys(e).length)&&"true"===(e=a.isArray(e)?e[0]:a.isUndefined(e)?"false":e).toLowerCase()},isFalsy:function(e){return a.isNull(e)||a.isEmpty(e)||a.isUndefined(e)||a.isNaN(e)||0===e},exceedsDecimal:function(e,t){return-1<e.indexOf(".")&&e.length-e.indexOf(".")-1>t},escapeHtmlQuotes:function(e){return e?e.replace(/\'/g,"&#39;").replace(/\"/g,"&#34;"):""},getFormValue:function(e,t){if(!a.isEmpty(e)&&!a.isEmpty(t))return a.findWhere(e,{name:t}).value||void 0},nthMask:function(e,n){return a.isEmpty(e)?e:(a.isEmpty(n)&&(n=2),e=a.map(e.split(""),function(e,t){return(t+1)%n==0?"*":e}).join(""))},leadingZero:function(e){return isNaN(e)||e<0?e:e<=9?"0"+e:e},percentage:function(e,t){return!isNaN(e)&&!isNaN(t)&&e/t*100+"%"},updateCdnPath:function(e){try{var t=Pt.Settings.cdn_settings;return a.isUndefined(t.use_domain_prefixed_path)||"true"!==t.use_domain_prefixed_path?"/"+a.trimSlash(e.relative_uri):a.trimSlash(e.uri)}catch(e){}}})}(_),function(e){"use strict";function d(e,t){var n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}function o(e,t,n,r,i,s){return d((a=d(d(t,e),d(r,s)))<<(o=i)|a>>>32-o,n);var a,o}function m(e,t,n,r,i,s,a){return o(t&n|~t&r,e,t,i,s,a)}function f(e,t,n,r,i,s,a){return o(t&r|n&~r,e,t,i,s,a)}function p(e,t,n,r,i,s,a){return o(t^n^r,e,t,i,s,a)}function h(e,t,n,r,i,s,a){return o(n^(t|~r),e,t,i,s,a)}function u(e,t){var n,r,i,s,a;e[t>>5]|=128<<t%32,e[14+(t+64>>>9<<4)]=t;var o=1732584193,u=-271733879,l=-1732584194,c=271733878;for(n=0;n<e.length;n+=16)u=h(u=h(u=h(u=h(u=p(u=p(u=p(u=p(u=f(u=f(u=f(u=f(u=m(u=m(u=m(u=m(i=u,l=m(s=l,c=m(a=c,o=m(r=o,u,l,c,e[n],7,-680876936),u,l,e[n+1],12,-389564586),o,u,e[n+2],17,606105819),c,o,e[n+3],22,-1044525330),l=m(l,c=m(c,o=m(o,u,l,c,e[n+4],7,-176418897),u,l,e[n+5],12,1200080426),o,u,e[n+6],17,-1473231341),c,o,e[n+7],22,-45705983),l=m(l,c=m(c,o=m(o,u,l,c,e[n+8],7,1770035416),u,l,e[n+9],12,-1958414417),o,u,e[n+10],17,-42063),c,o,e[n+11],22,-1990404162),l=m(l,c=m(c,o=m(o,u,l,c,e[n+12],7,1804603682),u,l,e[n+13],12,-40341101),o,u,e[n+14],17,-1502002290),c,o,e[n+15],22,1236535329),l=f(l,c=f(c,o=f(o,u,l,c,e[n+1],5,-165796510),u,l,e[n+6],9,-1069501632),o,u,e[n+11],14,643717713),c,o,e[n],20,-373897302),l=f(l,c=f(c,o=f(o,u,l,c,e[n+5],5,-701558691),u,l,e[n+10],9,38016083),o,u,e[n+15],14,-660478335),c,o,e[n+4],20,-405537848),l=f(l,c=f(c,o=f(o,u,l,c,e[n+9],5,568446438),u,l,e[n+14],9,-1019803690),o,u,e[n+3],14,-187363961),c,o,e[n+8],20,1163531501),l=f(l,c=f(c,o=f(o,u,l,c,e[n+13],5,-1444681467),u,l,e[n+2],9,-51403784),o,u,e[n+7],14,1735328473),c,o,e[n+12],20,-1926607734),l=p(l,c=p(c,o=p(o,u,l,c,e[n+5],4,-378558),u,l,e[n+8],11,-2022574463),o,u,e[n+11],16,1839030562),c,o,e[n+14],23,-35309556),l=p(l,c=p(c,o=p(o,u,l,c,e[n+1],4,-1530992060),u,l,e[n+4],11,1272893353),o,u,e[n+7],16,-155497632),c,o,e[n+10],23,-1094730640),l=p(l,c=p(c,o=p(o,u,l,c,e[n+13],4,681279174),u,l,e[n],11,-358537222),o,u,e[n+3],16,-722521979),c,o,e[n+6],23,76029189),l=p(l,c=p(c,o=p(o,u,l,c,e[n+9],4,-640364487),u,l,e[n+12],11,-421815835),o,u,e[n+15],16,530742520),c,o,e[n+2],23,-995338651),l=h(l,c=h(c,o=h(o,u,l,c,e[n],6,-198630844),u,l,e[n+7],10,1126891415),o,u,e[n+14],15,-1416354905),c,o,e[n+5],21,-57434055),l=h(l,c=h(c,o=h(o,u,l,c,e[n+12],6,1700485571),u,l,e[n+3],10,-1894986606),o,u,e[n+10],15,-1051523),c,o,e[n+1],21,-2054922799),l=h(l,c=h(c,o=h(o,u,l,c,e[n+8],6,1873313359),u,l,e[n+15],10,-30611744),o,u,e[n+6],15,-1560198380),c,o,e[n+13],21,1309151649),l=h(l,c=h(c,o=h(o,u,l,c,e[n+4],6,-145523070),u,l,e[n+11],10,-1120210379),o,u,e[n+2],15,718787259),c,o,e[n+9],21,-343485551),o=d(o,r),u=d(u,i),l=d(l,s),c=d(c,a);return[o,u,l,c]}function l(e){var t,n="",r=32*e.length;for(t=0;t<r;t+=8)n+=String.fromCharCode(e[t>>5]>>>t%32&255);return n}function c(e){var t,n=[];for(n[(e.length>>2)-1]=void 0,t=0;t<n.length;t+=1)n[t]=0;var r=8*e.length;for(t=0;t<r;t+=8)n[t>>5]|=(255&e.charCodeAt(t/8))<<t%32;return n}function r(e){var t,n,r="0123456789abcdef",i="";for(n=0;n<e.length;n+=1)t=e.charCodeAt(n),i+=r.charAt(t>>>4&15)+r.charAt(15&t);return i}function n(e){return unescape(encodeURIComponent(e))}function i(e){return l(u(c(t=n(e)),8*t.length));var t}function s(e,t){return function(e,t){var n,r,i=c(e),s=[],a=[];for(s[15]=a[15]=void 0,16<i.length&&(i=u(i,8*e.length)),n=0;n<16;n+=1)s[n]=909522486^i[n],a[n]=1549556828^i[n];return r=u(s.concat(c(t)),512+8*t.length),l(u(a.concat(r),640))}(n(e),n(t))}function t(e,t,n){return t?n?s(t,e):r(s(t,e)):n?i(e):r(i(e))}"function"==typeof define&&define.amd?define(function(){return t}):"object"==typeof module&&module.exports?module.exports=t:e.md5=t}(this),function(){"use strict";var e=window.location.protocol+"//"+window.location.hostname,t=e+"/api/v2/",n=e+"/api/v1/",r=e+"/api/v3/:pubkey/:lang/op/:msId.:cmsId/",i=t+"members/",s=e+"/:lang/api/v1/operator/:operatorId/",a=e+"/cms/api/v2/",o=e+"/cms/api/v3/",u=o+"affiliates/",l=t+"affiliates/:affiliateId/",c=r+"affiliates/downline/",d=r+"affiliates/account/:affiliateUser/",m=t+"members/:memberCode/",f=n+"members/:memberCode/",p=e+"/cms/payments/",h=r+"game/:vendor/",g=r+"affiliates/";Pt.Endpoints={urls:{assets:"/assets/",templates:"/build/templates/",api:{affiliate:{signup:t+"affiliates",member:t+"affiliates",login:t+"affiliates/signin",forgotLogin:t+"affiliates/forgot-password",publicAnnouncements:r+"affiliates/announcements",announcements:r+"affiliates/announcements/:affiliateUser",signupSettings:t+"affiliates/form-settings",productOverview:l+"product-overview",subAffiliates:l+"sub-affiliate/product-overview",overview:l+"overview",signupOverview:l+"signup-count-overview",creativeBannerSizes:l+"creative-banner-sizes",creativeTrackers:l+"creative-dropdown",creativeList:l+"creative-list",creativeTrackingNames:l+"tracking-names",trackingStatistics:l+"tracking-statistics",reports:l+"reports/:reportType",websites:l+"websites",changePassword:l+"change-password",subAffiliateInvite:l+"invitations",track:n+"affiliates/track",countryList:o+"country-list",downlineStatus:c+":affiliateUser/status",downlineSearch:c+":affiliateUser/from/:regDateFrom/to/:regDateTo/type/:type",downlineSearchByUser:c+":affiliateUser/from/:regDateFrom/to/:regDateTo/type/:type/user/:user",downlineTopupHistory:c+"history/:affiliateUser/from/:startDate/to/:endDate/type/:type/method/:method/status/:status",downlineDailyTransactions:c+"transactions/:affiliateUser/from/:startDate/to/:endDate",accountBalance:d+"balance",accountTopup:d+"balance/top-up/:type",depositMethods:d+"deposit-methods",deposit:d+"deposit/:method",lastWireTransfer:d+"last-wire-transfer",systemBankAccounts:d+"system-bank-accounts",banks:d+"bank-accounts",fundsHistory:d+"history/:paymentType/from/:startDate/to/:endDate/status/:paymentStatus",paymentType:g+"settlements/payment-type",reportsV3:g+"account/:affiliateUser/reports/reportType"},member:{sessionCheck:e+"/local/members/session-check",sessionVerification:e+"/local/members/sessions/verification",login:e+"/local/members/sessions",signup:t+"members",signupV3:r+"members/registration/full",quickRegistration:t+"members/quick-registration",quickRegistrationFinalStep:t+"members/quick-registration/final-step",resendVerification:t+"members/verification/resend-mail",validateSession:t+"validate-session",member:m,forgotLogin:t+"members/forgot-password",publicAnnouncements:t+"announcements",announcements:m+"announcements",cashierPageAnnouncements:m+"cashier-announcements",updatePassword:m+"password",bankingDetail:m+"bank-detail",deliveryAddress:m+"delivery-address",privateMessageSubjects:m+"private-messages/subjects",privateMessages:m+"private-messages",privateMessage:m+"private-messages/:messageId",privateImportant:m+"private-messages/:messageId/flag",privateMessagesBulkDelete:m+"private-messages/trash/batch",paymentTransactionLimits:t+"members/transaction-limits",wallets:m+"wallets",fundTransfers:m+"fund-transfers",balance:m+"wallets/:walletId/balance",freeBetClaims:m+"free-bet-claims",banks:m+"bank-accounts",systemBankAccounts:m+"system-bank-accounts",preferredBank:f+"preferred-bank/:type",depositMethods:m+"deposit-methods",offlineDeposit:m+"deposits",onlineDeposits:m+"deposits/:methodId",onlineWithdrawals:m+"withdrawals/:methodId",offlineTransfer:m+"deposits/:methodId/offline-transfer",transactions:m+"deposits/:methodId/transactions/:transactionId",withdrawal:m+"withdrawals",withdrawalMethods:m+"withdrawal-methods",withdrawalTransactions:m+"withdrawal-status/:transactionStatus",cancelWithdrawal:m+"withdrawals/:methodId",depositWithdrawalHistory:m+"histories/deposit-withdrawals",fundTransferHistory:m+"histories/fund-transfers",adjustmentsHistory:m+"histories/adjustments",referralBonusHistory:m+"histories/referrals",promotionsClaimsHistory:m+"histories/promotion-fund-transfers",promotionsPageClaimsHistory:m+"histories/promotion-claims",spinwheelRedemptionsHistory:r+"rewards/account/:memberCode/redemptions/from/:dateFrom/to/:dateTo",scratchCardDenominations:m+"scratch-card/:methodId/denominations",scratchCardQuantity:m+"scratch-card/:methodId/quantity",scratchCardValidate:m+"scratch-card/:methodId/validate",checkCustomPromotionEligibility:r+"promotions/:promotion/eligibility",customPromotionClaim:r+"promotions/:promotion/claim",rebateSummaryList:m+"product-rebate-summaries",rebateClaims:m+"rebate-claims",rebateCodes:m+"rebate-codes",promotionClaims:m+"promotion-claims",bonusCodes:m+"promotions",promoCodeStatus:m+"promo-codes/:promoCode/status",rebatePromoCodeStatus:m+"rebate-codes/:promoCode",rebateSummaryPerProduct:m+"current-week-rebates/",dailySummaryPerProductUri:m+"current-daily-rebates/:product/?date=:date",previousDailySummaryUri:m+"previous-daily-rebates/?date=:date",rebatePreviousWeekSummary:m+"previous-week-rebates?date=:date",newRebateSummaryPerProduct:m+"rebates/summary/:product?date=:date&period=:period",newRebateStatements:m+"rebates/statements?date=:date&period=:period",newRebateStatementPerProduct:m+"rebates/statement/:product?date=:date&period=:period",favoriteSlotGames:m+"favorite-slot-games",slotGameHistory:m+"slot-game-histories",currencyConversion:t+"currency/conversion?currencyFrom=:currencyFrom&currencyTo=:currencyTo",currencyConversionToRmb:t+"currency/base-exchange-rate/:currencyFrom",bankingDetails:i+"banking-details",bankingProvinces:i+"banking-details/provinces",bankingCities:i+"banking-details/provinces/:provinceId/cities",bankingDistricts:i+"banking-details/cities/:cityId/districts",bankingDetailsAccount:i+"banking-details/:accountId",referrals:f+"referrals",gameExternalAuth:e+"/members/external_auth",safetyRating:r+"members/:memberCode/safety-rating",sendEmailVerification:r+"members/:memberCode/send-email-verification",sendSmsVerification:r+"members/:memberCode/send-sms-verification",verifySmsCode:r+"members/:memberCode/contact-number-verification",verifyEmailCode:r+"members/:memberCode/email-verification",rewards:r+"rewards/account/:memberCode",leaderboard:t+"tournament/leaderboards/:club",spinWheelItems:m+"spin-wheel/prize-items",spinWheelClaim:m+"spin-wheel/claim",hotMatchFeed:r+"sportsbook/hot-matches",gameVendorAccount:h+"account"}},cms:{captcha:"/local/captcha/:type/:case",page:o+"pages",banners:s+"banners/:platform",widget:o+"widgets/:widget",widgetBundle:o+"widgets/bundled/:bundle",games:o+"games",gameByVendorAndId:o+"games/vendor/:vendor/id/:gameId",promotionCategories:a+"promo_categories",promotions:o+"promos",affiliatePromotions:u+"promotions",affiliatePromotionsCategories:o+"affiliates/promo-categories",affiliateArticles:u+"articles",affiliateArticlesCategories:o+"affiliates/article-categories",bankingOptions:p+"banking-options",activeDepositMethods:p+"active-deposit-methods",rebates:p+"rebates",walletConfig:p+"wallet-settings",bankCodes:p+"bank-codes",infoCenterCategories:a+"info-centre/categories",infoCenterList:a+"info-centre/category/id/:catId/names",infoCenterDetails:a+"info-centre/category/id/:catId/content/:detailId",infoCenterDetailsBySlug:a+"info-centre/category_slug/:catSlug/:slug"}}}}(),function(i,e,s){var t={extendDepositAmountRules:function(e,t,n){var r=s.validation.deposit[e].amount.numericality;arguments[3]&&"affiliate"===arguments[3]&&(r=s.validation.affiliate.deposit[e].amount.numericality),r.notLessThanOrEqualTo=i.trans("errors.deposit_amount_notLessThanOrEqualTo"),r.notGreaterThanOrEqualTo=i.trans("errors.deposit_amount_notGreaterThanOrEqualTo"),r.greaterThanOrEqualTo=+t,r.lessThanOrEqualTo=+n},getMethodRules:function(e){var t="withdrawal"===arguments[1]?"withdrawal":"deposit";return arguments[2]&&"affiliate"===arguments[2]?s.validation.affiliate[t][e]||{}:s.validation[t][e]||{}},extendWithdrawalAmountRules:function(e,t,n){var r=s.validation.withdrawal[e].amount.numericality;r.notLessThanOrEqualTo=i.trans("errors.withdrawal_amount_notLessThanOrEqualTo"),r.notGreaterThanOrEqualTo=i.trans("errors.withdrawal_amount_notGreaterThanOrEqualTo"),r.greaterThanOrEqualTo=+t,r.lessThanOrEqualTo=+n},extendDateRangeRules:function(e,t,n){var r=e.val();validate.extend(validate.validators.datetime,{parse:function(e,t){return+moment.utc(e)},format:function(e,t){var n=t.dateOnly?"YYYY-MM-DD":"YYYY-MM-DD hh:mm:ss";return moment.utc(e).format(n)}}),n.datetime={message:i.trans("errors.endDate_less_than_startDate"),dateOnly:!0,earliest:moment.utc(r).add(1,"days")}}};i.Class("Pt.Helpers.RulesHelper",t)}(_,jQuery,Pt.Rules),function(a,o,u){var e={generate:function(e,t,n){var r=n.limit||u.games.slots.listLimit;if(!n.total||n.total<r)return o(e).html(""),null;o(e).html('<ul data-js="paging-element" class="pagination"></ul>'),t=a.isFunction(t)?t:function(){};var i=Math.ceil(n.total/r),s=a.extend({visible:5,first:a.trans("global.pagination_first"),last:a.trans("global.pagination_last"),previous:a.trans("global.pagination_previous"),next:a.trans("global.pagination_next")},n);return o("[data-js=paging-element]").twbsPagination({totalPages:a.isNaN(i)?0:i,visiblePages:s.visible,onPageClick:t,first:s.first,last:s.last,prev:s.previous,next:s.next,initiateStartPageClick:!1})}};a.Class("Pt.Helpers.PaginationHelper",e)}(_,jQuery,Pt.Config),function(e){"use strict";var t={start:function(){e.start()},done:function(){e.done()}};_.Class("Pt.Helpers.Nprogress",t)}(window.NProgress),function(i,s){var e={success:function(e){e=i.isArray(e)?e.join("<br>"):e;var t=i.isUndefined(arguments[1])?5:arguments[1];this._alert(1,e,{time:t})},warning:function(e){this._alert(2,e,{timer:timer})},error:function(e){e=i.isArray(e)?e.join("<br>"):e;var t=i.isUndefined(arguments[1])?5:arguments[1];this._alert(3,e,{timer:t})},info:function(e){this._alert(4,e,{timer:5})},confirm:function(e,t,n,r,i){s.confirm({text:e,stay:!1,submitText:t,cancelText:n,submitCallback:r,cancelCallback:i})},_alert:function(e,t,n){var r=i.extend({type:e,text:t,position:"top",timer:0,stay:!1,submitText:"Yes",cancelText:"Cancel",submitCallback:function(){},cancelCallback:function(){}},n);s.alert(r)}};i.Class("Pt.Helpers.Notify",e)}(_,window.notie),function(n){"use strict";var e={show:function(e){var t=_.map(e,function(e){if(_.isObject(e.message)&&_.has(e.message,"message"))return e.message.message;var t=e.message,n=null;try{var r="errors."+JSON.parse(t).code.replace(/\./g,"_");n=_.trans(r),_.isString(JSON.parse(t).error)&&n===r&&(n=JSON.parse(t).error)}catch(e){}return n||t}).join("<br>");n.error(t)}};_.Class("Pt.Helpers.Error",e),_.Class("Pt.Helpers.ErrorHandler",e)}(Pt.Helpers.Notify),function(){"use strict";var e={lockForm:function(e,t){if(!$(e).length)return!1;var n=$(e)[0].elements;_.each(n,function(e){void 0===$(e).attr("data-locked-field")&&(e.disabled=t)})}};_.Class("Pt.Helpers.Form",e)}(),function(){"use strict";var t='<div class="loader"><div class="data-loader"></div></div>',n='<div class="loader loader-sm"><div class="data-loader"></div></div>',e={basic:function(e){return $(e).html(t),this},small:function(e){return $(e).html(n),this}};_.Class("Pt.Helpers.Preloader",e)}(),function(r){"use strict";_.Class("Pt.Helpers.ErrorParser",new function(){return{parseApiErrors:function(e){var t,n,r=e.responseJSON,i=[],s=_.has(r,"ErrorMessage");if(_.isObject(r.error)&&_.each(r.error,function(e,t){i.push(a(r.statusCode,_.isArray(e)?e[0]:e,"api"))}),s){if(_.isObject(r.ErrorMessage))return _.isArray(r.ErrorMessage)?i=_.map(r.ErrorMessage,function(e){return a(r.ResponseCode,e,"api")}):(t=r.ErrorMessage,n=[],_.each(t,function(e,t){_.isArray(e)?_.each(e,function(e){n.push(a(t,e,"api"))}):n.push(t,e)}),n);i.push(a(r.ErrorCode,r.ErrorMessage,"api"))}return s||!_.has(e,"responseText")||_.isObject(r.error)||i.push(a(e.status,e.responseText,"api")),i},createError:a};function a(e,t,n){return(new r).set("source",n).set("code",e).set("message",t)}})}(Pt.Contracts.Error),function(){"use strict";var r={labels:{placeholder:_.trans("global.label_search"),perPage:_.trans("global.dt_displayRecords"),noRows:_.trans("global.dt_NothingFound"),info:_.trans("global.dt_showingPage")},prevText:_.trans("global.dt_prev"),nextText:_.trans("global.dt_next"),firstText:_.trans("global.dt_first"),lastText:_.trans("global.dt_last"),ellipsisText:"&hellip;",ascText:"▴",descText:"▾",footer:!1,perPageSelect:"AffiliateSite"===Pt.Settings.site?[10,25,50,100]:[5,10,15,20,25]},e={render:function(e,t){function n(e){e.onFirstPage&&$(e.pagers).find("li.pager").first().addClass("disabled"),e.onLastPage&&$(e.pagers).find("li.pager").last().addClass("disabled")}var s=new window.DataTable(e,_.extend(r,_.propertyValue(Pt,"Plugins.defaults.datatable")||{},{footer:1===$(e).find("tfoot").length},t));return s.on("datatable.init",function(){n(s),$(".dataTable-sorter").attr("href","javascript:void(0);")}),s.on("datatable.page",function(e){n(s)}),s.on("datatable.perpage",function(){n(s)}),s.on("datatable.sort",function(){n(s)}),s.on("datatable.search",function(e,t){var n=$(s.wrapper).find(".dataTable-bottom"),r=$(s.wrapper).find(".dataTable-selector"),i=$(s.wrapper).find(".dataTable-sorter");_.isEmpty(e)||0!==t.length?(n.removeClass("hidden"),r.prop("disabled",!1),i.css("pointer-events","auto")):(n.addClass("hidden"),r.prop("disabled",!0),i.css("pointer-events","none")),s.onFirstPage&&$(s.pagers).find("li.pager").first().addClass("disabled")}),s},destroy:function(e){try{e.destroy()}catch(e){throw new Error("Not a Vanilla-Dtable instance")}}};_.Class("Pt.Helpers.DataTable",e)}(),function(){"use strict";var e={activate:function(e,t,n){if($(e).length){n&&window[n]($);var r=_.propertyValue(Pt,"Plugins.defaults.datepicker")||{},i=_.propertyValue(Pt,"Plugins.overrides.datepicker")||{};return $(e).datepicker(_.extend(r,t||{},i))}return!1}};_.Class("Pt.Helpers.DatePicker",e)}(),function(){"use strict";var e={activate:function(e,t){if($(e).length){var n=_.propertyValue(Pt,"Plugins.defaults.timepicker")||{},r=_.propertyValue(Pt,"Plugins.overrides.timepicker")||{};return $(e).timepicker(_.extend({icons:{up:"data-icon icon-arrow-up",down:"data-icon icon-arrow-down"}},n,t||{},r))}return!1}};_.Class("Pt.Helpers.TimePicker",e)}(),function(o,u){var a={smaller:"modal-sm",small:"",large:"modal-lg"},e={confirm:function(e){var t="confirm-modal",n={text:"",static:!0,modalOptionsKeyboard:!1,dialogClass:t+" text-center",confirmButton:u.trans("global.btn_proceed"),cancelButton:u.trans("global.btn_cancel")};e.dialogClass&&(e.dialogClass+=" "+t),o.confirm(u.extend(n,e)),EventBroker.dispatch(EventBroker.events.domChanged,{container:o("."+t),markup:o("."+t).html()})},info:function(e,t,n,r,i){var s="info-modal",a={title:e,text:t,static:!0,modalOptionsKeyboard:!1,dialogClass:s+" text-center",confirmButton:u.trans("global.btn_ok"),showCancel:!1};r.dialogClass&&(r.dialogClass+=" "+s),"function"==typeof n&&(a.confirm=n),"function"==typeof i&&(a.cancel=i);o.confirm(u.extend(a,r));EventBroker.dispatch(EventBroker.events.domChanged,{container:o("."+s),markup:o("."+s).html()})},generic:function(e,t){var n=u.extend({size:"small"},t),r=o("[data-widget=generic-modal]"),i=r.find("[data-js=modal-content]"),s=r.find("[data-js=modal-dialog]");return s.removeClass().addClass("modal-dialog").addClass(a[n.size]),t&&t.additionalClass&&s.addClass(t.additionalClass),i.html(e),EventBroker.dispatch(EventBroker.events.domChanged,{container:i,markup:e}),r.modal("show"),r}};u.Class("Pt.Helpers.Modal",e)}(jQuery,_),function(e,i,t,s){"use strict";var n={decode:function(e){e=e.length?e[0]:null;var r=i.defer();if("function"!=typeof s)return r.reject({error:_.trans("errors.qr_decode_error")}),r.promise;var t=s();if(e.files&&e.files[0]){var n=new FileReader;n.onload=function(n){t.decodeFromImage(n.target.result,function(e,t){e?r.reject({error:_.trans("errors.qr_decode_error")}):r.resolve({file:n.target.result,value:t})})},n.readAsDataURL(e.files[0])}else r.reject({error:_.trans("errors.qr_no_file_selected")});return r.promise},decodeImage:function(e){var n=i.defer();return"function"!=typeof s?n.reject({error:_.trans("errors.qr_decode_error")}):s().decodeFromImage(e[0],function(e,t){e?n.reject({error:_.trans("errors.qr_decode_error")}):n.resolve({file:"",value:t})}),n.promise},getImage:function(e){e=e.length?e[0]:null;var t=i.defer();if(e.files&&e.files[0]){var n=new FileReader;n.onload=function(e){t.resolve({file:e.target.result})},n.readAsDataURL(e.files[0])}else t.reject({error:_.trans("errors.qr_no_file_selected")});return t.promise},generate:function(e){new QRCode(e.id,{text:e.url,width:e.width,height:e.height,colorDark:e.colorDark||"#000000",colorLight:e.colorLight||"#ffffff",correctLevel:QRCode.CorrectLevel.H})}};_.Class("Pt.Helpers.QrCode",n)}(jQuery,Q,Pt.Helpers.Notify,window.QCodeDecoder),function(n,t){function e(){this.hooks={"remove-if-not-auth":"removeIfNotAuth","remove-if-auth":"removeIfAuth","remove-if-funds":"removeIfFunds"}}e.prototype={run:function(e){if(e)return this[this.hooks[e]]();var t=this;n.each(this.hooks,function(e){t[e]()})},removeIfNotAuth:function(){var e=$("[data-hook=remove-if-not-auth]");return t.member.isLoggedIn&&"MemberSite"===Pt.Settings.site||t.affiliate.isLoggedIn&&"AffiliateSite"===Pt.Settings.site?e.removeClass("hide"):e.remove(),this},removeIfAuth:function(){var e=$("[data-hook=remove-if-auth]");return t.member.isLoggedIn&&"MemberSite"===Pt.Settings.site||t.affiliate.isLoggedIn&&"AffiliateSite"===Pt.Settings.site?e.remove():e.removeClass("hide"),this},removeIfFunds:function(){var e=$("[data-hook=remove-if-funds]");return"Funds"!==t.module&&t.member.isLoggedIn?e.removeClass("hide"):e.remove(),this}},n.Class("Pt.Helpers.Hook",new e)}(_,Pt.Settings),function(d,m,e){var t={generate:function(e,t,n){var r=t.current?t.current:"current",i=t.total?t.total:"total",s=t.paginationClass?t.paginationClass:"slick-counter",a=t.open?t.open:"[",o=t.close?t.close:"]",u='<div class="'+s+'">'+a+' <span class="'+r+' count"></span> '+(t.separator?t.separator:"/")+' <span class="'+i+'"></span> '+o+"</div>",l="."+r,c="."+i;e.on("init",function(e,t){m(this).append(u),m(l).text(d.leadingZero(t.currentSlide+1)),m(c).text(d.leadingZero(t.slideCount))}).slick(n).on("beforeChange",function(e,t,n,r){m(l).text(d.leadingZero(r+1))})}};d.Class("Pt.Helpers.SlickPaginationHelper",t)}(_,jQuery,Pt.Config),function(){"use strict";_.Class("Pt.Managers.Analytics",new function(){return{goalMap:{SIGN_UP_SUCCESS:1,LOG_IN_SUCCESS:2,DEPOSIT_SUBMIT:3,WITHDRAWAL_SUBMIT:5,SIGN_UP_FAIL:7,LOG_IN_FAIL:8},eventMap:{MEMBER_ACTIONS:"Member Actions",PAYMENT_ACTIONS:"Payment Actions"},actionMap:{SIGN_UP_FAIL:"Sign Up Fail",LOG_IN_FAIL:"Log In Fail",LOG_IN_SUCCESS:"Log In Success",WITHDRAWAL_SUCCESS:"Withdrawal Success",WITHDRAWAL_FAIL:":gateway: - Withdrawal Fail"},trackGoal:function(e,t){try{var n=i();!_.isEmpty(n)&&_.isFunction(n.trackGoal)&&n.trackGoal(e,t)}catch(e){}},trackEvent:function(e,t,n){try{var r=i();!_.isEmpty(r)&&_.isFunction(r.trackEvent)&&r.trackEvent(e,t,n)}catch(e){}}};function i(){return"undefined"!=typeof Piwik?Piwik.getAsyncTracker():{}}})}(),function(e,u){"use strict";u.Class("Pt.Managers.Cache",new function(){var o=window.simpleStorage;function e(){}return e.prototype={setObject:function(e,n){var r=this;u.each(e,function(e,t){r.set(n+t,e)})},set:function(e,t,n){var r,i,s,a={TTL:36e6};u.extend(a,n),r=e,i=t,s=a,o.canUse()?o.set(r,i,s):Pt.Cache[r]=i},get:function(e){return o.canUse()?o.get(e)||null:Pt.Cache[e]||null},remove:function(e){return o.canUse()?o.deleteKey(e):Pt.Cache[e]=null,this},flush:function(){o.flush()}},new e})}(jQuery,_),function(r,i){"use strict";r.Class("Pt.Managers.Cookie",new function(){return{get:function(e){if("lang"===e){var n=window.Cookies.get("lang");try{if(Pt.Settings.hasOwnProperty("new_feature_settings"))return r.each(Pt.Settings.new_feature_settings.language_override,function(e,t){e===n&&e!==t&&(n=t)}),n}catch(e){}}return window.Cookies.get(e)},set:function(e){var t={name:"",value:"",expires:7,path:"/",secure:!r.isEmpty(i.secure)&&i.secure};r.extend(t,e);var n=[null,i.main_domain,i.app_domain];r.each(n,function(e){window.Cookies.remove(t.name,{domain:e})}),window.Cookies.set(t.name,t.value,{expires:t.expires,path:t.path,domain:t.domain,secure:t.secure})},remove:function(e){var t={name:"",path:"/",secure:!r.isEmpty(i.secure)&&i.secure};return t=r.extend(t,e),window.Cookies.remove(t.name,t)}}})}(_,Pt.Settings),function(d,m,f){"use strict";function p(e){this.data=e}p.prototype={get:function(e){var t=m.findWhere(this.data,{name:e});if(t)return t.value},set:function(e,t){var n=m.findWhere(this.data,{name:e});return n?n.value=t:this.data.push({name:e,value:t}),this},toFormData:function(){var t=new FormData;return m.each(this.data,function(e){t.append(e.name,e.value)}),t}},m.Class("Pt.Managers.Validation",function(e,l){var c='<label class="error" for=":el"><span class="glyphicon glyphicon-remove"></span><small class="caption">:caption</small></label>',t=!1,a=!0,o="label.error",u=d(e),n=[[e+" input","change",r],[e+" textarea","change",r],[e+" select","change",r]];return{init:function(){u.length||(u=d(e));t&&m.each(n,function(e){d("body").off(e[1],e[0],e[2]).on(e[1],e[0],{context:self},e[2])})},setRules:function(e){return l=e,this},getRules:function(){return l},validate:function(e,t){var n=new p(u.serializeArray());d(o).remove(),d(".error").removeClass("error");var r=f(u,l);if(!r)return a&&(n=u.serializeArray()),e.call(t,n,t),!0;s=u,i=r,s=d(s),m.each(i,function(e,t){var n=s.find('[name="'+t+'"]'),r=m.str_replace_key({":el":n.attr("id"),":caption":e[0]},c),i=n.data("eph");i?d("[data-js="+i+"]").html(r):(n.next("label.error").remove(),n.addClass("error"),n.after(r))});var s,i},destroy:function(){m.each(n,function(e){d("body").off(e[1],e[0],self[e[2]])}),d(o).remove(),d(".error").removeClass("error")},bindInput:function(e){return t=e,this},shouldSerialize:function(e){return a=e,this},single:function(e,t,n){return f.single(e,t,n)}};function r(){var e={},t={},n=d(this),r=d(this).closest("form"),i=n[0].files||(m.isEmpty(n.val())?null:n.val());if(e[n.attr("name")]=i,t[n.attr("name")]=l[n.attr("name")],"object"==typeof l[n.attr("name")]&&void 0!==l[n.attr("name")].equality){var s=l[n.attr("name")].equality.attribute;e[s]=r.find('input[name="'+s+'"]').val()}var a,o,u=f(e,t)||{};m.isEmpty(u)?(d(this).next("label.error").remove(),d(this).removeClass("error")):(a=d(this),o=u,m.each(o,function(e){var t=m.str_replace_key({":el":a.attr("id"),":caption":e[0]},c);a.next("label.error").remove(),a.addClass("error"),a.after(t)}))}})}(jQuery,_,window.validate),function(t,i,e){"use strict";var s=new window.slidebars({scrollLock:!0}),n=[".js-close-any","click",function(e){s.getActiveSlidebar()&&(e.preventDefault(),e.stopPropagation(),s.close())}];s.init(),t(s.events).on("opening",function(e){t("[canvas]").addClass("js-close-any"),t("body").addClass("sb-open"),t(n[0]).on(n[1],n[2])}),t(s.events).on("closing",function(e){t(n[0]).off(n[1],n[2]),t("[canvas]").removeClass("js-close-any"),t("body").removeClass("sb-open")}),t(s.events).on("closed",function(e,t){EventBroker.dispatch(EventBroker.events.slidebar.close,{event:e.type,id:t})}),EventBroker.subscribe(EventBroker.events.navigate,function(){s.close()});var a={left:"app-left-nav",right:"app-right-nav"};i.Class("Pt.Managers.Slidebar",new function(){return{open:function(e,t,n){r("open",a[e],n,t)},close:function(e,t,n){r("close",a[e],n,t)},toggle:function(e,t,n){r("toggle",a[e],n,t)},closeAll:function(){s.getActiveSlidebar()&&s.close()}};function r(t,n,r,e){i.isEmpty(e)||e.preventDefault(),s[t](n,function(e){"function"==typeof r&&r({event:t,side:n,ev:e})})}})}(jQuery,_),function(s,a,o,u,l){"use strict";s.Class("Pt.Managers.Session",new function(){var r={MemberSite:"member",AffiliateSite:"affiliate"};return{handle:function e(t){var n=Pt.Services.Members.SessionService;l.Cookie.get(o.tokenKey)&&a.session_polling&&n.check(r[t]).then(function(e){e.data||(i(),u.info(s.trans("session.session_title"),s.trans("session.session_auto_logout"),function(){location.href="/"}))}).finally(function(){s.delay(function(){e(t)},a.session_polling_interval)})}};function i(){l.Cookie.remove({name:o.tokenKey}),l.Cookie.remove({name:"s"})}})}(_,Pt.Settings,Pt.Config,Pt.Helpers.Modal,Pt.Managers),function(e,u,l,c){"use strict";_.Class("Pt.Services.HttpClientCacheService",new function(){var r=_.propertyValue(e,"cacheKeys.httpclient")||"httpclient",t=c.get("lang")||"zh-hans",i=u.cache_settings&&u.cache_settings[u.site.toLowerCase()]||{},n="true"===i.active,s=u.app_md5;return{shouldUseCache:function(e){return e&&e.store&&n},setCache:function(e,t){var n=o()||{id:s};n[a(e)]=t,l.set(r,n,{TTL:1e3*(parseInt(i.ttl)||0)*60})},getCache:function(e){var t,n=o();n&&(s!==n.id?l.remove(r):(t=n[a(e)])&&(t.fromCache=!0));return t},getDataCacheKey:a};function a(e){return md5(s+t+e)}function o(){return l.get(e.cacheKeys.httpclient)}})}(Pt.Config,Pt.Settings,Pt.Managers.Cache,Pt.Managers.Cookie),function(g,v,b,e,y,C,_,P){"use strict";v.Class("Pt.Managers.HttpClient",new function(){var m=e.tokenKey,f="zh-hans";return{get:function(e,t,n,r){return p("GET",e,t,n,r)},post:function(e,t,n,r){return p("POST",e,t,n,r)},put:function(e,t,n,r){return p("PUT",e,t,n,r)},del:function(e,t,n,r){return p("DELETE",e,t,n,r)},setAuthKey:function(e){return m=e||m,this}};function p(i,u,s,a,o,e){var l,c,d=e||b.defer();if("GET"===i&&(l=P.shouldUseCache(o),c=u+(s?"?"+g.param(s):"")),l){var t=P.getCache(c);if(t)return d.resolve(t),d.promise}a=a||"json";var n=v.extend({type:i,url:u,data:s,dataType:a,timeout:y.httpTimeout||15e3,beforeSend:function(e){var t,n,r,i,s,a,o=C.get(m);v.isEmpty(o)||e.setRequestHeader("Authorization","Prometheus "+o),t=e,n={url:u},r=v.isEmpty(y.debug_host)?window.location.hostname.replace(/^(www\.)|^(m\.)/i,""):y.debug_host,i=n.url||"",s=-1===i.indexOf("/api/v3")||-1<i.indexOf("/cms/api/v3"),a=i.indexOf(".json")!==i.length-5,s&&a&&(t.setRequestHeader("Prometheus-BoId",y.operator.msId),t.setRequestHeader("Prometheus-operator-id",y.operator.cmsId),t.setRequestHeader("Prometheus-ClientIp",y.clientIp),t.setRequestHeader("App-Origin",window.location.origin),t.setRequestHeader("Prometheus-Domain",r),t.setRequestHeader("Accept-Language",C.get("lang")||f),t.setRequestHeader("X-Client-Version","v3"),t.setRequestHeader("X-Client-Key",y.public_key))},success:function(e,t,n){var r;h(n),void 0!==(r=e)&&"407"===r.status_code&&(v.each(r.data,function(e,t){C.set({name:t,value:e})}),1)?p(i,u,s,a,o,d):(!v.isUndefined(o)&&o.returnXhr?d.resolve({data:e,status:t,xhr:n}):d.resolve(e),l&&P.setCache(c,e))},error:function(e){var t=r(u)?"cms":"api";if("timeout"===e.statusText)return d.reject([_.createError(504,v.trans("errors.request_timeout_notification"),t)]),void EventBroker.dispatch(EventBroker.events.requestTimeout,u);if(401===e.status&&!r(u))return C.remove({name:m}),d.reject([_.createError(401,v.trans("errors.un_authorized"),t)]),void EventBroker.dispatch(EventBroker.events.memberUnauthorized,u);h(e);try{return r(u)?d.reject([_.createError(e.statusCode,e.statusText,t)]):500===e.status?d.reject([_.createError(0,v.trans("errors.unknown_error"),t)]):d.reject(_.parseApiErrors(e)),this}catch(e){d.reject([_.createError(0,v.trans("errors.unknown_error"),t)])}}},o||{});return v.isIe()&&(n.cache=!1),g.ajax(n),d.promise}function h(e){var t=e.getResponseHeader("Authorization");v.isEmpty(t)||(C.set({name:m,value:t,expires:-1}),C.set({name:m,value:t,domain:y.main_domain}))}function r(e){return window.location.origin&&(e=e.replace(window.location.origin,"")),/\/.*\/api\/v.*/.test(e)}})}(jQuery,_,Q,Pt.Config,Pt.Settings,Pt.Managers.Cookie,Pt.Helpers.ErrorParser,Pt.Services.HttpClientCacheService),function(e,l,c,d,r,m,f,i,p){"use strict";l.Class("Pt.Managers.Template",new function(){var e=window.prom_template_version,s="development"===d.env?r.urls.templates:"/"+d.asset_path,n=Pt.Templates.Extensions,a="tpl.",o={};return t=d.app+"-template-version",f.get(t)!==e&&(f.flush(),f.set(t,e,{TTL:3154e7})),{init:function(){var t=c.defer(),r=[],i=[];return l.each(h[d.site],function(e,t){var n=a+t;(!0!==f.get(n)||d.debug)&&(i.push(n),r.push(m.get(s+e)))}),c.allSettled(r).then(function(e){e.forEach(function(e,t){"fulfilled"===e.state&&(f.set(i[t],!0),f.setObject(e.value,i[t]+"."))}),function(e){if(l.isEmpty(n))return u(e);m.get("/"+n,null,null,{store:!0}).then(function(e){var t=e.data.web?e.data.web:[];l.each(t,function(e,t){l.isEmpty(e)||l.each(e,function(e){o[a+t+"."+e.key]=l.unescape(e.body)})})}).finally(function(){u(e)})}(t)}),t.promise},get:function(e,t){t=t||{};try{var n=o[a+e]?o[a+e]:f.get(a+e);if(!l.isEmpty(n)){n=n.replace(/<%\s*include\s*(.*?)\s*%>/g,function(e,t){return'<%= _.include("'+t+'", arguments) %>'});var r=l.template(n);return r(t)}}catch(e){d.debug&&i.error(e.message+"<br/><br/>"+e.stack,0)}return""},compile:function(e,t){t=t||{};try{var n=(e=l.unescape(e)).replace(/<%\s*include\s*(.*?)\s*%>/g,function(e,t){return'<%= _.include("'+t+'", arguments) %>'}),r=l.template(n);return r(t)}catch(e){d.debug&&i.error(e.message+"<br/><br/>"+e.stack,0)}return""}};var t;function u(n){var e=l.trimSlash(p.tpl);if(!e)return n.resolve(),!1;m.get("/"+e,null,null,{store:!0}).then(function(e){var t=e.prom_cp_templates;f.set(a+"plugins",!0),f.setObject(t,a+"plugins."),n.resolve()})}});var h={AffiliateSite:{aweb:"aweb.json",awidgets:"awidgets.json"},MemberSite:{web:"web.json",funds:"funds.json",profile:"profile.json",widgets:"widgets.json"}}}(jQuery,_,Q,Pt.Settings,Pt.Endpoints,Pt.Managers.HttpClient,Pt.Managers.Cache,Pt.Helpers.Notify,Pt.Plugins),function(t,n){"use strict";_.Class("Pt.Services.AbstractV3Service",new function(){return{replaceV3Tags:function(e){return _.str_replace_key({":pubkey":n.public_key,":lang":t.get("lang")||"en",":msId":n.operator.msId,":cmsId":n.operator.cmsId,":affiliateUser":n.affiliate.user},e)}}})}(Pt.Managers.Cookie,Pt.Settings),function(s,a,o,e,t,u){"use strict";_.Class("Pt.Services.Members.SessionService",new function(){return{check:function(){var t=s.defer();return u.get(o.urls.api.member.sessionCheck,{site:"member"}).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise},login:function(e,t,n){var r=s.defer(),i={memberCode:e,password:t,operatorId:a.operator.msId,deviceId:n||"Desktop"};return u.post(o.urls.api.member.login,i).then(function(e){return r.resolve(_.extendOnly(new Pt.Contracts.SignIn,e))}).fail(function(e){r.reject(e)}),r.promise},forgotLogin:function(e,t){var n=s.defer(),r={memberCode:e,email:t,operatorId:a.operator.msId,deviceId:"Desktop"};return u.post(o.urls.api.member.forgotLogin,r).then(function(e){n.resolve(_.extendOnly(new Pt.Contracts.ForgotPassword,e))}).fail(function(e){n.reject(e)}),n.promise},validate:function(){var t=s.defer();return u.get(o.urls.api.member.validateSession,{}).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise},resendVerification:function(e){var t=s.defer();return u.post(o.urls.api.member.resendVerification,e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise},verifySession:function(e){var t=s.defer();return u.post(o.urls.api.member.sessionVerification,e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise}}})}(Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.Cache,Pt.Managers.HttpClient),function(o,i,u,l,c,d,m,f){"use strict";o.Class("Pt.Services.Members.AnnouncementService",new function(){return{getAnnouncements:function(){var e=l.urls.api.member.publicAnnouncements,t={operatorId:u.operator.msId};u.member.isLoggedIn&&(e=o.addRouteParamsToUri({memberCode:u.member.code},l.urls.api.member.announcements),t={});var s=i.defer(),a=btoa(e+m.get("lang")),n=d.get(a);o.isEmpty(n)?f.get(e,t).then(function(e){var t={},n=[],r=[],i={};o.each(e.data.announcements,function(e){(i=o.extendOnly(new c.Announcements,e)).compileMessage(),n.push(i)}),o.each(e.data.categories,function(e){r.push(o.extendOnly(new c.AnnouncementCategories,e))}),t={announcement_list:n,category_list:r},o.isEmpty(t.category_list)||d.set(a,t,{TTL:18e4}),s.resolve(t)}).fail(function(e){s.reject(e)}):s.resolve(n);return s.promise},getCashierAnnouncements:function(){var e=o.addRouteParamsToUri({memberCode:u.member.code},l.urls.api.member.cashierPageAnnouncements),n=i.defer(),r=btoa(e+m.get("lang")),t=d.get(r);o.isEmpty(t)?f.get(e).then(function(e){var t=[];o.each(e.data.announcements,function(e){t.push(o.extendOnly(new c.CashierAnnouncement,e))}),o.isEmpty(t)||d.set(r,t,{TTL:18e4}),n.resolve(t)}).fail(function(e){n.reject(e)}):n.resolve(t);return n.promise}}})}(_,Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.Cache,Pt.Managers.Cookie,Pt.Managers.HttpClient),function(r,i,s,a,o,u){r.Class("Pt.Services.Members.AlipayTransferService",new function(){var n=r.addRouteParamsToUri({memberCode:a.member.code,methodId:1204131},s.urls.api.member.onlineDeposits);return{createTransaction:function(e){var t=i.defer();return u.post(n,e).then(function(e){t.resolve(e.data.transaction.transactionId)}).fail(function(e){t.reject(e)}),t.promise},getTransaction:function(e){var t=r.addRouteParamsToUri({memberCode:a.member.code,methodId:1204131,transactionId:e},s.urls.api.member.transactions),n=i.defer();return u.get(t).then(function(e){n.resolve(r.extendOnly(new o.AlipayTransferTransaction,e.data))}).fail(function(e){n.reject(e)}),n.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Managers.HttpClient),function(i,s,a,o,e,u){i.Class("Pt.Services.Members.OfflineTransferService",new function(){return{createTransaction:function(e,t){var n=s.defer(),r=i.addRouteParamsToUri({memberCode:o.member.code,methodId:":methodId"},a.urls.api.member.offlineTransfer);return u.post(i.str_replace_key({":methodId":t},r),e).then(function(e){n.resolve(e.data.transaction.transactionId)}).fail(function(e){n.reject(e)}),n.promise},getTransaction:function(e,t){var n=i.addRouteParamsToUri({memberCode:o.member.code,methodId:t,transactionId:e},a.urls.api.member.transactions),r=s.defer();return u.get(n).then(function(e){r.resolve(e.data)}).fail(function(e){r.reject(e)}),r.promise},createQRTransaction:function(e,t){var n=s.defer(),r=i.addRouteParamsToUri({memberCode:o.member.code,methodId:":methodId"},a.urls.api.member.offlineTransfer);return u.post(i.str_replace_key({":methodId":t},r),e).then(function(e){n.resolve(e.data.transaction)}).fail(function(e){n.reject(e)}),n.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Managers.HttpClient),function(s,a,o,u,l){"use strict";s.Class("Pt.Services.Members.BalanceService",new function(){return{getByWalletId:function(e){var t=s.addRouteParamsToUri({memberCode:u.member.code,walletId:e},o.urls.api.member.balance),n=a.defer();return l.get(t,[],"json",{timeout:4e4}).then(function(e){var t=s.extendOnly(new Pt.Contracts.Balance,e.data.balance);return n.resolve({balance:t})}).fail(function(e){n.reject(e)}),n.promise},getByWalletPromise:function(r){var t=[],n="",i=a.defer();return s.each(r,function(e){n=s.addRouteParamsToUri({memberCode:u.member.code,walletId:e.id},o.urls.api.member.balance),t.push(l.get(n,[],"json",{timeout:4e4}))}),a.all(t).then(function(n){s.each(r,function(t){var e=s.find(n,function(e){return e.data.balance.wallet_id===t.id});s.isEmpty(e)||(t.balance=e.data.balance.amount),i.resolve(r)}),i.resolve(r)}).fail(function(e){i.reject(e)}),i.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient),function(a,o,u,e,l,c){"use strict";a.Class("Pt.Services.Members.BankingAddressService",new function(){var s={};return{getProvinces:function(){var n=o.defer(),e=u.urls.api.member.bankingProvinces,r=this,i=window.btoa(e);return a.isUndefined(s[i])?c.get(e).then(function(e){var t=[];a.size(e.data)&&(t=a.map(e.data,function(e){var t=new l.BankingProvince;return t.set("id",a.propertyValue(e,"provinceId")),t.set("name",a.propertyValue(e,"provinceName")),t.set("nativeName",a.propertyValue(e,"provinceNameNative")),t.getCities=function(){return r.getCities(this.id)},t})),s[i]=t,n.resolve(t)}).fail(function(e){n.reject(e)}):n.resolve(s[i]),n.promise},getCities:function(e){var n=o.defer(),r=this,t=a.addRouteParamsToUri({provinceId:e},u.urls.api.member.bankingCities),i=window.btoa(t);return a.isUndefined(s[i])?c.get(t).then(function(e){var t=[];a.size(e.data)&&(t=a.map(e.data,function(e){var t=new l.BankingCity;return t.set("id",a.propertyValue(e,"cityId")),t.set("name",a.propertyValue(e,"cityName")),t.set("nativeName",a.propertyValue(e,"cityNameNative")),t.set("provinceId",a.propertyValue(e,"provinceId")),t.getDistricts=function(){return r.getDistricts(this.id)},t}),s[i]=t,n.resolve(t))}).fail(function(e){n.reject(e)}):n.resolve(s[i]),n.promise},getDistricts:function(e){var n=o.defer(),t=a.addRouteParamsToUri({cityId:e},u.urls.api.member.bankingDistricts),r=window.btoa(t);return a.isUndefined(s[r])?c.get(t).then(function(e){var t=[];a.size(e.data)&&(t=a.map(e.data,function(e){var t=new l.BankingDistrict;return t.set("id",a.propertyValue(e,"districtId")),t.set("name",a.propertyValue(e,"districtName")),t.set("cityId",a.propertyValue(e,"cityId")),t.set("nativeName",a.propertyValue(e,"districtNameNative")),t})),s[r]=t,n.resolve(t)}).fail(function(e){n.reject(e)}):n.resolve(s[r]),n.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Managers.HttpClient),function(c,a,o,n,d,r,e,t,u){"use strict";c.Class("Pt.Services.Members.BankService",new function(){var e=o.urls.cms.bankingOptions;return{getBanks:t,getSystemBankAccounts:function(){var e=s(o.urls.api.member.systemBankAccounts),n=a.defer();return u.get(e).then(function(e){var t=[];0<e.data.systemBankAccounts.length&&c.each(e.data.systemBankAccounts,function(e){t.push(c.extendOnly(new d.SystemBankAccount,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getBankingOptions:function(){var t=a.defer();return u.get(e,null,null,{store:!0}).then(function(e){var n=[];c.each(e.data,function(e,t){n.push(c.extendOnly(new d.BankingOption,{code:t,name:e}))}),t.resolve(n)}).fail(function(e){t.reject(e)}),t.promise},getBankDetail:function(){var e=s(o.urls.api.member.bankingDetail),r=a.defer();return t().then(function(n){u.get(e).then(function(e){var t=null;c.isEmpty(e.data)?t=new d.BankDetail:(t=c.extendOnly(new d.BankDetail,e.data.bankDetails),c.findWhere(n,{bankCode:t.get("bankCode")})&&t.bankSupported()),r.resolve(t)}).fail(function(e){r.reject(e)})}),r.promise},updateBankDetail:function(e){var t=s(o.urls.api.member.bankingDetail),n=a.defer();return u.put(t,e).then(function(e){n.resolve(c.extendOnly(new d.Generic,e))}).fail(function(e){n.reject(e)}),n.promise},getBankingList:function(e){var n=a.defer(),t=o.urls.api.member.bankingDetails;return u.get(t).then(function(e){var t=i(e);n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getBankAccount:function(e){var t=a.defer(),n=c.addRouteParamsToUri({accountId:e},o.urls.api.member.bankingDetailsAccount);return u.get(n).then(function(e){e.data=l(e.data,"regular"),t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise},addBankAccount:function(e){var t=a.defer(),n=o.urls.api.member.bankingDetails;return u.post(n,e).then(function(e){t.resolve(i(e))}).fail(function(e){t.reject(e)}),t.promise},editBankAccount:function(e){var t=a.defer(),n="";c.each(e,function(e){"bankAccountId"===e.name&&(n=e.value)});var r=c.addRouteParamsToUri({accountId:n},o.urls.api.member.bankingDetailsAccount);return u.put(r,e).then(function(e){t.resolve(i(e))}).fail(function(e){t.reject(e)}),t.promise},deleteBankAccount:function(e){var t=a.defer(),n=c.addRouteParamsToUri({accountId:e},o.urls.api.member.bankingDetailsAccount);return u.del(n).then(function(e){t.resolve(i(e))}).fail(function(e){t.reject(e)}),t.promise},banksToModel:i};function i(e){var o={},t=r.funds.bankingDetails,u=e.data||e;return r.funds.currency_bankingDetails[n.member.currency]&&t.push(r.funds.currency_bankingDetails[n.member.currency]),c.each(t,function(t){if(c.has(u,t)){var e=u[t],n=new d.BankingList,r=c.propertyValue(e,"consumed",0),i=c.propertyValue(e,"limit",0),s=c.propertyValue(e,"accounts",[]);if(n.set("consumed",r),n.set("limit",i),n.set("allowed",i-r),n.set("active",c.size(s)),n.set("type",t),c.size(s)){var a=c.map(s,function(e){return l(e,t)});n.set("accounts",a)}o[t]=n}}),o}function t(){var e=s(o.urls.api.member.banks),n=a.defer();return u.get(e).then(function(e){var t=[];0<e.data.bankAccounts.length&&c.each(e.data.bankAccounts,function(e){t.push(c.extendOnly(new d.Bank,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise}function s(e){return c.addRouteParamsToUri({memberCode:n.member.code},e)}function l(e,t){var n=new(d[c.ucfirst(t)+"Bank"]);return n.set("bankAccountId",c.propertyValue(e,"bankAccountId")),n.set("bankAccountName",c.propertyValue(e,"bankAccountName").trim()),n.set("bankAccountNumber",c.propertyValue(e,"bankAccountNumber")),n.set("bankAddress",c.propertyValue(e,"bankAddress")),n.set("bankAddressId",c.propertyValue(e,"bankAddressId")),n.set("bankBranch",c.propertyValue(e,"bankBranch")),n.set("bankCode",c.propertyValue(e,"bankCode")),n.set("bankName",c.propertyValue(e,"bankName")),n.set("bankNameNative",c.propertyValue(e,"bankNameNative")),n.set("isPreferred",c.propertyValue(e,"isPreferred")),n.set("state",c.propertyValue(e,"state")),n}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Config,Pt.Managers.Cache,Pt.Managers.Cookie,Pt.Managers.HttpClient),function(a,o,u,l,c,d){"use strict";a.Class("Pt.Services.Members.BonusCodeService",new function(){var n=a.addRouteParamsToUri({memberCode:l.member.code},u.urls.api.member.bonusCodes);return{getAll:function(){var t=o.defer(),e=[c.get(u.urls.cms.walletConfig,null,null,{store:!0}),c.get(n)];return o.all(e).then(function(e){var n=[],r=e[0].data.product_wallets;a.each(e[1].data,function(e){var t=a.extendOnly(new d.BonusCode,e);t.get("productCode")in r&&t.set("walletId",+r[t.get("productCode")]),n.push(t)}),t.resolve(n)}).fail(function(e){t.reject(e)}),t.promise},getBonusCodeStatus:function(e,t,n){var r=o.defer(),i=a.addRouteParamsToUri({memberCode:l.member.code,promoCode:t},u.urls.api.member.promoCodeStatus),s={walletId:e,transferAmount:n};return c.get(i,s).then(function(e){var t=e.data,n=new d.PromoCodeStatus;n.set("code",t.statusCode).set("message",t.statusText).set("rolloverAmount",t.rolloverAmount),r.resolve(n)}).fail(function(e){r.reject(e)}),r.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient,Pt.Contracts),function(e,l,r,i,s,c,o){"use strict";l.Class("Pt.Services.Members.DepositService",function(){var e=l.addRouteParamsToUri({memberCode:i.member.code},s.urls.api.member.depositMethods),u=["select","radio","checkbox"],n={};return{getMethods:function(){var t=r.defer(),i=[];n.methods?t.resolve(n.methods):o.get(e).then(function(e){l.each(e.data,function(e){var n=l.extendOnly(new c.DepositMethod,e);if(function(e){var t={yeepay_card:function(e){var r=[];return l.each(e.cards,function(e,t){var n=new c.CardType;n.set("code",t.toUpperCase()).set("denominations",e),r.push(n)}),r},offline:function(e){var s={amountSelection:e.amount_selections?e.amount_selections:e.amount_selection,fieldSettings:[],channels:[]},t=e.available_channels;return t&&t.length&&(l.each(t,function(e){s.channels.push(l.extendOnly(new c.BankingOption,{code:e,name:l.trans("funds.offline_channel_"+e)}))}),delete e.available_channels),l.each(e,function(e,t){var n="true"===e[t+"_visibility"],r=null;r=n||"deposit_time"!==t?n||"deposit_date"!==t?e[t+"_default_value"]||null:moment().format("YYYY-MM-DD"):moment().format("hh:mm:ss");var i=l.extendOnly(new c.OfflineDepositField,{name:l.toCamelCase(t),shouldDisplay:n,defaultValue:r});s.fieldSettings.push(i)}),l.has(e,"processing_fee")&&(s.processing_fee=e.processing_fee),s},basic:a,bank_transfer:a},n=t[e.get("methodCode")];l.has(e.customFields,"web_recommended")&&(e.isRecommended=l.booleanString(e.customFields.web_recommended));l.has(e.customFields,"logo")&&(e.logo=e.customFields.logo);if(l.isFunction(n)){var r=n(e.get("customFields"));e.set("customFields",r)}var i=t[e.get("processType")];if(l.isFunction(i)){var s=i(e.get("customFields"));e.set("formFields",s)}}(n),n.isExcluded())return!1;if(n.isBankTransfer()){var r=[];l.each(e.banks,function(e){var t="banks."+n.get("methodCode")+"_"+e;r.push((new c.Bank).set("bankName",l.trans(t)).set("bankCode",e))}),n.set("supportedBanks",r)}i.push(n)}),n.methods=i,t.resolve(n.methods)}).fail(function(e){t.reject(e)});return t.promise},createOfflineTransaction:function(e){var n=r.defer(),t=l.addRouteParamsToUri({memberCode:i.member.code},s.urls.api.member.offlineDeposit);return o.post(t,e,"json",{contentType:!1,processData:!1}).then(function(e){if(+e.invId<=0){var t=l.trans("errors.offline_deposit_error_"+e.invId);n.reject([t])}else n.resolve({transactionId:e.invId})}).fail(function(e){n.reject(e)}),n.promise},getPreferredBank:function(){var e=l.addRouteParamsToUri({memberCode:i.member.code,type:"deposit"},s.urls.api.member.preferredBank),n=r.defer();return o.get(e).then(function(e){try{var t=l.extendOnly(new c.DepositPreferredBank,e.data.tblDepositWireTransfer)}catch(e){t=new c.PreferredBank}n.resolve(t)}).fail(function(e){n.resolve(e)}),n.promise}};function a(e){var t=[];if(l.has(e,"form_fields"))try{e.form_fields=l.isArray(e.form_fields)?e.form_fields:[e.form_fields],t=l.filter(e.form_fields,function(e){return e.field_name}),t=l.map(t,function(e){var t=new c.FormFields,n=l.propertyValue(e,"field_name",null),r="private"===l.propertyValue(e,"encryption_type","private").toLowerCase(),i=(r?"csf_":"csfb_")+n,s=null;t.set("fieldName",i),t.set("encryptionType",l.propertyValue(e,"encryption_type","private")),l.isEmpty(l.propertyValue(e,"validation_rules",""))||(s=l.propertyValue(e,"validation_rules","").split("|")),t.set("validationRules",s);var a=l.propertyValue(e,"input_type",null);if(t.set("inputType",a),-1<l.indexOf(u,a)){var o=l.map(l.propertyValue(e,"selections",[]),function(e){return{value:e,label:l.trans("funds.csf_"+n.toLowerCase()+"_"+e.toLowerCase())}});t.set("selections",o)}return t})}catch(e){}return t}}())}(jQuery,_,Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient),function(s,a,r,e,t,o,u,l){"use strict";s.Class("Pt.Services.Members.FavoriteSlotGameService",new function(){var i=s.addRouteParamsToUri({memberCode:t.member.code},e.urls.api.member.favoriteSlotGames);return{getAll:function(e){return void 0!==e?(t=a.defer(),n().then(function(n){if(s.isEmpty(n))return t.resolve([]),this;var e=s.map(n,function(e){return e.gameId});l.Cms.GameService.getGamesByIds("slot_machines",e).then(function(e){s.each(e.items,function(e){var t=s.findWhere(n,{gameId:e.gameId});t&&(e.club=t.productCode),e.isFavorite=!0}),t.resolve(e.items)}).fail(function(e){t.resolve(e)})}).fail(function(e){t.reject(e)}),t.promise):n();var t},getByProductCode:function(e){return n(e)},addToFavorites:function(e,t){var n=a.defer(),r={gameId:e,productCode:t};return o.post(i,r).then(function(e){n.resolve(s.extendOnly(new u.SlotGame,e.data))}).fail(function(e){n.reject(e)}),n.promise},removeFromFavorites:function(e,t){var n=a.defer(),r={gameId:e,productCode:t,_method:"DELETE"};return o.post(i,r).then(function(){n.resolve(!0)}).fail(function(e){n.reject(e)}),n.promise}};function n(){var n=a.defer(),e=i,t=r.get("refreshCache");return arguments[0]&&(e+="/"+arguments[0]),e+="1"===t?"?refresh=true":"",o.get(e).then(function(e){var t=[];s.each(e.data,function(e){t.push(s.extendOnly(new u.SlotGame,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise}})}(_,Q,Pt.Managers.Cookie,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient,Pt.Contracts,Pt.Services),function(e,r,t,i,s){"use strict";e.Class("Pt.Services.Members.FreeBetClaimService",new function(){var n=e.addRouteParamsToUri({memberCode:i.member.code},t.urls.api.member.freeBetClaims);return{claim:function(e){var t=r.defer();return s.post(n,e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient),function(i,s,a,e,o,r){"use strict";i.Class("Pt.Services.Members.FundTransferService",new function(){var n=i.addRouteParamsToUri({memberCode:e.member.code},a.urls.api.member.fundTransfers);return{transfer:function(e){var t=s.defer();return o.post(n,e).then(function(e){t.resolve(i.extendOnly(new r.FundTransfer,e))}).fail(function(e){t.reject(e)}),t.promise},currencyConversion:function(e,t){var n="rmb"===t.toLowerCase()?i.addRouteParamsToUri({currencyFrom:e},a.urls.api.member.currencyConversionToRmb):i.addRouteParamsToUri({currencyFrom:e,currencyTo:t},a.urls.api.member.currencyConversion),r=s.defer();return o.get(n).then(function(e){r.resolve(e)}).fail(function(e){r.reject(e)}),r.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient,Pt.Contracts),function(o,u,l,c,d,m,r){"use strict";o.Class("Pt.Services.Members.HistoryService",new function(){var a={};return{getDepositWithdrawal:function(e){var t=o.addRouteParamsToUri({memberCode:c.member.code},l.urls.api.member.depositWithdrawalHistory),n=u.defer(),r={datetimeFrom:e.from,datetimeTo:e.to,paymentType:e.paymentType,paymentStatus:e.paymentStatus};return m.get(t,r).then(function(e){var t=[];o.each(e.data.histories,function(e){t.push(o.extendOnly(new d.DepositWithdrawalHistory,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getAdjustments:function(e){var n=u.defer(),t=o.addRouteParamsToUri({memberCode:c.member.code},l.urls.api.member.adjustmentsHistory),r={datetimeFrom:e.from,datetimeTo:e.to,paymentType:e.paymentType,paymentStatus:e.paymentStatus};return m.get(t,r).then(function(e){var t=[];o.each(e.data.histories,function(e){t.push(o.extendOnly(new d.AdjustmentsHistory,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getFundTransfer:function(e){var n=u.defer(),t=o.addRouteParamsToUri({memberCode:c.member.code},l.urls.api.member.fundTransferHistory),r={datetimeFrom:e.from,datetimeTo:e.to,transferType:e.transferType,transferStatus:e.transferStatus};return m.get(t,r).then(function(e){var t=[];o.each(e.data.histories,function(e){t.push(o.extendOnly(new d.FundTransferHistory,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getReferralBonus:function(e){var t=u.defer(),n=o.addRouteParamsToUri({memberCode:c.member.code},l.urls.api.member.referralBonusHistory),r={dateFrom:e.from,dateTo:e.to},i=btoa($.param(r)),s=a[i];o.isEmpty(s)?m.get(n,r).then(function(n){var r=[];if(0<n.data.histories.length)o.each(n.data.histories,function(e){var t=o.extendOnly(new d.ReferralBonusHistory,e);t=o.extend(t,n.data.report),r.push(t)});else{var e=new d.ReferralBonusHistory;e=o.extend(e,n.data.report),r.push(e)}r&&(a[i]=r),t.resolve(r)}).fail(function(e){t.reject(e)}):t.resolve(s);return t.promise},getPromotions:function(e){var n=u.defer(),t=o.addRouteParamsToUri({memberCode:c.member.code},l.urls.api.member.promotionsClaimsHistory),r={datetimeFrom:e.from,datetimeTo:e.to,transferType:e.transferType,transferStatus:e.transferStatus};return m.get(t,r).then(function(e){var t=[];o.each(e.data.histories,function(e){t.push(o.extendOnly(new d.PromotionHistory,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getPromotionsPage:function(e){var n=u.defer(),t=o.addRouteParamsToUri({memberCode:c.member.code},l.urls.api.member.promotionsPageClaimsHistory),r={datetimeFrom:e.from,datetimeTo:e.to};return m.get(t,r).then(function(e){var t=[];o.each(e.data.histories,function(e){t.push(o.extendOnly(new d.PromotionClaimsHistory,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getSpinwheelRedemptions:function(e){var n=u.defer(),t=r.replaceV3Tags(o.str_replace_key({":memberCode":c.member.code,":dateFrom":e.from,":dateTo":e.to},l.urls.api.member.spinwheelRedemptionsHistory));return m.get(t,{spinwheel:1}).then(function(e){var t=[];o.each(e.data,function(e){t.push(o.extendOnly(new d.SpinwheelRedemption,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Managers.HttpClient,Pt.Services.AbstractV3Service),function(a,o,u,l,c,d,e,m){"use strict";a.Class("Pt.Services.Members.MemberService",new function(){var s={};return{getMember:function(e){var t=a.addRouteParamsToUri({memberCode:u.member.code},l.urls.api.member.member),n=window.btoa(t),r=o.defer();if(a.isUndefined(s[n])||e)d.get(t).then(function(e){s[n]=e;var t=a.extendOnly(new c.Member,e);r.resolve(t)}).fail(function(e){r.reject(e)});else{var i=s[n];r.resolve(a.extendOnly(new c.Member,i))}return r.promise},create:function(e){var t=a.findIndex(e,{name:"memberSocialChatAcctId"}),n=l.urls.api.member.signup,r=a.getParameterByName("testAccount")?1:0;try{-1<t&&e[t].value&&(n=m.replaceV3Tags(l.urls.api.member.signupV3),r=!!a.getParameterByName("testAccount"))}catch(e){}var i=o.defer();return e.push({name:"testAccount",value:r}),d.post(n,e).then(function(e){i.resolve(a.extendOnly(new c.SignUp,e)),i.resolve(e)}).fail(function(e){i.reject(e)}),i.promise},quick:function(e){var t=l.urls.api.member.quickRegistration,n=o.defer();a.getParameterByName("testAccount")&&e.push({name:"testAccount",value:1});return d.post(t,e).then(function(e){n.resolve(e.data)}).fail(function(e){n.reject(e)}),n.promise},quickFinal:function(e){var t=l.urls.api.member.quickRegistrationFinalStep,n=o.defer();return d.post(t,e).then(function(e){n.resolve(e.data)}).fail(function(e){n.reject(e)}),n.promise},update:function(e){var t=a.addRouteParamsToUri({memberCode:u.member.code},l.urls.api.member.member),n=o.defer();return d.put(t,e).then(function(e){n.resolve(a.extendOnly(new c.MemberProfile,e))}).fail(function(e){n.reject(e)}),n.promise},updatePassword:function(e){var t=a.addRouteParamsToUri({memberCode:u.member.code},l.urls.api.member.updatePassword),n=o.defer();return d.put(t,e).then(function(e){n.resolve(a.extendOnly(new c.Generic,e))}).fail(function(e){n.reject(e)}),n.promise},updateDeliveryAddress:function(e){var t=a.addRouteParamsToUri({memberCode:u.member.code},l.urls.api.member.deliveryAddress),n=o.defer();return d.put(t,e).then(function(e){n.resolve(a.extendOnly(new c.MemberProfile,e.data.member))}).fail(function(e){n.reject(e)}),n.promise},referrals:function(e){var t=a.addRouteParamsToUri({memberCode:u.member.code},l.urls.api.member.referrals),n=o.defer();return d.post(t,e).then(function(e){n.resolve(a.extendOnly(new c.Generic,e))}).fail(function(e){n.reject(e)}),n.promise},rewards:function(){var t=o.defer(),e=m.replaceV3Tags(a.str_replace_key({":memberCode":u.member.code},l.urls.api.member.rewards));return d.get(e).then(function(e){t.resolve(a.extendOnly(new c.Rewards,e.data))}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient,Pt.Managers.Cache,Pt.Services.AbstractV3Service),function(r,e,i,s,a){"use strict";_.Class("Pt.Services.Members.PaymentSettingService",new function(){return{transactionLimits:function(e){var t=i.urls.api.member.paymentTransactionLimits,n=r.defer();return a.get(t,e).then(function(e){var t=new s.TransactionLimit;t.set("transType",e.data.transType),t.set("frequency",e.data.frequency),t.set("limitAmount",e.data.limitAmount),t.set("validFrom",e.data.validFrom),t.set("validTo",e.data.validTo),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},setTransactionLimits:function(e){var t=i.urls.api.member.paymentTransactionLimits,n=r.defer();return a.put(t,e).then(function(e){n.resolve(_.extendOnly(new s.Generic,e))}).fail(function(e){n.reject(e)}),n.promise}}})}(Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient),function(u,l,c,d,m,f,p){"use strict";function e(e){var t=u.str_replace_key({":memberCode":c.member.code},d.urls.api.member.privateMessagesBulkDelete),n=l.defer();return p.post(t,e).then(function(e){n.resolve(e)}).fail(function(e){n.reject(e)}),n.promise}u.Class("Pt.Services.Members.PrivateMessageService",new function(){var o=c.member.code+"-private-messages",i=c.member.code+"-unread-message";return{getUnread:function(e){var r=l.defer(),t=m.get(i);e=e||!1,u.isEmpty(t)||e?n().then(function(e){var t=u.where(e,{status:0}),n={unread:t.length};m.set(i,n,{TTL:18e4}),r.resolve(n)}):r.resolve(t);return r.promise},getSubjects:function(){var e=u.addRouteParamsToUri({memberCode:c.member.code},d.urls.api.member.privateMessageSubjects),n=l.defer();return p.get(e).then(function(e){var t=[];u.each(e.data.message_subjects,function(e){t.push(u.extendOnly(new f.PrivateMessageSubject,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getPrivateMessages:n,getMessage:function(s){var e=u.addRouteParamsToUri({memberCode:c.member.code,messageId:s},d.urls.api.member.privateMessage),a=l.defer();return p.get(e).then(function(e){if(!e.data.private_messages.length)return a.resolve(new f.PrivateMessage),this;var t=e.data.private_messages[0],n=[],r=u.extendOnly(new f.PrivateMessage,t);if(u.each(r.replies,function(e){n.push(u.extendOnly(new f.PrivateMessage,e))}),r.replies=n,m.get(o)){var i=m.get(o);i=u.map(i,function(e){return e.messageId===s&&"1"!==e.status&&(e.status="1"),e}),m.set(o,i,{TTL:18e4})}a.resolve(r)}).fail(function(e){a.reject(e)}),a.promise},sendMessage:function(e,t){var n=u.addRouteParamsToUri({memberCode:c.member.code,messageId:e},d.urls.api.member.privateMessage),r=o,i=l.defer();return p.post(n,t).then(function(e){m.remove(r),i.resolve(u.extendOnly(new f.Generic,e))}).fail(function(e){i.reject(e)}),i.promise},deleteMessage:function(e){var t=u.addRouteParamsToUri({memberCode:c.member.code,messageId:e},d.urls.api.member.privateMessage),n=l.defer();return p.del(t).then(function(e){m.remove(o),n.resolve(u.extendOnly(new f.Generic,e))}).fail(function(e){n.reject(e)}),n.promise},markAsImportant:function(e,t){var n=u.addRouteParamsToUri({memberCode:c.member.code,messageId:e},d.urls.api.member.privateImportant),r=l.defer();return p.put(n,{flagImportant:t}).then(function(e){m.remove(o),r.resolve(u.extendOnly(new f.Generic,e))}).fail(function(e){r.reject(e)}),r.promise},bulkDelete:e};function n(e){var t=u.addRouteParamsToUri({memberCode:c.member.code},d.urls.api.member.privateMessages),n=l.defer(),r=o,i=m.get(r);if(e=e||!1,u.isEmpty(i)||e)p.get(t,{limit:1e3,page:1}).then(function(e){var t=[];u.each(e.data.private_messages,function(e){t.push(u.extendOnly(new f.PrivateMessage,e))}),m.set(r,t,{TTL:18e4}),n.resolve(t)}).fail(function(e){n.reject(e)});else{var s=i.map(function(e){return u.extendOnly(new f.PrivateMessage,e)});n.resolve(s)}return n.promise}})}(_,Q,Pt.Settings,Pt.Endpoints,Pt.Managers.Cache,Pt.Contracts,Pt.Managers.HttpClient),function(e,s,t,n,a){"use strict";e.Class("Pt.Services.Members.PromotionClaimService",new function(){var i=e.addRouteParamsToUri({memberCode:n.member.code},t.urls.api.member.promotionClaims);return{claim:function(e,t){var n=s.defer(),r={subjectCode:e,comment:t};return a.post(i,r).then(function(e){n.resolve(e.message)}).fail(function(e){n.reject(e)}),n.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient),function(m,f,p,h,g,e,v){"use strict";m.Class("Pt.Services.Members.RebateService",new function(){var n=m.addRouteParamsToUri({memberCode:h.member.code},p.urls.api.member.rebateClaims),r=m.addRouteParamsToUri({memberCode:h.member.code},p.urls.api.member.rebateSummaryPerProduct),t=m.addRouteParamsToUri({memberCode:h.member.code},p.urls.api.member.promotionClaims),i={subjectCode:null,comment:"rebate"};return{getMondaySelection:function(e){for(var t=[],n=0,r=null,i=void 0,s=e||moment(new Date).format("YYYY-MM-DD");n<5;n++){if(-1<(r=i?i.day(-2).startOf("isoWeek").isoWeekday(1):moment().startOf("isoWeek").isoWeekday(1)).diff(new Date(s),"days")){var a=moment(r.format("YYYY-MM-DD"));a=m.extend(a,{getLabel:function(){var e=this.format("gggg")+" "+m.trans("rebates.label_year")+" "+this.isoWeek()+" "+m.trans("rebates.label_week");return moment(new Date).isoWeek()===this.isoWeek()&&(e+=" "+m.trans("rebates.label_current_week")),e},canClaim:function(){var e=+moment(new Date).isoWeek();return e===+this.isoWeek()||e-1===this.isoWeek()},isCurrentWeek:function(){return+moment(new Date).isoWeek()==+this.isoWeek()}}),t.push(a)}i=r}return t},getRebateSettings:function(){var t=f.defer();return e.Cms.WidgetService.get("rebate_settings").then(function(e){t.resolve(new g.RebateSettings(e))}),t.promise},getRebateSummaries:function(e,t){var n=f.defer();e.canClaim()?(o=n,l=[],c=[],d=(a=t).currentPeriod._i,m.each(a.products,function(e){m.each(e,function(e){u=m.addRouteParamsToUri({memberCode:h.member.code,product:e.get("claimCode"),date:d,period:1},p.urls.api.member.newRebateSummaryPerProduct),l.push(v.get(u))})}),f.allSettled(l).then(function(e){m.each(e,function(e){if("rejected"===e.state&&!m.isEmpty(m.findWhere(e.reason,{code:404})))return!1;c.push(e.value.data)}),m.each(a.products,function(e,n){var r=[];m.each(e,function(e){var t=m.findWhere(c,{productCode:e.productCode});t&&("sportsbook"===n&&(t=m.extendOnly(e,t)),r.push(m.extendOnly(new g.RebateProduct,t)))}),m.isEmpty(r)?delete a.products[n]:a.products[n]=r}),o.resolve(a.products)})):(r=e,i=n,s=m.addRouteParamsToUri({memberCode:h.member.code,date:r._i,period:1},p.urls.api.member.newRebateStatements),v.get(s).then(function(e){m.each(e.data,function(n){m.each(n,function(e,t){n[t]=m.extendOnly(new g.RebateProduct,e)})}),i.resolve(e.data)}));var r,i,s;var a,o,u,l,c,d;return n.promise},getRebatePerProduct:function(e){var t=f.defer();return v.get(r+e).then(function(e){t.resolve(m.extendOnly(new g.RebateProduct,e.data))}).fail(function(){}),t.promise},getRebatePromoCodeStatus:function(e){var n=f.defer();if(m.isArray(e))return f.allSettled(m.map(e,function(e){return s(e)})).then(function(e){var t=m.map(e,function(e,t){if("fulfilled"===e.state)return e.value;var n=new g.PromoCode;return n.set("claimable",!1),n.set("rebateCode",n[t]),n});n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise;return s(e).then(function(e){n.resolve(e)}).fail(function(e){n.reject(e)}),n.promise},instantClaim:function(e){var t=f.defer();return v.post(n,e).then(function(){t.resolve(!0)}).fail(function(e){t.reject(e)}),t.promise},weeklyClaim:function(r){var n=f.defer();m.isString(r)&&(r=[r]);return f.allSettled(m.map(r,function(e){return v.post(t,m.extend(i,{subjectCode:e}))})).then(function(e){var t=m.map(e,function(e,t){var n=new g.PromoClaim;return n.set("claimed","fulfilled"===e.state),n.set("promoCode",r[t]),n});n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getDailyRebateSummaries:function(e,t){var n=f.defer();moment(e)>=moment().subtract(2,"days")?(a=e,o=t,u=n,c=[],d=[],m.each(o.daily_rebate_products,function(e){m.each(e,function(e){l=m.addRouteParamsToUri({memberCode:h.member.code,product:e.get("claimCode"),date:a,period:2},p.urls.api.member.newRebateStatementPerProduct),c.push(v.get(l))})}),f.allSettled(c).then(function(e){m.each(e,function(e){if("rejected"===e.state&&!m.isEmpty(m.findWhere(e.reason,{code:404})))return!1;d.push(e.value.data)}),m.each(o.daily_rebate_products,function(e,n){var r=[];m.each(e,function(e){var t=m.findWhere(d,{productCode:e.productCode});t&&("sportsbook"===n&&(t=m.extendOnly(e,t)),r.push(m.extendOnly(new g.RebateProduct,t)))}),m.isEmpty(r)?delete o.daily_rebate_products[n]:o.daily_rebate_products[n]=r}),u.resolve(o.daily_rebate_products)})):(r=e,i=n,s=m.addRouteParamsToUri({memberCode:h.member.code,date:r,period:2},p.urls.api.member.newRebateStatements),v.get(s).then(function(e){m.each(e.data,function(n){m.each(n,function(e,t){n[t]=m.extendOnly(new g.RebateProduct,e)})}),i.resolve(e.data)}));var r,i,s;var a,o,u,l,c,d;return n.promise}};function s(e){var n=f.defer(),t=m.addRouteParamsToUri({memberCode:h.member.code,promoCode:e},p.urls.api.member.rebatePromoCodeStatus);return v.get(t).then(function(e){if(m.has(e,"data")){var t=new g.PromoCode;t.set("claimable",e.data.claimable),t.set("rebateCode",e.data.rebateCode),n.resolve(t)}}).fail(function(e){n.reject(e)}),n.promise}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Services,Pt.Managers.HttpClient),function(r,i,s,a,e,o){r.Class("Pt.Services.Members.SDAPayService",new function(){var n=r.addRouteParamsToUri({memberCode:a.member.code,methodId:120254},s.urls.api.member.onlineDeposits);return{createTransaction:function(e){var t=i.defer();return o.post(n,{transferAmount:e}).then(function(e){t.resolve(e.data.transaction.transactionId)}).fail(function(e){t.reject(e)}),t.promise},getTransaction:function(e){var t=r.addRouteParamsToUri({memberCode:a.member.code,methodId:120254,transactionId:e},s.urls.api.member.transactions),n=i.defer();return o.get(t).then(function(e){n.resolve(e.data)}).fail(function(e){n.reject(e)}),n.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Managers.HttpClient),function(a,o,e,t,u,l,c,d){"use strict";a.Class("Pt.Services.Members.SlotGameHistoryService",new function(){var i=a.addRouteParamsToUri({memberCode:t.member.code},e.urls.api.member.slotGameHistory),s="refreshHistoryCache",r=function(){return 1==d.get(s)};return{getAll:function(e){return void 0!==e?(t=o.defer(),n().then(function(n){if(a.isEmpty(n))return t.resolve([]),this;var e=a.map(n,function(e){return e.gameId});c.Cms.GameService.getGamesByIds("slot_machines",e).then(function(e){a.each(e.items,function(e){var t=a.findWhere(n,{gameId:e.gameId});t&&(e.club=t.productCode)}),t.resolve(e.items)}).fail(function(e){t.resolve(e)})}).fail(function(e){t.reject(e)}),t.promise):n();var t},getByProductCode:function(e){return n(e)},addToHistory:function(e,t){var n=o.defer(),r={gameId:e,productCode:t};return u.post(i,r).then(function(e){d.set({name:s,value:1}),n.resolve(a.extendOnly(new l.SlotGame,e.data))}).fail(function(e){n.reject(e)}),n.promise}};function n(){var n=o.defer(),e=i,t={dateFrom:moment(new Date/1e3).format("YYYY-MM-DD"),dateTo:moment().format("YYYY-MM-DD")};return arguments[0]&&(e+="/"+arguments[0]),r()&&(t.refresh=!0),u.get(e,t).then(function(e){var t=[];a.each(e.data,function(e){t.push(a.extendOnly(new l.SlotGame,e))}),r()&&d.remove({name:s}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient,Pt.Contracts,Pt.Services,Pt.Managers.Cookie),function(a,n,r,o,u,l,c){"use strict";a.Class("Pt.Services.Members.WalletService",new function(){var t=a.addRouteParamsToUri({memberCode:o.member.code},r.urls.api.member.wallets),s=[];return{getAll:e,getWalletsWithBalance:function(){var i=n.defer();return e().then(function(r){var e=a.map(r,function(e){return c.getByWalletId(e.get("id"))});n.allSettled(e).then(function(e){e=a.map(e,function(e){return e.value});var n=a.flatten(a.map(e,a.values)),t=a.map(r,function(e){var t=a.findWhere(n,{wallet_id:e.id});return t&&e.set("balance",t.amount).set("currency",t.currency),e});i.resolve(t)})}).fail(function(e){i.reject(e)}),i.promise}};function e(){var i=n.defer();if(s.length)i.resolve(s);else{var e=[u.get(t),u.get(r.urls.cms.walletConfig,null,null,{store:!0})];n.all(e).then(function(e){var t=e[0].data.wallets,n=a.map(e[1].data.wallets,Number),r=[];a.each(t,function(e){!a.contains(n,e.id)||20===e.id&&"RMB"!==o.member.currency||(e.name=a.trans("wallets.id_"+e.id),r.push(a.extendOnly(new l.Wallet,e)))}),s=r,i.resolve(r)}).fail(function(e){i.reject(e)})}return i.promise}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient,Pt.Contracts,Pt.Services.Members.BalanceService),function(e,r,i,s,a,o,u){"use strict";r.Class("Pt.Services.Members.WithdrawalService",new function(){return{getMethods:function(){var e=r.addRouteParamsToUri({memberCode:s.member.code},a.urls.api.member.withdrawalMethods),n=i.defer();return u.get(e).then(function(e){var t=[];r.each(e.data.paymentMethods,function(e){-1<l.indexOf(e.methodId)&&t.push(r.extendOnly(new o.WithdrawalMethod,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getPreferredBank:function(){var e=r.addRouteParamsToUri({memberCode:s.member.code,type:"withdrawal"},a.urls.api.member.preferredBank),n=i.defer();return u.get(e).then(function(e){try{var t=r.extendOnly(new o.WithdrawalPreferredBank,response.data.tblWithdrawalWireTransfer)}catch(e){t=new o.WithdrawalPreferredBank}n.resolve({tblWithdrawalWireTransfer:t})}).fail(function(e){n.resolve(e)}),n.promise},withdraw:function(e){var t=r.addRouteParamsToUri({memberCode:s.member.code},a.urls.api.member.withdrawal),n=i.defer();return u.post(t,e).then(function(e){n.resolve(r.extendOnly(new o.Generic,e))}).fail(function(e){n.reject(e)}),n.promise},getTransactions:function(e){var t=r.addRouteParamsToUri({memberCode:s.member.code,transactionStatus:e},a.urls.api.member.withdrawalTransactions),n=i.defer();return u.get(t).then(function(e){var t=[];r.isArray(e.data)?r.each(e.data,function(e){t.push(r.extendOnly(new o.WithdrawalTransaction,e))}):""!==e.data&&t.push(r.extendOnly(new o.WithdrawalTransaction,e.data)),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},cancelTransaction:function(e){var t=r.addRouteParamsToUri({memberCode:s.member.code,methodId:e.methodId},a.urls.api.member.cancelWithdrawal),n=i.defer();return u.del(t,e).then(function(e){n.resolve(r.extendOnly(new o.Generic,e))}).fail(function(e){n.reject(e)}),n.promise}}});var l=["210602","2208963","2208969"]}(jQuery,_,Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient),function(r,t,i,s){r.Class("Pt.Deposit.DepositLauncherService",new function(){return{launch:function(e){var n=e.launcherUrl;n+="?transferAmount="+e.amount,e.custom&&r.each(e.custom,function(e,t){r.isArray(e)?r.each(e,function(e){n+="&"+t+"[]="+e}):n+="&"+t+"="+e});n+="&acceptLanguage="+s.get("lang"),n+="&errorUrl="+location.origin+t.depositErrorPage+e.methodId,n+="&token="+s.get("pt_token"),n+="&cmsId="+r.propertyValue(i,"operator.cmsId",""),window.open(n,e.title||"Deposit","width="+(e.width||1e3)+", height="+(e.height||800))}}})}(_,Pt.Config,Pt.Settings,Pt.Managers.Cookie),function(s,a,o,u,l,i){s.Class("Pt.Services.Members.ScratchCardService",new function(){return{getDenominations:function(e){var t=a.defer(),n=s.addRouteParamsToUri({memberCode:u.member.code,methodId:e},o.urls.api.member.scratchCardDenominations),r=new i;return l.get(n).then(function(e){r.set("denominations",e?e.data:[]),t.resolve(r)}).fail(function(e){t.reject(e)}),t.promise},createTransaction:function(e,t){var n=s.addRouteParamsToUri({memberCode:u.member.code,methodId:t},o.urls.api.member.onlineDeposits),r=a.defer();return l.post(n,e).then(function(e){r.resolve(e.data.transaction.transactionId)}).fail(function(e){r.reject(e)}),r.promise},createWithdrawalTransaction:function(e,t){var n=s.addRouteParamsToUri({memberCode:u.member.code,methodId:t},o.urls.api.member.onlineWithdrawals),r=a.defer();return l.post(n,e).then(function(e){r.resolve(s.propertyValue(e,"data.transaction.id","0"))}).fail(function(e){r.reject(e)}),r.promise},validateTransaction:function(e,t){var n=s.addRouteParamsToUri({memberCode:u.member.code,methodId:t},o.urls.api.member.scratchCardValidate),r=a.defer();return l.post(n,e).then(function(e){r.resolve(e.data)}).fail(function(e){r.reject(e)}),r.promise},getQuantity:function(e){var r=a.defer(),t=s.addRouteParamsToUri({memberCode:u.member.code,methodId:e},o.urls.api.member.scratchCardQuantity),i=[1];return l.get(t).then(function(e){var t=s.propertyValue(e,"data",1);i=[];for(var n=1;+n<=+t;)i.push(n),n++;r.resolve(i)}).fail(function(e){r.resolve(i)}),r.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient,Pt.Contracts.ScratchCardDenominations),function(r,i,s,a,o){r.Class("Pt.Services.Members.MPayService",new function(){return{createTransaction:function(e){var t=r.addRouteParamsToUri({memberCode:a.member.code,methodId:1204769},s.urls.api.member.onlineDeposits),n=i.defer();return o.post(t,e).then(function(e){n.resolve(e.data.transaction)}).fail(function(e){n.reject(e)}),n.promise},getTransactionDetails:function(e){var t=r.addRouteParamsToUri({memberCode:a.member.code,methodId:1204769,transactionId:e.transactionId},s.urls.api.member.transactions),n=i.defer();return o.get(t).then(function(e){n.resolve(e.data)}).fail(function(e){n.reject(e)}),n.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient),function(r,i,s,a,o){"use strict";r.Class("Pt.Services.Members.GameAuthenticationService",new function(){return{login:function(e){var t=i.defer(),n=r.addRouteParamsToUri({memberCode:a.member.code},s.urls.api.member.gameExternalAuth);return o.post(n,e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient),function(r,i,s,a,n,e,o,u){"use strict";r.Class("Pt.Services.Members.VerificationService",new function(){return{safetyRating:function(){var t=i.defer(),e=r.addRouteParamsToUri({pubkey:a.public_key,lang:o.get("lang"),msId:a.operator.msId,cmsId:a.operator.cmsId,memberCode:a.member.code},s.urls.api.member.safetyRating);return u.get(e).then(function(e){t.resolve(r.extendOnly(new n.SafetyRating,e.data))}).fail(function(e){t.reject(e)}),t.promise},verifyEmail:function(){var t=i.defer(),e=r.addRouteParamsToUri({pubkey:a.public_key,lang:o.get("lang"),msId:a.operator.msId,cmsId:a.operator.cmsId,memberCode:a.member.code},s.urls.api.member.sendEmailVerification);return u.post(e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise},verifySms:function(){var t=i.defer(),e=r.addRouteParamsToUri({pubkey:a.public_key,lang:o.get("lang"),msId:a.operator.msId,cmsId:a.operator.cmsId,memberCode:a.member.code},s.urls.api.member.sendSmsVerification);return u.post(e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise},sendSmsCode:function(e){var t=i.defer(),n=r.addRouteParamsToUri({pubkey:a.public_key,lang:o.get("lang"),msId:a.operator.msId,cmsId:a.operator.cmsId,memberCode:a.member.code},s.urls.api.member.verifySmsCode);return u.post(n,e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise},sendEmailCode:function(e){var t=i.defer(),n=r.addRouteParamsToUri({pubkey:a.public_key,lang:o.get("lang"),msId:a.operator.msId,cmsId:a.operator.cmsId,memberCode:a.member.code},s.urls.api.member.verifyEmailCode);return u.post(n,e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Config,Pt.Managers.Cookie,Pt.Managers.HttpClient),function(i,s,r,e,a,t,o,u,l){"use strict";i.Class("Pt.Services.Members.CustomPromotionService",new function(){return{checkRedEnvelopeEligibility:function(e){var t=i.str_replace_key({":promotion":e,":msId":Pt.Settings.operator.msId,":cmsId":Pt.Settings.operator.cmsId,":lang":o.get("lang"),":pubkey":Pt.Settings.public_key},u.urls.api.member.checkCustomPromotionEligibility),n=s.defer();return i.booleanString(i.propertyValue(r,"service_toggle.checkCustomPromotionEligibility","true"))?l.get(t).then(function(e){n.resolve(i.extendOnly(new a.CustomPromotion,e))}).fail(function(e){n.reject(e)}):n.resolve(i.extendOnly(new a.CustomPromotion,{})),n.promise},claim:function(e,t){var n=i.str_replace_key({":promotion":e,":msId":Pt.Settings.operator.msId,":cmsId":Pt.Settings.operator.cmsId,":lang":o.get("lang"),":pubkey":Pt.Settings.public_key},u.urls.api.member.customPromotionClaim),r=s.defer();if(i.isEmpty(t.claimCode))return o.set({name:"red-packet-not-eligible",value:Pt.Settings.member.code,expires:t.expiry}),r.resolve(t),r.promise;return l.post(n,t).then(function(e){r.resolve(e)}).fail(function(e){r.reject(e)}),r.promise}}})}(_,Q,Pt.Settings,Pt.Config,Pt.Contracts,Pt.Managers.Cache,Pt.Managers.Cookie,Pt.Endpoints,Pt.Managers.HttpClient),function(r,i,s,a,o){r.Class("Pt.Services.Members.LeaderboardService",new function(){return{getLeaderboard:function(e){var t=i.defer(),n=r.addRouteParamsToUri({club:e},s.urls.api.member.leaderboard);return a.get(n).then(function(e){t.resolve(r.extendOnly(new o,e.data))}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Endpoints,Pt.Managers.HttpClient,Pt.Contracts.Leaderboard),function(r,i,s,a,o){"use strict";r.Class("Pt.Services.Members.SpinWheelService",new function(){return{getPrizes:function(){var t=i.defer(),e=r.addRouteParamsToUri({memberCode:a.member.code},s.urls.api.member.spinWheelItems);return o.get(e).then(function(e){t.resolve(e.data)}).fail(function(e){t.reject(e)}),t.promise},claim:function(e){var t=i.defer(),n=r.addRouteParamsToUri({memberCode:a.member.code},s.urls.api.member.spinWheelClaim);return o.post(n,e).then(function(e){t.resolve(e.data)}).fail(function(e){t.resolve(e)}),t.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.HttpClient),function(e,n,r,i,s){"use strict";e.Class("Pt.Services.Members.HotMatchFeedService",new function(){return{get:function(e){var t=n.defer(),e=s.replaceV3Tags(i.urls.api.member.hotMatchFeed);return r.get(e).then(function(e){t.resolve(e.data)}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Managers.HttpClient,Pt.Endpoints,Pt.Services.AbstractV3Service),function(r,i,s,a,o,u){"use strict";function e(e){var t,n=i.defer();return t=o.replaceV3Tags(r.str_replace_key({":vendor":"idnpoker"},s.urls.api.member.gameVendorAccount)),a.post(t,e).then(function(e){n.resolve(r.extendOnly(new u,e.data))}).fail(function(e){n.reject(e)}),n.promise}function t(){var e,t=i.defer();return e=o.replaceV3Tags(r.str_replace_key({":vendor":"idnpoker"},s.urls.api.member.gameVendorAccount)),a.get(e).then(function(e){t.resolve(r.extendOnly(new u,e.data))}).fail(function(e){t.reject(e)}),t.promise}function n(e){var t,n=i.defer();return t=o.replaceV3Tags(r.str_replace_key({":vendor":"idnpoker"},s.urls.api.member.gameVendorAccount)),a.post(t+"/password",e).then(function(e){n.resolve(r.extendOnly(new u,e.data))}).fail(function(e){n.reject(e)}),n.promise}r.Class("Pt.Services.Members.GameIntegration",new function(){return{createIDNPokerAccount:e,getIDNPokerAccount:t,updateIDNPokerAccountPassword:n}})}(_,Q,Pt.Endpoints,Pt.Managers.HttpClient,Pt.Services.AbstractV3Service,Pt.Contracts.IDNPokerAccount),function(s,a,o,u,l,e,c,r){"use strict";s.Class("Pt.Services.Cms.WidgetService",new function(){var i={};return{get:function(e){var n=s.addRouteParamsToUri({widget:e,operatorId:u.operator.cmsId,lang:l.get("lang")},o.urls.cms.widget),r=a.defer();if(!s.booleanString(s.propertyValue(u,"service_toggle."+e,"true")))return r.resolve({}),r.promise;i[n]?r.resolve(i[n]):c.get(n,null,null,{store:!0}).then(function(e){if(!s.isEmpty(e.data)&&!s.isEmpty(e.data.data)){var t=e.data.data;return i[n]=t,r.resolve(t),this}if(e&&e.fromCache)return r.resolve(e),this;r.resolve({})}).fail(function(e){r.reject(e)});return r.promise},getAll:function(e){var t=s.addRouteParamsToUri({widget:e,operatorId:u.operator.cmsId,lang:l.get("lang")},o.urls.cms.widget),n=a.defer();return c.get(t).then(function(e){if(!s.isEmpty(e))return n.resolve(e._empty_.widgets),this;n.resolve([])}).fail(function(e){n.reject(e)}),n.promise},getBundle:function(e){var t=s.addRouteParamsToUri({bundle:e,operatorId:u.operator.cmsId},o.urls.cms.widgetBundle),n=a.defer();return c.get(t,null,null,{store:!0}).then(function(e){s.each(e.data,function(e){var t=e.key,n=s.addRouteParamsToUri({widget:t,operatorId:u.operator.cmsId,lang:l.get("lang")},o.urls.cms.widget);r.getCache(n)||r.setCache(n,e.data)}),n.resolve(e)}).fail(function(e){n.reject(e)}),n.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.Cookie,Pt.Managers.Cache,Pt.Managers.HttpClient,Pt.Services.HttpClientCacheService),function(o,e,t,r,u,i,l){o.Class("Pt.Services.Cms.BankingOptionService",new function(){var a={};return{get:function(){var n=o.addRouteParamsToUri({widget:"banking_options",operatorId:r.operator.cmsId,lang:l.get("lang")},t.urls.cms.widget),s=e.defer();return o.isEmpty(a[n])?i.get(n,null,null,{store:!0}).then(function(e){var r,t=e.data.data,i={};try{o.each(o.groupBy(t.options,"currency"),function(e,n){i[n]={},o.each(o.groupBy(e,"transaction_type"),function(e,t){i[n][t]=[],o.each(e,function(e){(r=new u.Cms.BankingOption).set("currency",o.propertyValue(e,"currency","")),r.set("details",o.propertyValue(e,"details","")),r.set("duration",o.propertyValue(e,"duration","")),r.set("maximum",o.propertyValue(e,"maximum","")),r.set("minimum",o.propertyValue(e,"minimum","")),r.set("name",o.propertyValue(e,"name","")),r.set("className",o.propertyValue(e,"class_name","")),r.set("redirectTo",o.propertyValue(e,"redirect_to","")),r.set("transaction_type",o.propertyValue(e,"transaction_type","")),r.set("fee",o.propertyValue(e,"fee","")),i[n][t].push(r)})})})}catch(e){s.reject([])}a[n]=i,s.resolve(i)}).fail(function(e){s.reject(e)}):s.resolve(a[n]),s.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Managers.HttpClient,Pt.Managers.Cookie),function(a,e,t,n,o,u){a.Class("Pt.Services.Cms.BankService",new function(){var s={};return{getByMethodCode:function(r){var i=e.defer();a.isEmpty(s[r])?u.get(t.urls.cms.bankCodes,{methodCode:r},null,{store:!0}).then(function(e){var t=e.data,n=[];a.each(t,function(e){"101ka_b2c"===r&&(e.bankCode+="-WAP"),n.push(a.extendOnly(new o.Bank,{bankCode:e.bankCode,bankName:a.trans("banks."+e.name)}))}),s[r]=n,i.resolve(n)}).fail(function(e){i.reject(e)}):i.resolve(s[r]);return i.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Managers.HttpClient),function(i,s,a,o,u,e,l){"use strict";i.Class("Pt.Services.Cms.BannerService",new function(){return{get:function(e,t){var n=i.str_replace_key({":platform":t||""},i.addRouteParamsToUri({operatorId:o.operator.cmsId,lang:u.get("lang")},a.urls.cms.banners)),r=s.defer();return l.get(n,{page:e},null,{store:!0}).then(function(e){r.resolve(e)}).fail(function(e){r.reject(e)}),r.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.Cookie,Pt.Managers.Cache,Pt.Managers.HttpClient),function(r,e,i){"use strict";r.Class("Pt.Services.Cms.DepositInstructionService",new function(){var n=null;return{init:function(){var t=e.defer();if(n)return t.resolve(n),t.promise;return i.get("deposit_instruction").then(function(e){n=e.deposit_method||[],t.resolve(n)}).fail(function(e){t.reject(e)}),t.promise},getByMethodCode:function(e){var t=r.findWhere(n,{method_code:e});if(t)return t.instruction;return""},getNotice:function(e){var t=r.findWhere(n,{method_code:e});if(t)return t.notice;return""},getPostInstruction:function(e){var t=r.findWhere(n,{method_code:e});if(t)return t.post_instructions;return""}}})}(_,Q,Pt.Services.Cms.WidgetService),function(r,e,i){"use strict";r.Class("Pt.Services.Cms.DepositBannerService",new function(){var n=null;return{init:function(){var t=e.defer();if(n)return t.resolve(n),t.promise;return i.get("deposit_mini_banner").then(function(e){n=e.deposit_method||[],t.resolve(n)}).fail(function(){t.resolve([])}),t.promise},getBanner:function(e){var t=r.findWhere(n,{method_code:e});if(t)return t;return""}}})}(_,Q,Pt.Services.Cms.WidgetService),function(e,r,i){"use strict";e.Class("Pt.Services.Cms.FeaturedGameService",new function(){var n=null;return{fetch:function(){var t=r.defer();if(n)return void t.resolve(n);return i.get("featured_games").then(function(e){n=e||[],t.resolve(n)}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Services.Cms.WidgetService),function(f,p,h,g,v,e,b,t,y,C,n){"use strict";f.Class("Pt.Services.Cms.GameService",new function(){h=h||{};var d=["en","zh-hans"],m=t.get("lang")||"zh-hans";return{getAllSlotGames:function(){var e=p.defer(),t=[],n=this;return f.each(g.games.slots.clubs,function(e){t.push(n.getGames("slot_machines",e))}),p.all(t).finally(function(){e.resolve({data:"ok"})}),e.promise},getTopGames:function(){var r=p.defer();return n.Cms.WidgetService.get("top_played_games").then(function(n){if(f.isEmpty(n))throw new Error("Top Played Widget Empty");e("slot_machines",f.flatten(f.map(n.slots.club_items,function(e){return f.map(f.filter(e.game_items,function(e){return e.game_id}),"game_id")}))).then(function(e){var t=new b.TopPlayedGames;t.games=e,t.data=n,r.resolve(t)})}).fail(function(){r.resolve(new b.TopPlayedGames)}),r.promise},getGames:function(e,r){t=e,n=r,f.each(d,function(e){h.cached||C.remove(t+"-"+n+"-"+e)});var t,n;var i=p.defer(),s=e+"-"+r+"-"+m,a=C.get(s),o={};"slot_machines"===e&&(o={fields:g.games.slots.fields});var u=f.extend({club:r,type:e,offset:0,limit:1e3},o),l=v.urls.cms.games;function c(e){h.cached=1,i.resolve(e)}f.isEmpty(a)?y.get(l,u,null,{store:!0}).then(function(e){var t=new b.CmsCollection,n=[];f.each(e.data,function(e){e.club=r,n.push(f.extendOnly(new b.Games,e))}),f.isEmpty(n)||(t.items=n,t.pagination=e.pagination,C.set(s,t,{TTL:18e4})),c(t)}).fail(function(){i.reject(new b.CmsCollection)}):c(a);return i.promise},getGamesByIds:e,getGameByVendorAndId:function(e,t){var n=p.defer(),r=f.str_replace_key({":vendor":e,":gameId":t},v.urls.cms.gameByVendorAndId);return y.get(r).then(function(e){f.isEmpty(e.data)?n.reject(!1):n.resolve(f.extendOnly(new b.Games,e.data))}),n.promise}};function e(e,t){var r=p.defer(),n={};"slot_machines"===e&&(n={fields:g.games.slots.fields});var i=f.extend({type:e,offset:0,limit:1e3,game_ids:t.join(",")},n),s=v.urls.cms.games;return y.get(s,i,null,{store:!0}).then(function(e){var t=new b.CmsCollection,n=[];f.each(e.data,function(e){n.push(f.extendOnly(new b.Games,e))}),f.isEmpty(n)||(t.items=n,t.pagination=e.pagination),r.resolve(t)}).fail(function(){r.reject(new b.CmsCollection)}),r.promise}})}(_,Q,Pt.GameSettings,Pt.Config,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Managers.Cookie,Pt.Managers.HttpClient,Pt.Managers.Cache,Pt.Services),function(e,r,i){"use strict";e.Class("Pt.Services.Cms.HotGamesService",new function(){var n=null;return{fetch:function(){var t=r.defer();if(n)return void t.resolve(n);return i.get("hot_games").then(function(e){n=e||[],t.resolve(n)}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Services.Cms.WidgetService),function(i,s,a,e,t,n,o){"use strict";i.Class("Pt.Services.Cms.InfoCenter",new function(){return{getCategories:function(){var e=a.urls.cms.infoCenterCategories,n=s.defer();return o.get(e,null,null,{store:!0}).then(function(e){if(!i.isEmpty(e)){var t=i.map(e,function(e){return{id:e._id,label:e.name,slug:e.slug}});return n.resolve(t),this}n.resolve({})},function(e){n.reject(e)}),n.promise},getList:function(e){var t=i.str_replace_key({":catId":e},a.urls.cms.infoCenterList),n=s.defer();return o.get(t,null,null,{store:!0}).then(function(e){if(!i.isEmpty(e)){var t={};return i.each(e,function(e){t[e.slug]={slug:e.slug,name:e.name,id:e._id}}),n.resolve(t),this}n.resolve({})},function(e){n.reject(e)}),n.promise},getDetails:function(e,t){var n=i.str_replace_key({":catId":t,":detailId":e},a.urls.cms.infoCenterDetails),r=s.defer();return o.get(n,null,null,{store:!0}).then(function(e){if(!i.isEmpty(e))return r.resolve(e),this;r.resolve({})},function(e){r.reject(e)}),r.promise},getDetailsBySlug:function(e,t){var n=i.str_replace_key({":catSlug":t,":slug":e},a.urls.cms.infoCenterDetailsBySlug),r=s.defer();return o.get(n,null,null,{store:!0}).then(function(e){if(!i.isEmpty(e))return r.resolve(e),this;r.resolve({})},function(e){r.reject(e)}),r.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.Cookie,Pt.Managers.Cache,Pt.Managers.HttpClient),function(r,i,s,e,t,n,a){"use strict";r.Class("Pt.Services.Cms.PageService",new function(){return{getPage:function(e){var t=s.urls.cms.page,n=i.defer();return a.get(t,{page:e},null,{store:!0}).then(function(e){if(!r.isEmpty(e.data))return n.resolve(e.data[0]),this;n.resolve({})}).fail(function(e){n.reject(e)}),n.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Managers.Cookie,Pt.Managers.Cache,Pt.Managers.HttpClient),function(a,o,i,u,e,t,l,c,d){"use strict";a.Class("Pt.Services.Cms.PromotionService",new function(){var s=t.get("lang")||"zh-hans";return{getPromotionsCategory:function(t){t=t||"member";var n=o.defer(),r="promotions-category-"+s,e=c.get(r),i="member"===t?"promotionCategories":"affiliatePromotionsCategories";a.isEmpty(e)?l.get(u.urls.cms[i],null,null,{store:!0}).then(function(e){e="member"===t?e:e.data,a.isEmpty(e)||c.set(r,e),n.resolve(e)}).fail(function(){n.resolve([])}):n.resolve(e);return n.promise},getPromotions:function(e,t){t=t||"member";var r=o.defer(),n="member"===t?"promotions":"affiliatePromotions";return l.get(u.urls.cms[n],{page:"promotions",category:e},null,{store:!0}).then(function(e){var n=[];a.each(e.data,function(e){var t=a.extendOnly(new d,e);a.isEmpty(a.propertyValue(e,"body",""))&&t.set("body",a.propertyValue(e,"contents.body.code","")),t.set("hashId",i(e.id)),a.isObject(e.image)&&t.set("cardImage",a.updateCdnPath(e.image)),a.isObject(e.contentBanner)&&t.set("bannerImage",a.updateCdnPath(e.contentBanner)),n.push(t)}),r.resolve(n)}).fail(function(){r.resolve([])}),r.promise}}})}(_,Q,md5,Pt.Endpoints,Pt.Settings,Pt.Managers.Cookie,Pt.Managers.HttpClient,Pt.Managers.Cache,Pt.Contracts.Promotion),function(e,r,i){"use strict";e.Class("Pt.Services.Cms.WinnersService",new function(){var n=null;return{fetch:function(){var t=r.defer();if(n)return void t.resolve(n);return i.get("winners_notification").then(function(e){n=e||[],t.resolve(n)}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Services.Cms.WidgetService),function(r,e,i){"use strict";r.Class("Pt.Services.Cms.WithdrawalInstructionService",new function(){var n=null;return{init:function(){var t=e.defer();if(n)return void t.resolve();return i.get("withdrawal_instruction").then(function(e){n=e.withdrawal_method||[],t.resolve()}).fail(function(e){t.reject(e)}),t.promise},getByMethodCode:function(e){if(!n&&!e)return"";var t=Array.isArray(n)?r.findWhere(n,{method_code:e}):n;return void 0!==t&&t.method_code===e?t.instruction:""}}})}(_,Q,Pt.Services.Cms.WidgetService),function(n,e,r,t,i,s){"use strict";n.Class("Pt.Services.Cms.YeePayCardService",new function(){return{getCardConfig:function(){var t=e.defer();return s.get(r.urls.cms.yeepayCards,null,null,{store:!0}).then(function(e){var r=[];n.each(e.data,function(e,t){var n=new i.CardType;n.set("code",t).set("denominations",e),r.push(n)}),t.resolve(r)}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Endpoints,Pt.Settings,Pt.Contracts,Pt.Managers.HttpClient),function(e,r,i){"use strict";e.Class("Pt.Services.Cms.IdleTimeService",new function(){var n=null;return{getConfig:function(){var t=r.defer();if(n)return t.resolve(n),t.promise;return i.get("idle_time").then(function(e){n=e||[],t.resolve(n)}).fail(function(e){t.reject(e)}),t.promise}}})}(_,Q,Pt.Services.Cms.WidgetService),function(a,o,i,u,e,t,l,c,d){"use strict";a.Class("Pt.Services.Cms.ArticleService",new function(){var s=t.get("lang")||"zh-hans";return{getArticlesCategory:function(t){t=t||"member";var n=o.defer(),r="article-category-"+s,e=c.get(r),i="member"===t?"articleCategories":"affiliateArticlesCategories";a.isEmpty(e)?l.get(u.urls.cms[i],null,null,{store:!0}).then(function(e){e="member"===t?e:e.data,a.isEmpty(e)||c.set(r,e),n.resolve(e)}).fail(function(){n.resolve([])}):n.resolve(e);return n.promise},getArticles:function(e,t){t=t||"member";var r=o.defer(),n="member"===t?"articles":"affiliateArticles";return l.get(u.urls.cms[n],{page:"articles",category:e},null,{store:!0}).then(function(e){var n=[];a.each(e.data,function(e){var t=a.extendOnly(new d,e);a.isEmpty(a.propertyValue(e,"body",""))&&t.set("body",a.propertyValue(e,"contents.body.code","")),t.set("hashId",i(e.id)),a.isObject(e.image)&&t.set("cardImage","/"+e.image.relative_uri),n.push(t)}),r.resolve(n)}).fail(function(){r.resolve([])}),r.promise}}})}(_,Q,md5,Pt.Endpoints,Pt.Settings,Pt.Managers.Cookie,Pt.Managers.HttpClient,Pt.Managers.Cache,Pt.Contracts.Article),function(s,a,e,o,u,l){"use strict";_.Class("Pt.Services.Affiliates.SessionService",new function(){var i={};return{login:function(e,t){var n=s.defer(),r={username:e,password:t,operatorId:a.operator.msId,deviceId:"Desktop"};return l.post(o.urls.api.affiliate.login,r).then(function(e){n.resolve({token:e.data.token})}).fail(function(e){n.reject(e)}),n.promise},forgotLogin:function(e,t){var n=s.defer(),r={username:e,email:t,operatorId:a.operator.msId};return l.post(o.urls.api.affiliate.forgotLogin,r).then(function(e){n.resolve(_.extendOnly(new u.ForgotPassword,e))}).fail(function(e){n.reject(e)}),n.promise},signup:function(e){var n=s.defer();return l.post(o.urls.api.affiliate.signup,e).then(function(e){var t=new u.AffiliateSignUp;t.set("status",e.data.service_code),t.set("message",e.message),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},signupSettings:function(){var n=s.defer(),r=o.urls.api.affiliate.signupSettings;return _.isEmpty(i[r])?l.get(r,{}).then(function(e){var t=new u.SignupSettings;t.commission_types=e.data.commission_types,t.countries=e.data.countries,t.currencies=e.data.currencies,t.languages=e.data.languages,i[r]=t,n.resolve(t)}).fail(function(e){n.reject(e)}):n.resolve(i[r]),n.promise},countryList:function(){var n=s.defer(),r=o.urls.api.affiliate.countryList;return _.isEmpty(i[r])?l.get(r,{}).then(function(e){var t=e.data.countries;i[r]=t,n.resolve(t)}).fail(function(e){n.reject(e)}):n.resolve(i[r]),n.promise}}})}(Q,Pt.Settings,Pt.Config,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient),function(r,i,e,s,a,o){"use strict";_.Class("Pt.Services.Affiliates.CreativeService",new function(){return{getCreativeBannerSizes:function(){var t=r.defer(),e=_.str_replace_key({":affiliateId":i.affiliate.id},s.urls.api.affiliate.creativeBannerSizes);return o.get(e).then(function(e){t.resolve(e.data.bannerSizes)}).fail(function(e){t.reject(e)}),t.promise},getCreativeTrackers:function(){var n=r.defer(),e=_.str_replace_key({":affiliateId":i.affiliate.id},s.urls.api.affiliate.creativeTrackers);return o.get(e).then(function(e){var t=new a.CreativeTrackers;t.groups=e.data.groups,t.languages=e.data.languages,t.trackingNames=e.data.trackingNames,n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getCreativeList:function(e){var t=r.defer(),n=_.str_replace_key({":affiliateId":i.affiliate.id},s.urls.api.affiliate.creativeList);return o.get(n,e).then(function(e){t.resolve(e.data.creatives)}).fail(function(e){t.reject(e)}),t.promise},createTrackingName:function(e){var t=r.defer(),n=_.str_replace_key({":affiliateId":i.affiliate.id},s.urls.api.affiliate.creativeTrackingNames);return o.post(n,e).then(function(e){t.resolve(e.data)}).fail(function(e){t.reject(e)}),t.promise}}})}(Q,Pt.Settings,Pt.Config,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient),function(s,n,e,i,a,o){"use strict";_.Class("Pt.Services.Affiliates.OverviewService",new function(){return{getAllDependencies:function(){var t=s.defer(),n=this,i=["getProductOverview","getSubAffiliates","getOverview","getSignupCountOverview"],r=[];return _.each(i,function(e){r.push(n[e]())}),s.allSettled(r).then(function(e){var r={};_.each(e,function(e,t){var n=i[t].replace("get","");r[n]=e.value||{}}),t.resolve(r)}),t.promise},getProductOverview:function(){var r=s.defer(),e=_.str_replace_key({":affiliateId":n.affiliate.id},i.urls.api.affiliate.productOverview);return o.get(e).then(function(e){var t=new a.ProductOverview,n=e.data.productOverview;t.activeMember=n.activeMember,t.products=n.products,t.totalCompanyWinLossAmount=n.totalCompanyWinLossAmount,t.totalRakesAmount=n.totalRakesAmount,t.totalTurnoverAmount=n.totalTurnoverAmount,r.resolve(t)}).fail(function(e){r.reject(e)}),r.promise},getSubAffiliates:function(){var r=s.defer(),e=_.str_replace_key({":affiliateId":n.affiliate.id},i.urls.api.affiliate.subAffiliates);return o.get(e).then(function(e){var t=new a.SubAffiliate,n=e.data.subAffiliateProductOverview;t.activeMember=n.activeMember,t.products=n.products,t.totalWinLossAmount=n.totalWinLossAmount,r.resolve(t)}).fail(function(e){r.reject(e)}),r.promise},getOverview:function(){var t=s.defer(),e=_.str_replace_key({":affiliateId":n.affiliate.id},i.urls.api.affiliate.overview);return o.get(e).then(function(e){t.resolve(e.data.tables)}).fail(function(e){t.reject(e)}),t.promise},getSignupCountOverview:function(){var r=s.defer(),e=_.str_replace_key({":affiliateId":n.affiliate.id},i.urls.api.affiliate.signupOverview);return o.get(e).then(function(e){var t=new a.SignupOverview,n=e.data.signupCountOverview;t.newSignup=n.newSignup,t.newSignupWithDeposit=n.newSignupWithDeposit,r.resolve(t)}).fail(function(e){r.reject(e)}),r.promise}}})}(Q,Pt.Settings,Pt.Config,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient),function(o,u,l,a,e,c){"use strict";_.Class("Pt.Services.Affiliates.ProfileService",new function(){var i=l.urls.api.affiliate.member,s={},r=e.replaceV3Tags(l.urls.api.affiliate.paymentType);return{getMemberInfo:function(e){var r=o.defer();return _.isEmpty(s[i])||e?c.get(i).then(function(e){var t=e.data.affiliate,n=new a.Affiliate.Member;n.set("dateOfBirth",window.moment(t.DOB)),n.set("address",t.address),n.set("affiliateId",t.affiliateId),n.set("username",t.affiliateUser),n.set("isFundingAllowed",_.booleanString(t.allowFunding)),n.set("city",t.city),n.set("commissionType",t.comType),n.set("messenger",t.contactMessenger),n.set("countryCode",t.countryCode),n.set("currencyCode",t.currency),n.set("languageCode",t.languageCode),n.set("email",t.email),n.set("fullName",t.firstname),n.set("loginAttempts",+t.loginAttempts),n.set("mobileNumber",t.mobileNo),n.set("operatorCode",t.operatorCode),n.set("operatorId",t.operatorId),n.set("payout",t.payout),n.set("postal",t.postal),n.set("websites",t.webUrls),n.set("accountName",t.BankAccName),n.set("accountNumber",t.BankAccNumber),n.set("bankAddress",t.BankAddress),n.set("bankBranch",t.BankBranch),n.set("bankName",t.BankName),n.set("bankSwiftCode",t.BankSwiftCode),n.set("securityAnswer",t.securityAnswer),n.set("securityQuestion",t.securityQuestion),n.set("redirectionPage",t.landingpage_id),s[i]=n,r.resolve(n)}).fail(function(e){r.reject(e)}):r.resolve(s[i]),r.promise},updateMemberInfo:function(e){var t=o.defer();return c.put(i+"/"+u.affiliate.id,e).then(function(){t.resolve()}).fail(function(e){t.reject(e)}),t.promise},addWebsite:function(e){var t=o.defer(),n=_.addRouteParamsToUri({affiliateId:u.affiliate.id},l.urls.api.affiliate.websites);return c.post(n,{websiteUrl:e}).then(function(){t.resolve()}).fail(function(e){t.reject(e)}),t.promise},deleteWebsite:function(e){var t=o.defer(),n=_.addRouteParamsToUri({affiliateId:u.affiliate.id},l.urls.api.affiliate.websites);return c.del(n+"/"+e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise},editWebsite:function(e){var t=o.defer(),n=_.addRouteParamsToUri({affiliateId:u.affiliate.id},l.urls.api.affiliate.websites);return c.put(n+"/"+e.siteId,{websiteUrl:e.websiteUrl}).then(function(e){t.resolve(_.extendOnly(new a.Generic,e))}).fail(function(e){t.reject(e)}),t.promise},getWebsites:function(){var n=o.defer(),e=_.addRouteParamsToUri({affiliateId:u.affiliate.id},l.urls.api.affiliate.websites);return c.get(e).then(function(e){var t=_.map(e.data.websiteUrls,function(e){var t=new a.AffiliateWebsite;return t.set("affiliateurl",e.websiteUrl),t.set("affiliatememberurlid",e.websiteUrlId),t});n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},changePassword:function(e){var t=o.defer(),n=_.addRouteParamsToUri({affiliateId:u.affiliate.id},l.urls.api.affiliate.changePassword);return c.put(n,e).then(function(e){t.resolve(_.extendOnly(new a.Generic,e))}).fail(function(e){t.reject(e)}),t.promise},inviteSubAffiliate:function(e){var i=o.defer(),s=_.addRouteParamsToUri({affiliateId:u.affiliate.id},l.urls.api.affiliate.subAffiliateInvite),a=[];return function t(e,n){var r=o.allSettled(_.map(e,function(e){return c.post(s,{emails:e})}));r.then(function(e){_.each(e,function(e){"rejected"===e.state&&a.push(e.reason[0])}),n&&n.length?t(n):a.length?i.reject(a):i.resolve()})}(e,e.splice(1)),i.promise},checkPaymentTypeAccess:function(){var t=o.defer();return c.get(r+"/access").then(function(e){t.resolve(e.data.canAccess)}).fail(function(e){t.reject(e)}),t.promise},getPaymentType:function(){var n=o.defer();_.isEmpty(s[r])?c.get(r).then(function(e){var t=_.extendOnly(new a.Affiliate.PaymentType,e.data);s[r]=t,n.resolve(t)}).fail(function(e){n.reject(e)}):n.resolve(s[r]);return n.promise},savePaymentType:function(e){var t=o.defer();return c.post(r,e,"json",{contentType:!1,processData:!1}).then(function(){t.resolve(),delete s[r]}).catch(function(e){t.reject(e)}),t.promise}}})}(Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Services.AbstractV3Service,Pt.Managers.HttpClient),function(s,u,l,c,a,d){"use strict";_.Class("Pt.Services.Affiliates.ReportsService",new function(){var o={};return{getMonthSelection:function(){var t=s.defer(),n=_.addRouteParamsToUri({affiliateId:u.affiliate.id,reportType:"available-months"},l.urls.api.affiliate.reports),r=[];return _.isUndefined(o[n])?d.get(n).then(function(e){r=_.map(e.data.months,function(e){return t=e,n=window.moment(t.startDate).utcOffset("+08:00"),r=n.format("MMMM")+" "+n.format("YYYY"),i=n.format("YYYY-MM-DD"),"bi-monthly"===t.payoutFrequency.toLowerCase()&&(r+=1==+n.get("date")?_.trans("affiliate.month_first_half"):_.trans("affiliate.month_second_half")),{month:n,payoutFrequency:t.payoutFrequency,label:r,referrence:i};var t,n,r,i}),o[n]=r,t.resolve(r)}).fail(function(e){t.reject(e)}):t.resolve(o[n]),t.promise},getCommissions:function(e){var t=s.defer(),n=[],r=a.replaceV3Tags(_.str_replace_key({affiliateId:u.affiliate.id,reportType:"commissions"},l.urls.api.affiliate.reportsV3)),i=_.encodeObjToUri(e,r);return _.isUndefined(o[i])?d.get(i).then(function(e){n=_.map(e.data.reports,function(e){var t=new c.CommissionReport;if(t.set("adjustment",+_.propertyValue(e,"adjustmentUSD",0)),t.set("expenses",+_.propertyValue(e,"expenses",0)),t.set("user",_.propertyValue(e,"affiliateUser",null)),t.set("settlementId",_.propertyValue(e,"settlementID","")),t.set("grossCommission",+_.propertyValue(e,"grossCommission",0)),t.set("subAffiliateCommission",+_.propertyValue(e,"subAffiliateCommissionUSD",0)),t.set("previousCommission",+_.propertyValue(e,"previousComUSD",0)),t.set("commission",+_.propertyValue(e,"payoutCommission",0)),t.set("negativeNetRevenue",+_.propertyValue(e,"negativeNetRevenue",0)),t.set("previousNegativeNetRevenue",+_.propertyValue(e,"previousNegativeNetRevenue",0)),t.set("commissionRollOverNextMonth",+_.propertyValue(e,"comRollNextMonth",0)),t.set("activeMember",+_.propertyValue(e,"uniqueActiveMember",0)),t.set("paymentFee",+_.propertyValue(e,"paymentFeeUSD",0)),t.set("rebate",+_.propertyValue(e,"rebateUSD",0)),t.set("reward",+_.propertyValue(e,"rewardUSD",0)),t.set("royalty",+_.propertyValue(e,"royaltyUSD",0)),t.set("bonus",+_.propertyValue(e,"bonusUSD",0)),t.set("netTurnOver",+_.propertyValue(e,"netTurnoverUSD",0)),t.set("grossRevenue",+_.propertyValue(e,"grossRevenueUSD",0)),t.set("rakesAmount",+_.propertyValue(e,"rakesAmount",0)),t.set("signUps",+_.propertyValue(e,"signUps",0)),t.set("firstTimeDeposits",+_.propertyValue(e,"firstTimeDeposits",0)),!_.isEmpty(_.propertyValue(e,"settlements",""))){var n=_.map(e.settlements,function(e){var t=new c.CommissionSettlement;return t.set("totalStakeAmount",+_.propertyValue(e,"TotalStakeAmount",0)),t.set("totalWinLoseAmount",+_.propertyValue(e,"TotalwinloseAmount",0)),t.set("stakeAmount",+_.propertyValue(e,"stakeAmount",0)),t.set("winloseAmount",+_.propertyValue(e,"winloseAmount",0)),t.set("rakesAmount",+_.propertyValue(e,"rakesAmount",0)),t.set("productKey",_.propertyValue(e,"productKey","")),t.set("productName",_.propertyValue(e,"productName","")),t.set("settlementId",_.propertyValue(e,"settlementID","")),t});t.set("settlements",n)}return t}),o[i]=n,t.resolve(n)}).fail(function(e){t.reject(e)}):t.resolve(o[i]),t.promise},getMemberProfileSummary:function(e){var t,n=s.defer(),r=_.addRouteParamsToUri({affiliateId:u.affiliate.id,reportType:"member-profile-summary"},l.urls.api.affiliate.reports),i=_.encodeObjToUri(e,r);return _.isUndefined(o[i])?d.get(i).then(function(e){t=_.map(e.data,function(e){var t=new c.MemberProfileSummary;return t.set("createDate",moment(_.propertyValue(e,"createdDate",""))),t.set("currencyCode",_.propertyValue(e,"currencyCode","")),t.set("memberCode",_.propertyValue(e,"memberCode","")),t.set("memberStatus",_.propertyValue(e,"memberStatus","")),t.set("signUpIp",_.propertyValue(e,"signUpIp","")),t.set("signUpSiteUrl",_.propertyValue(e,"signUpSiteUrl","")),t.set("dateTransaction",_.propertyValue(e,"dateTransaction","")),t}),o[i]=t,n.resolve(t)}).fail(function(e){n.reject(e)}):n.resolve(o[i]),n.promise},getProductReports:function(e){var t=s.defer(),a={},n=_.addRouteParamsToUri({affiliateId:u.affiliate.id,reportType:"products"},l.urls.api.affiliate.reports),r=_.encodeObjToUri(e,n);return _.isUndefined(o[r])?d.get(r).then(function(e){var s=[0,1,2];_.each(e.data.reports,function(r,i){a[i]=[],_.each(e.data.products,function(e){var t=_.findWhere(r,{productTranslationCode:e.productCode}),n=new c.ProductReport;n.set("productCode",e.productCode),n.set("productGroup",e.productGroup),n.set("productName",e.productName),n.set("currencyCode",_.propertyValue(t,"currencyCode","")),n.set("baseStakeAmount",+_.propertyValue(t,"baseStakeAmount",0)),n.set("baseWinLoseAmount",+_.propertyValue(t,"basewinloseAmount",0)),n.set("stakeAmount",+_.propertyValue(t,"stakeAmount",0)),n.set("winLoseAmount",+_.propertyValue(t,"winloseAmount",0)),n.set("clickAble",-1<s.indexOf(+e.productGroup)),a[i].push(n)})}),o[r]=a,t.resolve(a)}).fail(function(e){t.reject(e)}):t.resolve(o[r]),t.promise},getProductDetailedReport:function(e){var t=s.defer(),n=[],r=_.addRouteParamsToUri({affiliateId:u.affiliate.id,reportType:"products"},l.urls.api.affiliate.reports);r=r+"/"+e.productCode;var i=_.encodeObjToUri(e,r);return _.isUndefined(o[i])?d.get(i).then(function(e){n=_.map(e.data.reports,function(e,t){var n=new c.ProductReport;return n.set("productCode",e.productTranslationCode),n.set("productGroup",e.productGroup),n.set("productName",e.productName),n.set("currencyCode",_.propertyValue(e,"currencyCode","")),n.set("baseStakeAmount",+_.propertyValue(e,"basestakeAmount",0)),n.set("baseWinLoseAmount",+_.propertyValue(e,"basewinloseAmount",0)),n.set("stakeAmount",+_.propertyValue(e,"stakeAmount",0)),n.set("winLoseAmount",+_.propertyValue(e,"winloseAmount",0)),n}),o[i]=n,t.resolve(n)}).fail(function(e){t.reject(e)}):t.resolve(o[i]),t.promise},getPaymentReport:function(e){var t=s.defer(),n=_.addRouteParamsToUri({affiliateId:u.affiliate.id,reportType:"member-payments"},l.urls.api.affiliate.reports),r=[],i=_.encodeObjToUri(e,n);return _.isUndefined(o[i])?d.get(i).then(function(e){_.isEmpty(e.data)||(r=_.map(e.data,function(e){var t=new c.PaymentReport;return t.set("bonusAmount",_.propertyValue(e,"bonusAmount",0)),t.set("bonusAmountInUSD",_.propertyValue(e,"bonusAmountInUSD",0)),t.set("depositAmount",_.propertyValue(e,"depositAmount",0)),t.set("depositAmountInUSD",_.propertyValue(e,"depositAmountInUSD",0)),t.set("otherFeeAmount",_.propertyValue(e,"otherFeeAmount",0)),t.set("otherFeeAmountInUSD",_.propertyValue(e,"otherFeeAmountInUSD",0)),t.set("paymentFeeAmount",_.propertyValue(e,"paymentFeeAmount",0)),t.set("paymentFeeAmountInUSD",_.propertyValue(e,"paymentFeeAmountInUSD",0)),t.set("paymentFeeAmountInUSD",_.propertyValue(e,"paymentFeeAmountInUSD",0)),t.set("rebateAmount",_.propertyValue(e,"rebateAmount",0)),t.set("rebateAmountInUSD",_.propertyValue(e,"rebateAmountInUSD",0)),t.set("rebateAmountInUSD",_.propertyValue(e,"rebateAmountInUSD",0)),t.set("withdrawalAmount",_.propertyValue(e,"withdrawalAmount",0)),t.set("withdrawalAmountInUSD",_.propertyValue(e,"withdrawalAmountInUSD",0)),t.set("memberCode",_.propertyValue(e,"memberCode","")),t.set("memberId",_.propertyValue(e,"memberId","")),t.set("currency",_.propertyValue(e,"currency","")),t})),o[i]=r,t.resolve(r)}).fail(function(e){t.reject(e)}):t.resolve(o[i]),t.promise},getProductSummaries:function(e){var n=s.defer(),t=_.addRouteParamsToUri({affiliateId:u.affiliate.id,reportType:"product-summaries"},l.urls.api.affiliate.reports),r=[],i=_.encodeObjToUri(e,t);return _.isUndefined(o[i])?d.get(i).then(function(e){r=[],_.isEmpty(e.data.records)||(r=_.map(e.data.records,function(e){var t=new c.ProductSummary;return t.set("productCode",_.propertyValue(e,"productCode","")),t.set("rakesAmount",_.propertyValue(e,"rakesAmount",0)),t.set("stakeAmount",_.propertyValue(e,"stakeAmount",0)),t.set("stakeAmount",_.propertyValue(e,"stakeAmount",0)),t.set("activePlayer",_.propertyValue(e,"uniqueActivePlayer",0)),t.set("winLossAmount",_.propertyValue(e,"winLossAmount",0)),t}));var t="";_.isEmpty(e.data.totalUap)||(t=e.data.totalUap),r={records:r,totalUap:t},o[i]=r,n.resolve(r)}).fail(function(e){n.reject(e)}):n.resolve(o[i]),n.promise},getDailyTransactions:function(e){var t,n=s.defer(),r=[];return t=a.replaceV3Tags(_.str_replace_key({":affiliateUser":e.memberCode,":startDate":e.startDate,":endDate":e.endDate},l.urls.api.affiliate.downlineDailyTransactions)),_.isUndefined(o[t])?d.get(t).then(function(e){_.each(e.data,function(e){r.push(_.extendOnly(new c.DownlineHistory,e))}),o[t]=r,n.resolve(r)}).fail(function(e){n.reject(e)}):n.resolve(o[t]),n.promise}}})}(Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Services.AbstractV3Service,Pt.Managers.HttpClient),function(r,i,s,a,o){"use strict";_.Class("Pt.Services.Affiliates.TrackingService",new function(){return{getTrackingNames:function(){var n=r.defer(),e=_.addRouteParamsToUri({affiliateId:i.affiliate.id},s.urls.api.affiliate.creativeTrackers);return o.get(e).then(function(e){var t=_.map(e.data.trackingNames,function(e){return _.extendOnly(new a.TrackingName,{code:e.trackCodeID||"",name:e.trackCodeName||""})});n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getTrackingStatistics:function(e){var n=r.defer(),t=_.addRouteParamsToUri({affiliateId:i.affiliate.id},s.urls.api.affiliate.trackingStatistics);return o.get(_.encodeObjToUri(e,t)).then(function(e){var t=_.map(e.data.trackingStatistics,function(e){return _.extendOnly(new a.TrackingStatistics,{clicks:e.CountClick,uniqueClicks:e.CountUniqueClick,code:e.trackCodeID,name:e.trackCodeName,date:e.dates})});n.resolve(_.extendOnly(new a.MainTrackingStatistics,{totalClicks:e.data.totalClicks,totalUniqueClicks:e.data.totalUniqueClicks,trackingStatistics:_.groupBy(t,"name")}))}).fail(function(e){n.reject(e)}),n.promise}}})}(Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient),function(s,e,a,o,u,t){"use strict";_.Class("Pt.Services.Affiliates.DownlineService",new function(){var i=_.extend({},t,{getStatus:function(){var n=s.defer();if(r.isSet)n.resolve(r.value);else{var e=i.replaceV3Tags(a.urls.api.affiliate.downlineStatus);u.get(e).then(function(e){var t=!(!e.data||!e.data.status)&&e.data.status;n.resolve(t),r={isSet:!0,value:t}}).fail(function(e){n.reject(e)})}return n.promise},search:function(e){var n=s.defer(),t=_.getFormValue(e,"user")&&!_.isEmpty(_.getFormValue(e,"user").trim()),r=i.replaceV3Tags(_.str_replace_key({":regDateFrom":_.getFormValue(e,"regDateFrom"),":regDateTo":_.getFormValue(e,"regDateTo"),":type":_.getFormValue(e,"type"),":user":_.getFormValue(e,"user")},a.urls.api.affiliate[t?"downlineSearchByUser":"downlineSearch"]));return u.get(r).then(function(e){var t=[];_.each(e.data,function(e){t.push(_.extendOnly(new o.Downline,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise},getTopupHistory:function(e){var n=s.defer(),t=i.replaceV3Tags(_.str_replace_key({":startDate":_.getFormValue(e,"startDate"),":endDate":_.getFormValue(e,"endDate"),":status":_.getFormValue(e,"status"),":method":_.getFormValue(e,"method"),":type":_.getFormValue(e,"type")},a.urls.api.affiliate.downlineTopupHistory));return u.get(t).then(function(e){var t=[];_.each(e.data,function(e){t.push(_.extendOnly(new o.TopupHistory,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise}}),r={isSet:!1,value:void 0};return i})}(Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient,Pt.Services.AbstractV3Service),function(c,e,d,m,f,t){"use strict";_.Class("Pt.Services.Affiliates.FundsService",new function(){var i=_.extend({},t,{getBalance:function(e){var n=c.defer();if(r&&!e)n.resolve(r);else{var t=i.replaceV3Tags(d.urls.api.affiliate.accountBalance);f.get(t).then(function(e){var t=_.extendOnly(new m.AffiliateBalance,e.data||{});n.resolve(t),r=t}).fail(function(e){n.reject(e)})}return n.promise},topup:function(e){var t=c.defer(),n=_.getFormValue(e,"downlineType"),r=i.replaceV3Tags(_.str_replace_key({":type":n},d.urls.api.affiliate.accountTopup));return f.post(r,e).then(function(e){t.resolve(e)}).fail(function(e){t.reject(e)}),t.promise},getDepositMethods:function(e){var n=c.defer();if(s&&!e)n.resolve(s);else{var t=i.replaceV3Tags(d.urls.api.affiliate.depositMethods);f.get(t).then(function(e){var t=[];_.each(e.data,function(e){var n=_.extendOnly(new m.AffiliateDepositMethods,e);if(function(e){var t={yeepay_card:function(e){var r=[];return _.each(e.cards,function(e,t){var n=new m.CardType;n.set("code",t.toUpperCase()).set("denominations",e),r.push(n)}),r},offline:function(e){var a={amountSelection:e.amount_selection,fieldSettings:[],channels:[]},t=e.available_channels;return t&&t.length&&(_.each(t,function(e){a.channels.push(_.extendOnly(new m.BankingOption,{code:e,name:_.trans("funds.offline_channel_"+e)}))}),delete e.available_channels),_.each(e,function(e,t){var n="true"===e[t+"_visibility"],r=null,i=null;n||"deposit_time"!==t?r=n||"deposit_date"!==t?e[t+"_default_value"]||null:moment().format("YYYY-MM-DD"):(r="-",i="text");var s=_.extendOnly(new m.OfflineDepositField,{name:_.toCamelCase(t),shouldDisplay:n,defaultValue:r,inputType:i});a.fieldSettings.push(s)}),_.has(e,"processing_fee")&&(a.processing_fee=e.processing_fee),a},basic:l,bank_transfer:l},n=t[e.get("methodCode")];_.has(e.customFields,"web_recommended")&&(e.isRecommended=_.booleanString(e.customFields.web_recommended));if(_.isFunction(n)){var r=n(e.get("customFields"));e.set("customFields",r)}var i=t[e.get("processType")];if(_.isFunction(i)){var s=i(e.get("customFields"));e.set("formFields",s)}}(n),n.isBankTransfer()){var r=[];_.each(e.banks,function(e){var t="banks."+n.get("methodCode")+"_"+e;r.push((new m.Bank).set("bankName",_.trans(t)).set("bankCode",e))}),n.set("supportedBanks",r)}t.push(n)}),s=t,n.resolve(t)}).fail(function(e){n.reject(e)})}return n.promise},getBanks:function(e){var n=c.defer();if(a&&!e)n.resolve(a);else{var t=i.replaceV3Tags(d.urls.api.affiliate.banks);f.get(t).then(function(e){var t=[];_.each(e.data,function(e){t.push(_.extendOnly(new m.AffiliateBankAccounts,e))}),a=t,n.resolve(t)}).fail(function(e){n.reject(e)})}return n.promise},getSystemBanksAccounts:function(e){var n=c.defer();if(o&&!e)n.resolve(o);else{var t=i.replaceV3Tags(d.urls.api.affiliate.systemBankAccounts);f.get(t).then(function(e){var t=[];_.each(e.data,function(e){t.push(_.extendOnly(new m.AffiliateSystemBankAccount,e))}),o=t,n.resolve(t)}).fail(function(e){n.reject(e)})}return n.promise},createOfflineTransaction:function(e,t){var n=c.defer(),r=i.replaceV3Tags(_.str_replace_key({":method":e},d.urls.api.affiliate.deposit));return f.post(r,t,"json",{contentType:!1,processData:!1}).then(function(e){n.resolve(e.data)}).fail(function(e){n.reject(e)}),n.promise},getHistory:function(e){var n=c.defer(),t=i.replaceV3Tags(_.str_replace_key({":startDate":_.getFormValue(e,"startDate"),":endDate":_.getFormValue(e,"endDate"),":paymentStatus":_.getFormValue(e,"paymentStatus"),":paymentType":_.getFormValue(e,"paymentType")},d.urls.api.affiliate.fundsHistory));return f.get(t).then(function(e){var t=[];_.each(e.data,function(e){t.push(_.extendOnly(new m.FundsHistory,e))}),n.resolve(t)}).fail(function(e){n.reject(e)}),n.promise}}),r=void 0,s=void 0,a=void 0,o=void 0,u=["select","radio","checkbox"];return i;function l(e){var t=[];if(_.has(e,"form_fields"))try{e.form_fields=_.isArray(e.form_fields)?e.form_fields:[e.form_fields],t=_.map(e.form_fields,function(e){var t=new m.FormFields,n=_.propertyValue(e,"field_name",null),r="private"===_.propertyValue(e,"encryption_type","private").toLowerCase(),i=(r?"csf_":"csfb_")+n,s=null;t.set("fieldName",i),t.set("encryptionType",_.propertyValue(e,"encryption_type","private")),_.isEmpty(_.propertyValue(e,"validation_rules",""))||(s=_.propertyValue(e,"validation_rules","").split("|")),t.set("validationRules",s);var a=_.propertyValue(e,"input_type",null);if(t.set("inputType",a),-1<_.indexOf(u,a)){var o=_.map(_.propertyValue(e,"selections",[]),function(e){return{value:e,label:_.trans("funds.csf_"+n.toLowerCase()+"_"+e.toLowerCase())}});t.set("selections",o)}return t})}catch(e){void 0}return t}})}(Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.HttpClient,Pt.Services.AbstractV3Service),function(r,t,i,s){r.Class("Pt.Deposit.AffiliateDepositLauncherService",new function(){return{launch:function(e){var n=e.launcherUrl;n+="?transferAmount="+e.amount,e.custom&&r.each(e.custom,function(e,t){r.isArray(e)?r.each(e,function(e){n+="&"+t+"[]="+e}):n+="&"+t+"="+e});n+="&acceptLanguage="+i.get("lang"),n+="&errorUrl="+location.origin+t.depositErrorPage+e.methodId,n+="&token="+i.get("aff_token"),Pt.Settings.app_version&&(n+="&client-version="+Pt.Settings.app_version);n=r.str_replace_key({":pubkey":s.public_key,":lang":i.get("lang")||"en",":oid":s.operator.msId+"."+s.operator.cmsId},n),window.open(n,e.title||"Deposit","width="+(e.width||1e3)+", height="+(e.height||800))}}})}(_,Pt.Config,Pt.Managers.Cookie,Pt.Settings),function(i,s,a,o,u,l,c,d,m){"use strict";i.Class("Pt.Services.AffiliateAnnouncement",new function(){return{getAnnouncements:function(){var e=m.replaceV3Tags(o.urls.api.affiliate[a.affiliate.isLoggedIn?"announcements":"publicAnnouncements"]),t=s.defer(),n="affiliate.announcements."+md5(e+c.get("lang")),r=l.get(n)||[];i.isEmpty(r)?d.get(e).then(function(e){i.each(e.data,function(e){r.push(i.extendOnly(new u.AffiliateAnnouncements,e))}),i.isEmpty(r)||l.set(n,r,{TTL:18e4}),t.resolve(r)}).fail(function(e){t.reject(e)}):t.resolve(r);return t.promise}}})}(_,Q,Pt.Settings,Pt.Endpoints,Pt.Contracts,Pt.Managers.Cache,Pt.Managers.Cookie,Pt.Managers.HttpClient,Pt.Services.AbstractV3Service);
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
 * BaseAffiliateLogin Widget
 * Container: data-widget=affiliate-login
 *
 * Created by isda on 21/07/2016.
 */

(function ($,
           _,
           Config,
           Rules,
           Helpers,
           Managers,
           Services,
           Settings,
           absWidget) {

    "use strict";

    _.Class('Pt.Widgets.BaseAffiliateLogin', BaseAffiliateLogin);

    /**
     * @namespace Pt.Widgets.BaseAffiliateLogin
     * @constructor
     */
    function BaseAffiliateLogin() {

        this.inProgress = false;
        this.validator = null;
        this.loginForm = '[data-js=affiliate-login-form]';
        this.el = '[data-widget=affiliate-login]';

        this.actions = [

            [this.loginForm, 'submit', "_onFormSubmit"]
        ];

    }

    BaseAffiliateLogin.prototype = _.extend(absWidget, {

        activate: function () {

            if (_.urlHash().toLowerCase() === 'login') {

                $(this.el).modal('show');

            }

            if (this.validator !== null) {

                this.validator.destroy();
                this.validator = null;

            }

            this.validator = new Managers.Validation(this.loginForm, Rules.validation.login);

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
            Helpers.Form.lockForm(self.loginForm, true);

            var username = _.findWhere(data, { name: 'username' });
            var password = _.findWhere(data, { name: 'password' });

            Services.Affiliates.SessionService.login(username.value, password.value)
                .then(function (result) {

                    Managers.Cookie.set({ name: Config.tokenKey, value: result.token, expires: -1 });
                    Managers.Cookie.set({ name: Config.tokenKey, value: result.token, domain: Settings.main_domain });

                    location.reload();

                })
                .fail(function (e) {

                    self.inProgress = false;

                    Helpers.Form.lockForm(self.loginForm, false);

                    Helpers.Nprogress.done();

                    Helpers.Error.show(e);

                });

        }

    });

})(jQuery,
    _,
    Pt.Config,
    Pt.Rules,
    Pt.Helpers,
    Pt.Managers,
    Pt.Services,
    Pt.Settings,
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
           Config,
           Rules,
           Helpers,
           Managers,
           Services,
           Settings,
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


            var view = Managers.Template.get('awidgets.forgotLogin', {
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

            Services.Affiliates.SessionService.forgotLogin(username.value, email.value)
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
    Pt.Config,
    Pt.Rules,
    Pt.Helpers,
    Pt.Managers,
    Pt.Services,
    Pt.Settings,
    _.clone(Pt.Widgets.AbstractWidget)
);
/**
 * Winners List Widget
 * Created by mike on March 21, 2018
 */

(function(
    Q,
    Template,
    Preloader,
    OverviewService,
    WidgetService,
    Settings,
    Managers,
    Config,
    absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseAffiliateSummary', BaseAffiliateSummary);

    /**
     * @namespace Pt.Widgets.BaseAffiliateSummary
     * @constructor
     */
    function BaseAffiliateSummary () {

        this.view = 'awidgets.affiliateSummary';
        this.widgetContainer = 'widget[controller|=AffiliateSummary]';
        this.summaryData = {};
        this.promises = [];
        this.actions = [
            ['[data-js=affiliate-collapse-btn]', 'click', "_onCollapseClick"]
        ];

        this.defaultOverviewData = {
            table: {
                TotalMember: '-',
                NoOfClick: '-',
                lastLogin: '-'
            },
            table1: {
                settlementdate: '-',
                GrandTotal: '-'
            },
            table2: {
                settlementdate: '-',
                NegativeBalanceRollover: '-'
            }
        }

        //display
        this.display = {
            commissions: 5
        };

        this.isClosed = Managers.Cache.get('affiliate-summary-closed');

    }

    BaseAffiliateSummary.prototype = _.extend(absWidget, {

        activate: function () {

            var self = this;

            self.promises = [
                OverviewService.getOverview(),
                OverviewService.getSignupCountOverview(),
                OverviewService.getProductOverview(),
                WidgetService.get('affiliate_settings'),
            ];

            Preloader.basic(self.widgetContainer);

            Q.allSettled(self.promises).then( function ( res ) {

                var affiliateLink = _.str_replace_key({
                    ':protocol': _.propertyValue(res[3], 'value.link_protocol') || window.location.protocol.toString().replace(':', ''),
                    ':domain': _.propertyValue(res[3], 'value.link_domain') || window.location.host,
                    ':affiliateId': Settings.affiliate.id
                }, _.propertyValue(res[3], 'value.tracker_link') || Config.affiliate.trackLink);

                var overview = self.defaultOverviewData;
                if (res[0].state === 'fulfilled') {
                    $.extend(true, overview, res[0].value);
                }

                var shouldShowCommission = overview.table4 ? 
                    overview.table4['allowDisplayComFee'] === "1" : true;

                self.summaryData = {
                    overview: overview,
                    signupCountOverview: res[1].state === 'fulfilled' ? res[1].value : {},
                    productOverview: res[2].state === 'fulfilled' ? res[2].value : {},
                    fixCurrency: 'USD',
                    affiliateUser: Settings.affiliate.user,
                    affiliateLink: affiliateLink,
                    isClosed: self.isClosed,
                    display: self.display,
                    shouldShowCommission: shouldShowCommission
                };

                self.renderSummary();

            }).fail( function (fail) {

                void 0;

            });

        },

        renderSummary: function() {

            var view = Template.get(this.view, this.summaryData);

            this.render(this.widgetContainer, view);
            this._bindEvents();

        },

        _onCollapseClick: function(e)  {

            e.preventDefault();

            var self = e.data.context;

            self.isClosed = ! self.isClosed;

            Managers.Cache.set('affiliate-summary-closed', self.isClosed);

        }

    });

})(
    Q,
    Pt.Managers.Template,
    Pt.Helpers.Preloader,
    Pt.Services.Affiliates.OverviewService,
    Pt.Services.Cms.WidgetService,
    Pt.Settings,
    Pt.Managers,
    Pt.Config,
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


(function (
    $,
   _,
   Settings,
   Config,
   Template,
   Cache,
   Services,
   Modal,
   absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseAffAnnouncements', BaseAffAnnouncements);

    function BaseAffAnnouncements () {

        this.announcements = [];
        this.readAnnouncements = [];
        this.unreadAnnouncements = [];
        this.announcementsMarquee = 'awidgets.announcementsMarquee';
        this.el = '[data-widget=announcements]';
        this.announcementLength = '[data-js=announcement-length]';
        this.announcementHint = '[data-js=announcement-hint]';
        this.announcementNotifyIcon = '[data-js=announcement-notify-icon]';
        this.announcementUnreadEl = '[data-js=announcement-unread]';
        this.readAnnouncementsKey = 'affiliate.readAnnouncements';

        this.actions = [
            ['[data-js=affiliate-announcement-btn]', 'click', '_onAnnouncementButtonClick'],
            ['[data-js=announcement-container]', 'click', '_onAnnouncementButtonClick']
        ];

    }

    BaseAffAnnouncements.prototype = _.extend(absWidget, {

        activate: function () {

            Services.AffiliateAnnouncement.getAnnouncements()
                .then( _.bind(this._onAnnouncementReady, this) );

        },

        _onAnnouncementReady: function (res) {

            if ( ! _.isEmpty(res) ) {

                var self = this;

                this.announcements = _.sortBy(res, 'effectiveDate').reverse();
                this.readAnnouncements = Cache.get(this.readAnnouncementsKey) || [];
                this.unreadAnnouncements = _.filter(this.announcements,
                    function(announcement) {

                        return ! ~self.readAnnouncements.indexOf(
                            announcement.announcementId
                        );

                    });

                var markUp = Template.get(this.announcementsMarquee, {
                    announcements: this.announcements
                });

                if ( this.unreadAnnouncements.length ) {

                    $(this.announcementUnreadEl).removeClass('hide');

                    $(this.announcementLength)
                        .addClass('text-danger')
                        .text(this.unreadAnnouncements.length);

                    $(this.announcementHint).removeClass('hide');

                    $(this.announcementLength).removeClass('hide');

                    $(this.announcementNotifyIcon).removeClass('hide');

                } else {

                    $(this.announcementLength).addClass('hide');
                    $(this.announcementUnreadEl).addClass('hide');

                }

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

            } else {

                var markUp = Template.get(this.announcementsMarquee, {
                    announcements: this.announcements
                });

                $('.announcement-wrapper, .marquee-section').addClass("disable");
                $(this.announcementLength).addClass('hide');

                this.render(this.el, markUp);

            }

            this._bindEvents();

        },

        _onAnnouncementButtonClick: function (e) {

            e.preventDefault();

            var self = e.data.context;

            if ( self.announcements.length ) {

                var modalAnnouncement = Modal.generic(
                    Template.get('awidgets.announcements', {
                        affAnnouncements : self.announcements
                    }), { additionalClass: 'modal-lg affiliate-announcements' }
                );

                modalAnnouncement.on('hidden.bs.modal',
                    _.bind(self.onAnouncementModalHide, self)
                );

                if ( self.unreadAnnouncements.length ) {

                    _.each(self.unreadAnnouncements, function(announcement) {

                        self.readAnnouncements.push(announcement.announcementId);

                    });

                    Cache.set(self.readAnnouncementsKey, self.readAnnouncements);

                }

            }

        },

        onAnouncementModalHide: function () {

            if ( this.unreadAnnouncements.length ) {

                $(this.announcementLength).addClass('hide');
                $(this.announcementHint).addClass('hide');
                $(this.announcementNotifyIcon).addClass('hide');
                $(this.announcementUnreadEl).addClass('hide');
                this.unreadAnnouncements = [];

            }

        }

    });

})(
    jQuery,
    _,
    Pt.Settings,
    Pt.Config,
    Pt.Managers.Template,
    Pt.Managers.Cache,
    Pt.Services,
    Pt.Helpers.Modal,
    _.clone(Pt.Widgets.AbstractWidget)
);

(function(
    Managers,
    WidgetService,
    absWidget
) {

    "use strict";

    _.Class('Pt.Widgets.BaseDownloadBanner', BaseDownloadBanner);

    /**
     * @namespace Pt.Widgets.BaseDownloadBanner
     * @constructor
     */
    function BaseDownloadBanner () {

        this.view = 'awidgets.downloadBanner';
        this.widgetContainer = 'widget[controller|=DownloadBanner]';
        this.contentModalContainer = '[data-js=modal-content]';
        this.modal = '[data-widget=banner-download]';
        this.menu = '[data-js=menu-basic]';
        this.promoBanner = {};
        this.actions = [
            [this.modal, 'click', '_onShowModal'],
            [window, 'hashchange', '_onHashChange']
        ];

    }

    BaseDownloadBanner.prototype = _.extend(absWidget, {

        activate: function () {

            var _self = this;

            if ($(this.widgetContainer).length) {

                WidgetService.get('download_banner').then(function(res) {

                    if ( ! _.isEmpty(res) ) {

                        _self.displayBanners(res);

                    }

                });

                this._bindEvents();

            }

        },

        displayBanners: function(banner_list) {

            var _self = this;

            _self.promoBanner = banner_list.promotion;

            var view = Managers.Template.get(_self.view, {

                productBanner: banner_list.product,
                promoBanner: _self.promoBanner,

            });

            _self.render(_self.widgetContainer, view);

            _self._onHashChange();

        },

        _onHashChange: function() {

            if (window.location.hash) {
                $('a[href="' + window.location.hash + '"').tab('show');
            }

        },

        _onShowModal: function(e) {

            e.preventDefault;
            var self = e.data.context
            var item = $(this).data('value');
            var months = moment.months();
            var links = self.promoBanner[item].banner;
            var banners = [];

            _.each(months, function(value, key) {

                banners.push({
                    month: value,
                    link: links[key]
                });

            });

            var view = Managers.Template.get('awidgets.bannerModal', {

                promoBanner: self.promoBanner[item],
                banners: banners

            });

            self.render(self.contentModalContainer, view);

        }

    });

})(
    Pt.Managers,
    Pt.Services.Cms.WidgetService,
    _.clone(Pt.Widgets.AbstractWidget)
);


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

    _.Class("Pt.Widgets.PromoBanner", PromoBanner);

    var WIDGET_KEY = '_promo_banners';

    function getServiceName(type) {
        return type + WIDGET_KEY;
    }

    function PromoBanner() {
        this.view = {
            web: "widgets.web_promo_banners",
            affiliate: "awidgets.web_promo_banners"
        };

        this.widgetContainer = 'widget[controller|=PromoBanner]';
    }

    PromoBanner.prototype = _.extend(absWidget, {
        activate: function () {
            var self = this

            var type = $(self.widgetContainer).data('type');



            Services.Cms.WidgetService
                .get(getServiceName(type))
                .then(function (res) {

                    var view = Managers.Template.get(self.view[type], {
                        banners: res[getServiceName(type)],
                        type: type
                    })

                    self.render(self.widgetContainer, view);
                    return res
                })
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
/**
 * AffiliateLogin Widget
 * Container: data-widget=login
 *
 * Created by isda on 16/03/2017.
 */

(function (_baseAffiliateLogin) {

    "use strict";

    _.Class('Pt.Widgets.AffiliateLogin', new AffiliateLogin ());

    /** @namespace Pt.Widgets.AffiliateLogin **/
    function AffiliateLogin () {

        function Class () {

            _baseAffiliateLogin.call(this);

        }

        Class.prototype = Object.create(_baseAffiliateLogin.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

        }, Pt.Core.Extend('Widgets.AffiliateLogin'));


        return new Class();

    }



})(
    Pt.Widgets.BaseAffiliateLogin
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
 * Affiliate Summary Widget
 * Created by mike on April 27, 2018
 */

(function (_baseAffiliateSummary) {

    "use strict";

    _.Class('Pt.Widgets.AffiliateSummary', new AffiliateSummary ());

    /** @namespace Pt.Widgets.AffiliateSummary **/
    function AffiliateSummary () {

        function Class () {

            _baseAffiliateSummary.call(this);

        }

        Class.prototype = Object.create(_baseAffiliateSummary.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

        }, Pt.Core.Extend('Widgets.AffiliateSummary'));

        return new Class();

    }

})(
    Pt.Widgets.BaseAffiliateSummary
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
 * Affiliate Announcements Widget
 *
 * Created by isda on 16/03/2017.
 */

(function (_baseAffAnnouncements) {

    "use strict";

    _.Class('Pt.Widgets.AffiliateAnnouncements', new Announcements ());

    /** @namespace Pt.Widgets.AffiliateAnnouncements **/
    function Announcements () {

        function Class () {

            _baseAffAnnouncements.call(this);

        }

        Class.prototype = Object.create(_baseAffAnnouncements.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

        }, Pt.Core.Extend('Pt.Widgets.BaseAffAnnouncements'));


        return new Class();

    }

})(
    Pt.Widgets.BaseAffAnnouncements
);

/**
 * Splash Widget
 * Container: data-widget=splash
 *
 * Created by - on 19/10/2017.
 */

(function (_baseDownloadBanner) {

    "use strict";

    _.Class('Pt.Widgets.DownloadBanner', new DownloadBanner ());

    /** @namespace Pt.Widgets.DownloadBanner **/
    function DownloadBanner () {

        function Class () {

			_baseDownloadBanner.call(this);

        }

        Class.prototype = Object.create(_baseDownloadBanner.prototype);
        Class.prototype.constructor = Class;

        _.extend( Class.prototype, {

        }, Pt.Core.Extend('Widgets.DownloadBanner'));


        return new Class();

    }



})(
    Pt.Widgets.BaseDownloadBanner
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

        this.defaultDateFormat = 'DD/MM/YYYY HH:mm:ss [GMT] ZZ'

        this.actions = [
            ['[data-js=theme-selection]', 'click', 'onThemeSelect'],
            ['[data-js=language-selection]', 'click', 'onLanguageSelect']
        ];

    }

    Header.prototype = _.extend(absComponent, {

        preRender: function () {

            var view = Managers.Template.get('awidgets.top_header_component', {
                logo: Settings.logo,
                app: Settings.app,
                isLoggedIn: Settings.affiliate.isLoggedIn,
                module: Settings.module,
                memberCode: Settings.affiliate.user
            });

            this.renderComponent('top-header-component', view);

        },

        init: function () {

            this.preRender();

            this._loadThemeSelection();
            this._loadLanguageSelection();
            this._loadMenuHover();
            this._loadTimer();
            this._bindEvents();

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

            var view = Managers.Template.get('aweb.themeSelection', {
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

            var view = Managers.Template.get('aweb.affiliateLanguageSelection', {
                activeLang: lang,
                activeLangLabel: langObj.label,
                activeLangIcon: langObj.key,
                languages: languages
            });

            this.render(container, view);

        },

        _loadMenuHover: function () {

            $('.main-nav .dropdown, .navbar-nav .dropdown').hover(function () {

                $(this).addClass('open');

            }, function () {

                $(this).removeClass('open');

            }).on('touchstart', function(e) {

                var dropdown = $(this),
                    dropdownMenu = $('.dropdown-menu', this), 
                    target = e.target;

                if ( dropdownMenu.length && ! $.contains(dropdownMenu[0], target) ) {

                    e.preventDefault();

                    if ( dropdown.hasClass('open') ) {

                        dropdown.removeClass('open');

                    } else {

                        dropdown.addClass('open');

                    }

                }

            });

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

        _customDateDisplay: function(date){

            //can be change through cms override
            return date;

        }

    });

})(
    Pt.Settings,
    Pt.Config,
    Pt.Widgets,
    Pt.Managers,
    _.clone(Pt.Components.AbstractComponent)
);


/**
 * GPI Header
 * Created by isda on 27/02/2017.
 */


(function (_baseHeaderComponent) {

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

        }, Pt.Core.Extend('Components.Header'));

        return new Class();

    }

})(
    Pt.Components.BaseHeader
);

/***********************
 * AFFILIATE WEB CONTROLLER
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

/**
 * Base Affiliate Home Controller
 * Created by isda on 13/12/2016.
 */


(function (
    absCtrl
) {

    "use strict";

    _.Class('Pt.Controllers.BaseHomeController', BaseHomeController);

    /**
     * @namespace Pt.Controllers.BaseHomeController
     * @constructor
     */
    function BaseHomeController() {

    }

    BaseHomeController.prototype = _.extend(absCtrl, {

        init: function () {}

    });

})(
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
    Helpers,
    Widgets,
    Managers,
    Services,
    Config,
    absCtrl
) {

    "use strict";

    _.Class( 'Pt.Controllers.BaseSignupController', BaseSignupController);

    /**
     * @namespace Pt.Controllers.BaseSignupController
     * @constructor
     */
    function BaseSignupController() {

        this.signupSettings = {};
        this.validator = null;
        this.container = '[data-js=page-container]';

        this.el = '[data-widget=signup]';
        this.elDate = '[data-js=date]';
        this.selectDays = '[data-js=select-days]';
        this.selectMonths = '[data-js=select-months]';
        this.selectYears = '[data-js=select-years]';
        this.defaultDate = moment(new Date()).subtract(18, 'years');

        this.actions = [
            [this.form, 'submit', "_onFormSubmit"],

            [this.el, 'shown.bs.modal', "_onWidgetShown"],
            [this.el, 'hidden.bs.modal', "_onWidgetHide"],

            [this.el, 'show.bs.modal', '_onSelectMonthsChange'],
            [this.selectMonths, 'change', '_onSelectMonthsChange'],
            [this.selectYears, 'change', '_onSelectMonthsChange'],

            [this.el, 'show.bs.modal', '_dobSetDate'],
            ['[data-js*=select-]', 'change', '_dobSetDate']
        ];

    }

    BaseSignupController.prototype = _.extend(absCtrl, {
        form: '[data-js=affiliate-signup-form]',
        resolve: function (next) {

            var self = this;

            var requests = [
                Services.Cms.WidgetService.get('signup'),
                Services.Affiliates.SessionService.countryList()
            ];

            $q.allSettled(requests).then(function(res) {

                if ( res[0].state === 'fulfilled' ) {

                    var data = res[0].value;

                    self.signupSettings = {
                        commission_types: _.propertyValue( data, 'affiliatesite.commission_type', '' ),
                        currencies: _.propertyValue( data, 'affiliatesite.currencies', '' ),
                        redirect_url: _.propertyValue( data, 'affiliatesite.redirect_url', '/' ),
                    };

                }

                if ( res[1].state === 'fulfilled' ) {

                    self.signupSettings.countries = res[1].value

                }

                next();

            }).fail(function(fail) {

                void 0;

            });

        },

        init: function () {

            var view = Managers.Template.get('aweb.affiliateSignup', _.extend(this.signupSettings, {
                referralId: Managers.Cookie.get('referralid') || this.referralId
            }));
            var defaultDate = this.defaultDate;

            this.render(this.container, view);

            if (this.validator !== null) {

                this.validator.destroy();
                this.validator = null;

            }

            this._onSelectMonthsChange(null, this);
            this._dobSetDate(null, this);

            $(this.selectDays).val(defaultDate.format('DD'));
            $(this.selectMonths).val(defaultDate.format('MM'));

            this.validator = new Managers.Validation(this.form, Rules.validation.affiliate.signup);

            this.validator
                .bindInput(true)
                .init();

            this._initForm()
                ._bindEvents();

        },

        _initForm: function () {

            Helpers.DatePicker.activate('[data-js=date]', {
                endDate: moment(new Date()).subtract(18, 'years')._d,
                language: Managers.Cookie.get('lang'),
                defaultViewDate: moment(new Date()).subtract(18, 'years').format('YYYY/MM/DD'),
            }, Config.datePickerLocale[Managers.Cookie.get('lang')]);

            return this;

        },

        _onFormSubmit: function (e) {

            e.preventDefault();

            var self = e.data.context;
            var frm = $(this);
            var fullName = frm.find('#fullName');

            fullName.val(fullName.val().trim());
            self.validator.validate(self._onValidationSuccess, self);

        },

        _onValidationSuccess: function (data, self) {

            var form = $(self.form);

            if (self.inProgress) {

                return self;

            }

            self.inProgress = true;

            Helpers.Form.lockForm(self.form, true);


            Helpers.Nprogress.start();

            data.push({ name: "operatorId", value: Settings.operator.msId });

            Services.Affiliates.SessionService.signup(data)
                .then(function (res) {

                    var _onSuccess = function() {

                        Managers.Cookie.remove({ name: 'referralid' });

                        form[0].reset();


                    };

                    var view = Managers.Template.get('aweb.affiliateSignupSuccess', {
                        message: res.message
                    });

                    Helpers.Modal.info( _.trans('affiliate.signup_success_header'), view, _onSuccess, {
                        dialogClass: 'affiliate-signup-success',
                        confirmButton: _.trans('affiliate.signup_success_confirm_button')
                    });

                    self.secureFormRequest(self.form, false, true);

                })
                .fail(function (e) {

                    Helpers.Error.show(e);
                    self.secureFormRequest(self.form, false, false);

                })
                .finally(function () {

                    Helpers.Nprogress.done();

                });

        },

        _getDaysInMonth: function (year, month, selectedDay) {

            var self = this;
            var defaultDate = this.defaultDate;

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

                $(self.elDate).val(self.defaultDate.format('YYYY-MM-DD'));

            } else {

                $(self.elDate).val($(self.selectYears).val() + '-' + $(self.selectMonths).val() + '-' + $(self.selectDays).val());

            }

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
    Pt.Config,
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

            if (Settings.affiliate.isLoggedIn) {

                location.href = '/';

                return false;

            }

            Widgets.AffiliateLogin.activate();

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
 * Signup Controller
 * Created by isda on 15/12/2016.
 */


(function ($,
           _,
           $q,
           Settings,
           Config,
           Rules,
           Helpers,
           Widgets,
           Managers,
           Services,
           WidgetService,
           absCtrl) {

    "use strict";

    _.Class('Pt.Controllers.BaseCreativeController', BaseCreativeController);

    /**
     * @namespace Pt.Controllers.BaseCreativeController
     * @constructor
     */
    function BaseCreativeController() {

        this.validator = null;
        this.validatorTrack = null;
        this.container = '[data-js=page-container]';
        this.resultContainer = '[data-js=creative-result-container]';
        this.languageCodeSelector = '[data-js=affiliate-form-language-code]';
        this.form = '[data-js=creative-form]';
        this.trackForm = '[data-js=creative-tracking-form]';
        this.bannerSizes = [];
        this.creativeTrackers = {
            groups: [],
            languages: [],
            trackingNames: []
        };
        this.loaded = false;
        this.affiliateSettings = {};

        this.actions = [

            [this.form, 'submit', "_onFormSubmit"],
            [this.trackForm, 'submit', "_onTrackFormSubmit"],
            ['[data-js=add-track-btn]', 'click', "_onAddTrackClick"]
        ];

        this.languages = {
            "en": "en-us",
            "zh-hans": "zh-cn",
            "vi": "vi-vn",
            "th": "th-th",
            "id": "id-id",
            "km": "km-kh",
            "ko": "ko-kr",
            "ja": "ja-jp"
        };

    }

    BaseCreativeController.prototype = _.extend(absCtrl, {

        preRender: function () {

            var currentLanguage = this.languages[Managers.Cookie.get("lang")]?
                this.languages[Managers.Cookie.get("lang")] : 'en-us';

            var view = Managers.Template.get('aweb.creativeForm', _.extend(this.creativeTrackers, {
                bannerSizes: this.bannerSizes,
                loaded: this.loaded,
                currentLanguage: currentLanguage
            }));

            return this.render(this.container, view);

        },

        resolve: function (next) {

            this.preRender();

            var self = this;

            var promises = [
                Services.Affiliates.CreativeService.getCreativeBannerSizes(),
                Services.Affiliates.CreativeService.getCreativeTrackers(),
                WidgetService.get('affiliate_settings'),
            ];

            $q.all(promises)
                .then(function (res) {

                    self.bannerSizes = res[0];
                    self.creativeTrackers = res[1];
                    self.affiliateSettings = res[2] || {};
                    self.loaded = true;

                })
                .finally(function () {

                    next();

                });

        },

        init: function () {

            /**
             * Call preRender Again to
             * render view with data from promise
             */
            this.preRender();

            this.validator = new Managers.Validation(this.form, Rules.validation.affiliate.creative);

            this.validator
                .bindInput(true)
                .init();

            this._bindEvents();

        },

        _onFormSubmit: function (e) {

            e.preventDefault();

            var self = e.data.context;

            self.validator.validate(self._onValidationSuccess, self);

        },

        _onValidationSuccess: function (data, self) {

            var form = $(this.form);

            if (this.inProgress) {

                return this;

            }

            this.inProgress = true;

            Helpers.Form.lockForm(form, true);

            Helpers.Nprogress.start();

            var bannerSize = _.findWhere(data, { name: "bannerSizes" }).value;
            var trackName = _.findWhere(data, { name: "trackingNames" }).value;
            var trackNameText = _.findWhere(this.creativeTrackers.trackingNames, { trackCodeID: trackName }).trackCodeName;

            if (bannerSize !== '-1') {

                data.push(
                    { name: 'width', value: _.toInt(bannerSize.split('x')[0]) },
                    { name: 'height', value: _.toInt(bannerSize.split('x')[1]) }
                );

            } else {

                data.push(
                    { name: 'width', value: 0 },
                    { name: 'height', value: 0 }
                );

            }

            Services.Affiliates.CreativeService.getCreativeList(data)
                .then(function (res) {

                    var view = Managers.Template.get('aweb.creativeResult', {
                        affiliateId: Settings.affiliate.id,
                        track_name: trackName,
                        creatives: res,
                        trackNameText: trackNameText,
                        affiliateSettings: self.affiliateSettings || {}
                    });

                    self.render(self.resultContainer, view);

                })
                .finally(function () {

                    self.secureFormRequest(form, false, false);

                    $(self.languageCodeSelector).prop('disabled', 'disabled');

                    Helpers.Nprogress.done();

                });

        },

        _onAddTrackClick: function (e) {

            e.preventDefault();

            var self = e.data.context;

            var view = Managers.Template.get('aweb.trackingForm');

            Helpers.Modal.generic(view);

            self.validatorTrack = new Managers.Validation(self.trackForm, Rules.validation.affiliate.trackNames);

            self.validatorTrack
                .bindInput(true)
                .init();

            self._bindEvents();

        },

        _onTrackFormSubmit: function (e) {

            e.preventDefault();

            var self = e.data.context;

            self.validatorTrack.validate(self._onTrackValidationSuccess, self);

        },

        _onTrackValidationSuccess: function (data, self) {

            var form = $(this.trackForm);

            if (this.inProgress) {

                return this;

            }

            this.inProgress = true;

            Helpers.Form.lockForm(form, true);

            Helpers.Nprogress.start();

            Services.Affiliates.CreativeService.createTrackingName(data)
                .then(function () {

                    self.resolve(function () {

                        self.secureFormRequest(form, false);

                        Helpers.Nprogress.done();

                        Helpers.Notify.success(_.trans('affiliate.creative_success_track_name'));

                        setTimeout( function() {

                            self.init();

                        }, 800);

                    });

                })
                .fail(function (e) {

                    self.secureFormRequest(form, false);

                    Helpers.Nprogress.done();

                    Helpers.Error.show(e);

                });

        }

    });

})(
    jQuery,
    _,
    Q,
    Pt.Settings,
    Pt.Config,
    Pt.Rules,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    Pt.Services.Cms.WidgetService,
    _.clone(Pt.Controllers.AbstractController)
);

/**
 * Overview Controller
 * Created by isda on 15/12/2016.
 */


(function (
    $,
    _,
    Q,
    Managers,
    OverviewService,
    Settings,
    absCtrl
) {

    "use strict";

    _.Class( 'Pt.Controllers.BaseOverviewController', BaseOverviewController);

    /**
     * @namespace Pt.Controllers.BaseOverviewController
     * @constructor
     */
    function BaseOverviewController() {

        this.container = '[data-js=page-container]';
        this.overviewData = {};

    }

    BaseOverviewController.prototype = _.extend(absCtrl, {

        preRender: function () {

            var view = Managers.Template.get('aweb.overview');

            return this.render(this.container, view);

        },

        resolve: function (next) {

            this.preRender();

            var self = this;

            self.promises = [
                OverviewService.getProductOverview(),
                OverviewService.getSubAffiliates()
            ];

            Q.allSettled(self.promises).then( function ( res ) {

                self.overviewData = {
                    productOverview: res[0].state === 'fulfilled' ? res[0].value : {},
                    subAffiliatesOverview: res[1].state === 'fulfilled' ? res[1].value : {},
                    fixCurrency: 'USD'
                };

                next();

            }).fail( function (fail) {

                void 0;

            });

        },

        init: function () {

            if ( _.propertyValue(this.overviewData, 'productOverview.products' ) ) {

                this.overviewData.productOverview.products = this.categorizeProducts(this.overviewData.productOverview.products)

            }

            var productSummaryView = Managers.Template.get('aweb.products', this.overviewData);
            var subAffiliateSummaryView = Managers.Template.get('aweb.subSummary', this.overviewData);

            this.render('[data-js=product-summary]', productSummaryView)
                .render('[data-js=sub-affiliate-summary]', subAffiliateSummaryView);

        },

        categorizeProducts: function(products) {

            var categorizedProducts = [],
                settings = Settings.products_settings || {},
                order = settings.order || [],
                categories = settings.categories || {};

            categorizedProducts = _.map(order, function(orderItem) {

                return {
                    category: orderItem,
                    products: _.filter(products, function(product) {

                        return ( categories[orderItem] || [] ).indexOf(product.productCode) > -1;

                    })
                };

            });

            return _.filter(categorizedProducts, function(categorizedProductsItem) {

                return categorizedProductsItem.products.length;

            });

        }

    });

})(
    jQuery,
    _,
    Q,
    Pt.Managers,
    Pt.Services.Affiliates.OverviewService,
    Pt.Settings,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Tracking  Controller
 * Created by isda on 15/12/2016.
 */


(function (
    $,
    _,
    $q,
    Settings,
    Config,
    Rules,
    Helpers,
    Widgets,
    Managers,
    Services,
    absCtrl
) {

    "use strict";

    _.Class( 'Pt.Controllers.BaseTrackingController', BaseTrackingController);

    /**
     * @namespace Pt.Controllers.BaseTrackingController
     * @constructor
     */
    function BaseTrackingController() {

        this.validator = null;
        this.container = '[data-js=page-container]';
        this.trackingNames = [];

        this.form = "[data-js=affiliate-tracking-statistics-form]";
        this.el = {
            wrapper: '[data-js=tracking-wrapper]',
            reportWrapper: '[data-js=tracking-report-wrapper]',
            submit: '[data-js=tracking-submit]',
            code: '[data-js=tracking-code]',
            period: '[data-js=tracking-period]',
            sorting: '[data-js=tracking-sorting]',
            rangePickers: '[data-js=date-range-picker]',
            start: '[data-js=tracking-start-date]',
            end: '[data-js=tracking-end-date]',
            resultsTable: '[data-js=tracking-reports-table]'
        };

        this.startDate = null;
        this.endDate = null;
        this.sortBy = null;
        this.period = 'day';
        this.dateFormat = 'yyyy-mm-dd';
        this.actions = [
            [ this.el.submit, 'click', '_onFormSubmit'],
            [ this.el.period, 'change', '_periodHasChanged']
        ];
        this.trackingStatistics = null;


    }

    BaseTrackingController.prototype = _.extend(absCtrl, {

        preRender: function() {

            var view = Managers.Template.get('aweb.tracking');

            return this.render(this.container, view);

        },

        resolve: function (next) {

            this.preRender();
            var self = this;
            Helpers.Nprogress.start();
            Services.Affiliates.TrackingService.getTrackingNames()
                .then(function(data) {

                    self.trackingNames = data;

                })
                .fail(function() {

                    Helpers.Notify.error(_.trans('error.unknown_error_notification'));

                })
                .finally(function() {

                    next();
                    Helpers.Nprogress.done();

                });

        },

        init: function () {

            var form = Managers.Template.get('aweb.statisticsForm', { trackingNames: this.trackingNames });
            this.render(this.el.wrapper, form);

            if (this.validator !== null) {

                this.validator.destroy();
                this.validator = null;

            }

            this.validator = new Managers.Validation(this.form, Rules.validation.affiliate.trackingStatistics);

            this._bindEvents();
            this._bindDatePickers();

            this.validator
                .bindInput(true)
                .init();

        },

        _onFormSubmit: function (e) {

            e.preventDefault();

            var self = e.data.context;

            if ( $(self.el.period).val() == 0 ) {

                Helpers.RulesHelper.extendDateRangeRules(
                    $(self.el.start),
                    $(self.el.end),
                    Rules.validation.affiliate.trackingStatistics.endDate
                );

                self.validator.validate(self._onValidationSuccess, self);

            } else {

                self._onValidationSuccess(this, self);

            }

        },

        _onValidationSuccess: function(e, self) {

            var $this = $(this);
            var data = {
                startDate: self._getDate('start'),
                endDate: self._getDate('end'),
                sortBy: self._getValue('sorting'),
                trackCodeId: self._getValue('code')
            };

            $this.prop('disabled', true);
            Helpers.Nprogress.start();
            Services.Affiliates.TrackingService.getTrackingStatistics(data)
                .then(function(response) {

                    self.trackingStatistics = response;
                    self._renderReports();

                })
                .fail(function() {

                    Helpers.Notify.error(_.trans('errors.unknown_error_notification'));

                })
                .finally(function() {

                    $this.prop('disabled', false);
                    Helpers.Nprogress.done();

                });


        },

        _renderReports: function() {

            var view = Managers.Template.get('aweb.trackingReports', { stats: this.trackingStatistics });
            this.render(this.el.reportWrapper, view);

            if ( $(this.el.resultsTable).length ) {

                Helpers.DataTable.render(
                    this.el.resultsTable,
                    { fixedColumns: false }
                );

            }

        },

        _periodHasChanged: function(e) {

            var self = e.data.context;
            self.period = $(this).val();

            if ( 
                self.period !== '0' &&
                _.propertyValue(Rules, 'validation.affiliate.trackingStatistics.endDate.datetime')
            ) {

                delete Rules.validation.affiliate.trackingStatistics.endDate.datetime

            }
            
            self._toggleDatePickers();
            $(self.el.end).trigger('change');
            $(self.el.start).trigger('change');

        },

        _getDate: function(type) {

            var date;

            if ( this.period === "0" ) {

                return window.moment($(this.el[ type ]).val()).format(this.dateFormat.toUpperCase());

            }

            date = window.moment(window.moment()[ type + 'Of' ](this.period)._d);
            date = date.format(this.dateFormat.toUpperCase());

            return date;

        },

        _getValue: function(type) {

            return $(this.el[type]).val();

        },

        _toggleDatePickers: function() {

            var isDisabled = this.period !== "0",
                today = window.moment(new Date()),
                lastMonth = window.moment(new Date()).subtract(1, 'month');

            var defaultStart = isDisabled ? " " : lastMonth.format(this.dateFormat.toUpperCase()),
                defaultEnd = isDisabled ? " " : today.format(this.dateFormat.toUpperCase());

            $(this.el.start)
                .val(defaultStart)
                .prop('disabled', isDisabled );

            $(this.el.end)
                .val(defaultEnd)
                .prop('disabled', isDisabled );

            if ( ! isDisabled ) {

                $(this.el.start).datepicker('update', defaultStart);
                $(this.el.end).datepicker('update', defaultEnd);
                $(this.el.rangePickers).data().datepicker.updateDates();

            }

        },

        _bindDatePickers: function() {

            Helpers.DatePicker.activate($(this.el.rangePickers), {
                format: this.dateFormat,
                startDate: window.moment(new Date()).subtract(6, 'months')._d,
                endDate: new Date(),
                todayHighlight: true,
                toggleActive: false,
                language: Managers.Cookie.get('lang')
            }, Config.datePickerLocale[Managers.Cookie.get('lang')]);

        }


    });

})(
    jQuery,
    _,
    Q,
    Pt.Settings,
    Pt.Config,
    Pt.Rules,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 *  BaseReportsController
 */


(function (
    $,
    _,
    $q,
    Settings,
    Config,
    Rules,
    Helpers,
    Widgets,
    Managers,
    Services,
    Router,
    absCtrl
) {

    "use strict";

    _.Class( 'Pt.Controllers.BaseReportsController', BaseReportsController);

    /**
     * @namespace Pt.Controllers.BaseReportsController
     * @memberOf Pt.Controllers
     * @constructor
     */
    function BaseReportsController() {

        this.validator = null;
        this.container = '[data-js=page-container]';
        this.months = null;
        this.fromRoute = false;
        this.el = {
            reportType: '[data-js=report-type]',
            selection: '[data-js=report-month-selection]',
            getReportBtn: '[data-js=get-reports]',
            wrapper: '[data-js=report-wrapper]',
            reportSummary: '[data-js=product-report-summary]'
        };

        this.serviceMapping = {

            commissions: {
                service: 'getCommissions',
                route: 'commissions'
            },
            memberProfile: {
                service: 'getMemberProfileSummary',
                dataTable: true,
                route: 'member-profile'
            },
            winLoss: {
                service: 'getProductReports',
                dataTable: true,
                route: 'win-loss'
            },
            payments: {
                service: 'getPaymentReport',
                dataTable: true,
                route: 'payments'
            },
            productSummaries: {
                service: 'getProductSummaries',
                dataTable: true,
                route: 'product-summary'
            }

        };

        this.fetching = false;
        this.actions = [
            [ this.el.getReportBtn, 'click', '_getReports'],
            [ this.el.reportSummary, 'click', '_getProductReportSummary']
        ];

        this.popoverOptions = {
            html: true,
            trigger: "focus",
            placement: 'bottom',
            container: '[data-js=winLoss]'
        };

    }

    BaseReportsController.prototype = _.extend(absCtrl, {

        resolve: function(next) {

            var self = this;
            Services.Affiliates.ReportsService.getMonthSelection()
                .then(function(response) {

                    self.months = response;
                    self.payoutFrequency = response[0] ? 
                        response[0].payoutFrequency : 
                        'Monthly';

                })
                .fail(function() {

                    self.months = [];

                })
                .finally(function() {

                    next();

                });

        },

        init: function() {

            var view = Managers.Template.get('aweb.reports', { months: this.months });
            this.render(this.container, view);
            this._bindEvents()
                ._invokeRouteBaseHandler()
            ;


        },

        _invokeRouteBaseHandler: function() {

            var monthSelections = $(this.el.selection).find('option').length;

            if ( ! _.isUndefined( Router.getContext().params.type ) && monthSelections > 0 ) {

                $(this.el.getReportBtn).trigger('click');

            }

        },

        _getReportType: function() {

            var type = $(this.el.reportType).val();

            var typeFromRoute = Router.getContext().params.type;

            if ( ! _.isUndefined( typeFromRoute ) ) {

                return _.toCamelCase( _.toSnakeCase( typeFromRoute.replace( '-', ' ' ) ) );

            }

            return type;

        },

        _getReports: function(e) {

            var self = e.data.context;
            var date = $(self.el.selection).val();
            var type = self._getReportType();

            if ( _.has(self.serviceMapping, type) ) {

                self._callService({
                    data: {
                        date: date,
                        payoutFrequency: self.payoutFrequency
                    },
                    service: type
                }, function(reports) {

                    self._renderReports({
                        type: type,
                        reports: reports
                    });

                });

                return false;

            }

            Helpers.Notify.error(_.trans('errors.unknown_error_notification'));


        },

        _renderReports: function(report) {

            var template = 'aweb.' + report.type;
            var view = Managers.Template.get(template, { reports: report.reports });
            this.render(this.el.wrapper, view);
            this._bindPopOverToggle();

            if ( this.serviceMapping[report.type].dataTable ) {

                if ( $('[data-js=' + report.type + ']').length ) {

                    this.dTableInstance = Helpers.DataTable.render(
                        '[data-js=' + report.type + ']',
                        { fixedColumns: false }
                    );

                    // modify search bar
                    if ( $(this.dTableInstance.wrapper) && $(this.dTableInstance.wrapper).find('.dataTable-search input').length ) {

                        var search = $(this.dTableInstance.wrapper).find('.dataTable-search input');

                        search
                            .addClass('form-control inline')
                            .attr('placeholder', '')
                            .before('<label>' + _.trans('global.label_search') + '</label>');

                    }

                }

            }
        },

        _callService: function(report, cb) {

            var service = Services.Affiliates.ReportsService;
            Helpers.Nprogress.start();
            service[this.serviceMapping[report.service].service ](report.data)
                .then(function(reports) {

                    cb(reports);

                })
                .fail(function(e) {

                    Helpers.Error.show(e);

                })
                .finally(function() {

                    Helpers.Nprogress.done();

                });

        },

        _getProductReportSummary: function(e) {

            e.preventDefault();
            var self = e.data.context;
            var data = $(this).data();
            var view = Managers.Template.get('aweb.detailedReport', { type: 'popover', reports: [] });
            var $this = $(this);

            var pops = $this.popover( _.extend( self.popoverOptions, {

                content: Managers.Template.get('aweb.detailedReport', { type: 'loader', reports: [] }),
                template: view

            }));

            pops.popover('toggle');

            var $contentWrapper = $('#' + $this.attr('aria-describedby')).find('[data-js=popover-content]');

            Services.Affiliates.ReportsService.getProductDetailedReport({
                memberCode: $this.data().memberCode,
                productCode: $this.data().productCode,
                date:  $(self.el.selection).val(),
                payoutFrequency: self.payoutFrequency
            }).then(function(response) {


                var contentView = Managers.Template.get('aweb.detailedReport', { type: 'content', reports: response });
                self.render($contentWrapper, contentView);

            }).fail(function(e) {

                Helpers.Error.show(e);

            });

        },

        _bindPopOverToggle: function () {

            /**
             * Bind event on body to enable
             * auto close of popover windows.
             */
            $('body').on('click', function (e) {

                $('[data-toggle="popover"]').each(function () {

                    if ( ! $(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {

                        $(this).popover('hide');

                    }

                });

            });

        }

    });

})(
    jQuery,
    _,
    Q,
    Pt.Settings,
    Pt.Config,
    Pt.Rules,
    Pt.Helpers,
    Pt.Widgets,
    Pt.Managers,
    Pt.Services,
    Pt.Core.Router,
    _.clone(Pt.Controllers.AbstractController)
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

(function (
    $,
    _,
    Managers,
    Services,
    Helpers,
    Config,
    absCtrl
) {

    "use strict";

    _.Class('Pt.Controllers.DownlineManagementController', DownlineManagementController);

    function DownlineManagementController() {

        this.container = '[data-js=page-container]';
        this.downlineContainer = '[data-js=downline-container]';
        this.rangePickers = '[data-js=input-daterange]';
        
    }

    DownlineManagementController.prototype = _.extend({}, absCtrl, {

        resolve: function(next, requestContext) {

            var self = this;
            var view = Managers.Template.get('aweb.downlineDisabled');

            Services.Affiliates.DownlineService.getStatus().then(function(isEnabled) {

                if ( isEnabled ) {

                    view = Managers.Template.get('aweb.downline', {
                        activePage: requestContext.path
                    });

                }

            }).fail(function(fail) {

                void 0;

            }).finally(function() {

                self.render(self.container, view);
                next();

            });

        },

        initDatepickers: function() {

            Helpers.DatePicker.activate($(this.rangePickers), {
                format: "yyyy-mm-dd",
                todayHighlight: true,
                toggleActive: false,
                endDate: new Date(),
                language: Managers.Cookie.get('lang')
            }, Config.datePickerLocale[Managers.Cookie.get('lang')]);

            return this;

        },

        initDatatable: function() {

            if ( $(this.resultsTable).length ) {

                this.datatableInstance = Helpers.DataTable.render(
                    this.resultsTable,
                    { fixedColumns: false }
                );

            }

        }

    }, Pt.Core.Extend('Controllers.DownlineManagementController'));

})(
    jQuery,
    _,
    Pt.Managers,
    Pt.Services,
    Pt.Helpers,
    Pt.Config,
    Pt.Controllers.AbstractController
);


(function (
    $,
    _,
    Managers,
    Helpers,
    Rules,
    Services,
    downlineController
) {

    "use strict";

    _.Class('Pt.Controllers.DownlineAffiliateMemberController', AffiliateMemberController);

    function AffiliateMemberController() {
        
        this.form = '[data-js=downline-search-form]';
        this.resultsContainer = '[data-js=downline-search-result]';
        this.resultsTable = '[data-js=downline-search-result-table]';
        this.topupModalButton = '[data-js=btn-top-up-modal]';
        this.topupForm = '[data-js=downline-topup-form]';

        this.actions = [
            [ this.form, 'submit', 'onFormSubmit' ],
            [ this.topupForm, 'submit', 'onTopupFormSubmit' ],
            [ this.topupModalButton, 'click', 'onTopupModalButtonClick' ]
        ];

        this.searchResults = [];
        this.parentBalance = 0;
        
    }

    AffiliateMemberController.prototype = _.extend({}, new downlineController, {

        init: function() {

            var view = Managers.Template.get('aweb.downlineAffiliateMember');

            this.render(this.downlineContainer, view)
                .initForm()
                ._bindEvents();

        },

        initForm: function() {

            this.initDatepickers()
                .initValidator();

            return this;

        },

        initValidator: function() {

            this.validator = new Managers.Validation(
                this.form, 
                Rules.validation.affiliate.downlineSearch
            );

            this.validator.bindInput(true).init();

            return this;

        },

        onFormSubmit: function(e) {

            e.preventDefault();
            var self = e.data.context;
            self.validator.validate(self.onValidationSuccess, self);

        },

        onValidationSuccess: function(data, self) {

            var form = $(this.form);

            self.secureFormRequest(form, true);
            Helpers.Nprogress.start();
            Helpers.Preloader.basic(self.resultsContainer);

            var view = Managers.Template.get('aweb.downlineAffiliateMemberResult', {
                downlines: [],
                type: ''
            });

            Services.Affiliates.DownlineService.search(data).then(function(res) {

                self.searchResults = res || [];
                self.downlineType = _.getFormValue(data, 'type');

                view = Managers.Template.get('aweb.downlineAffiliateMemberResult', {
                    downlines: self.searchResults,
                    type: self.downlineType
                });

            }).fail(function(fail) {

                Helpers.Error.show(fail);

            }).finally(function() {

                Helpers.Nprogress.done();
                self.secureFormRequest(form, false, false);
                self.render(self.resultsContainer, view);
                self.initDatatable();

            });

        },

        onTopupModalButtonClick: function(e) {

            e.preventDefault();

            var self = e.data.context;
            var id = $(this).data('id');

            if ( id ) {

                Helpers.Nprogress.start();

                Services.Affiliates.FundsService.getBalance(true).then(function(res) {

                    var view = Managers.Template.get('aweb.downlineTopupModal', {
                        downline: _.findWhere(self.searchResults, { id: id }),
                        balance: res.balance,
                        downlineType: self.downlineType
                    });
                    self.parentBalance = res.balance;
                    self.topupModal = Helpers.Modal.generic(view);
                    self.initTopupForm();

                }).fail(function(fail) {

                    Helpers.Error.show(fail);

                }).finally(function() {

                    Helpers.Nprogress.done();

                });

            }

        },

        initTopupForm: function() {

            this.initTopupFormValidator()
                ._bindEvents();

        },

        initTopupFormValidator: function() {

            Rules.validation.affiliate.topup.amount.numericality.lessThanOrEqualTo = this.parentBalance;

            this.topupValidator = new Managers.Validation(
                this.topupForm, 
                Rules.validation.affiliate.topup
            );

            this.topupValidator.bindInput(true).init();

            return this;

        },

        onTopupFormSubmit: function(e) {

            e.preventDefault();
            var self = e.data.context;
            self.topupValidator.validate(self.onTopupValidationSuccess, self);

        },

        onTopupValidationSuccess: function(data, self) {

            var form = $(this.topupForm);

            self.secureFormRequest(form, true);
            Helpers.Nprogress.start();

            Services.Affiliates.FundsService.topup(data).then(function(res) {

                Helpers.Notify.success(_.trans('affiliate.notify_topup_successful'));
                
                setTimeout(function() {

                    self.topupModal.modal('hide');

                }, 1500);

                self.secureFormRequest(form, false, true);

            }).fail(function(fail) {

                Helpers.Error.show(fail);
                self.secureFormRequest(form, false, false);

            }).finally(function() {

                Helpers.Nprogress.done();

            });

        }

    }, Pt.Core.Extend('Controllers.DownlineAffiliateMemberController'));

})(
    jQuery,
    _,
    Pt.Managers,
    Pt.Helpers,
    Pt.Rules,
    Pt.Services,
    Pt.Controllers.DownlineManagementController
);


(function (
    $,
    _,
    $q,
    Managers,
    Services,
    Settings,
    downlineController
) {

    "use strict";

    _.Class('Pt.Controllers.DownlineCreateAffiliateController', CreateAffiliateController);

    function CreateAffiliateController() {
        
    }

    CreateAffiliateController.prototype = _.extend({}, new downlineController, {

        init: function() {

            var signupController = new Pt.Controllers.SignupController();
            signupController.container = this.downlineContainer;
            signupController.referralId = Settings.affiliate.id;
            signupController.isDownlineSignup = true;
            signupController.init = signupController.init.bind(signupController);
            signupController.resolve(signupController.init);

        }

    }, Pt.Core.Extend('Controllers.DownlineCreateAffiliateController'));

})(
    jQuery,
    _,
    Q,
    Pt.Managers,
    Pt.Services,
    Pt.Settings,
    Pt.Controllers.DownlineManagementController
);


(function (
    $,
    _,
    Managers,
    Settings,
    downlineController
) {

    "use strict";

    _.Class('Pt.Controllers.DownlineCreateMemberController', CreateMemberController);

    function CreateMemberController() {
        
    }

    CreateMemberController.prototype = _.extend({}, new downlineController, {

        init: function() {

            var signupWidget = _.clone(Pt.Widgets.Signup);
            signupWidget.signupFormContainer = this.downlineContainer;
            signupWidget.referralId = Settings.affiliate.id;
            signupWidget.isDownlineSignup = true;
            signupWidget.activate();

        }

    }, Pt.Core.Extend('Controllers.DownlineCreateMemberController'));

})(
    jQuery,
    _,
    Pt.Managers,
    Pt.Settings,
    Pt.Controllers.DownlineManagementController
);


(function (
    $,
    _,
    Managers,
    downlineController
) {

    "use strict";

    _.Class('Pt.Controllers.DownlineInviteAffiliateController', InviteAffiliateController);

    function InviteAffiliateController() {
        
    }

    InviteAffiliateController.prototype = _.extend({}, new downlineController, {

        init: function() {

            var SubAffiliateController = new Pt.Controllers.SubAffiliateController();
            SubAffiliateController.wrapper = this.downlineContainer;
            SubAffiliateController.isDownlineInvite = true;
            SubAffiliateController.init();

        }

    }, Pt.Core.Extend('Controllers.DownlineInviteAffiliateController'));

})(
    jQuery,
    _,
    Pt.Managers,
    Pt.Controllers.DownlineManagementController
);


(function (
    $,
    _,
    Managers,
    Helpers,
    Rules,
    Services,
    downlineController
) {

    "use strict";

    _.Class('Pt.Controllers.DownlineTopupHistoryController', TopupHistory);

    function TopupHistory() {
        
        this.form = '[data-js=topup-history-form]';
        this.resultsContainer = '[data-js=topup-history-result]';
        this.resultsTable = '[data-js=topup-history-result-table]';

        this.actions = [
            [ this.form, 'submit', 'onFormSubmit' ]
        ];
        
    }

    TopupHistory.prototype = _.extend({}, new downlineController, {

        init: function() {

            var view = Managers.Template.get('aweb.downlineTopupHistory');

            this.render(this.downlineContainer, view)
                .initForm()
                ._bindEvents();

        },

        initForm: function() {

            this.initDatepickers()
                .initValidator();

            return this;

        },

        initValidator: function() {

            this.validator = new Managers.Validation(
                this.form, 
                Rules.validation.affiliate.topupHistory
            );

            this.validator.bindInput(true).init();

            return this;

        },

        onFormSubmit: function(e) {

            e.preventDefault();
            var self = e.data.context;
            self.validator.validate(self.onValidationSuccess, self);

        },

        onValidationSuccess: function(data, self) {

            var form = $(this.form);

            self.secureFormRequest(form, true);
            Helpers.Nprogress.start();
            Helpers.Preloader.basic(self.resultsContainer);

            var view = Managers.Template.get('aweb.downlineTopupHistoryResult', {
                history: []
            });

            Services.Affiliates.DownlineService.getTopupHistory(data).then(function(res) {

                self.history = res || [];

                self.history.sort(function(a, b) {

                    return new Date(b.createdAt) - new Date(a.createdAt);

                });

                view = Managers.Template.get('aweb.downlineTopupHistoryResult', {
                    history: self.history,
                    type: _.getFormValue(data, 'type')
                });

            }).fail(function(fail) {

                Helpers.Error.show(fail);

            }).finally(function() {

                Helpers.Nprogress.done();
                self.secureFormRequest(form, false, false);
                self.render(self.resultsContainer, view);
                self.initDatatable();

            });

        },

    }, Pt.Core.Extend('Controllers.DownlineTopupHistoryController'));

})(
    jQuery,
    _,
    Pt.Managers,
    Pt.Helpers,
    Pt.Rules,
    Pt.Services,
    Pt.Controllers.DownlineManagementController
);

(function(
    Settings,
    Router,
    absCtrl
) {

    "use strict";

    _.Class('Pt.Controllers.TrackController', TrackController);

    function TrackController() {

    }

    TrackController.prototype = _.extend(absCtrl, {

        init: function() {

            var defaultMemberDomain = location.host.replace('affiliate.', '');
            var domainMapList = _.propertyValue(Settings, 'domain.affiliatesite') || [];
            var domainObj = _.findWhere(domainMapList, { affiliate_domain: location.host }) || {};
            var memberDomain = domainObj.member_domain || defaultMemberDomain;
            var redirectUrl = location.href.replace(location.host, memberDomain);

            redirectUrl = redirectUrl.replace('track/', '');

            Router.redirect(redirectUrl);

        }

    });

})(
    Pt.Settings,
    Pt.Core.Router,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Created by jomaf - Joseph John Fontanilla
 * Date: 5/24/19
 * Time: 1:38 PM
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
        this.detailsContainer = '[data-js=promotion-details-container]';

        this.inProgress = false;
        this.currentCategory = null;
        this.categories = [];
        this.promotions = [];
        this.promoWidget = {};
        this.selectedPromotion = null;
        this.promoName = _.getParameterByName('promo');
        this.site = 'affiliate';
        this.actions = [];

        this.cardTimeTicker = false;
        this.cardTimeIntervals = [];

    }

    BasePromoController.prototype = _.extend(absCtrl, {

        resolve: function (next, requestContext) {

            //noinspection JSUnresolvedVariable
            this.currentCategory = requestContext.params.category || null;
            this.promoId = requestContext.params.promoId || null;


            var self = this;
            var promises = [
                Services.Cms.PromotionService.getPromotionsCategory(this.site),
                Services.Cms.PromotionService.getPromotions(this.currentCategory, this.site),
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
            var view = '';
            if( ! _.isNull(this.promoId) ) {

                var promoDetails = _.findWhere(this.promotions, { hashId: this.promoId });
                var promoDuration = promoDetails.getPromoDuration();

                this.container = this.detailsContainer;

                view = Managers.Template.get('aweb.promoDetails', {
                    isLoggedIn: Settings.affiliate.isLoggedIn,
                    promoDetails: promoDetails,
                    duration: promoDuration
                });

                this.render(this.container, view)
                    ._bindEvents();
                this._startTicker(promoDuration);

            } else {
                var hide = this.promoWidget.hide_in_affiliate_site === '1';

                view = Managers.Template.get('aweb.promo', {

                    isLoggedIn: Settings.affiliate.isLoggedIn,
                    promos: this.promotions,
                    currentCategory: this.currentCategory,
                    categories: this.categories,
                    promoWidget: hide ? {} : this.promoWidget

                });

                this.render(this.container, view)
                    ._bindEvents();
            }


        },

        _startTicker: function (duration) {

            var self = this;

            var dateVariants = [
                'months', 'days', 'hours', 'minutes', 'seconds'
            ];

            $('[data-js=promotion-image]').on('load', function () {

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

                view = Managers.Template.get('aweb.articleDetails', {
                    isLoggedIn: Settings.affiliate.isLoggedIn,
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

            view = Managers.Template.get('aweb.article', {

                isLoggedIn: Settings.affiliate.isLoggedIn,
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
            var view = Managers.Template.get('aweb.articleCards', {
                articles: articles,
                currentCategory: self.currentCategory,
                categories: self.categories,
                route: self.route
            });

            self.render(self.cardsContainer, view);

            if ( ! _.isEmpty(self.currentCategory) && self.articles.length > limit) {
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

            view = Managers.Template.get('aweb.articleSearch', {

                isLoggedIn: Settings.affiliate.isLoggedIn,
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


/***********************
 * AFFILIATE FUNDS CONTROLLER
 ***********************/


(function(RulesHelper, Validator) {

    _.Class('Pt.Deposit.DepositGatewayFactory', new DepositGatewayFactory());

    function DepositGatewayFactory() {

        var gatewayMap = {
            110101: 'OfflineDeposit',
            110310: 'CreditCardDeposit',
            120254: 'SdaPayDeposit',
            120244: 'DaddyPayQr',
            120241: 'YeePayCard',
            120214: 'NetellerDeposit',
            1204131: 'AlipayTransferDeposit',
            1204628: 'WeChatQRDeposit',
            1204373: 'UnionPayTransferDeposit'
        };

        var configMap = {
            110101: 'offline_deposit',
            110310: 'credit_card',
            120254: 'basic', 
            120244: 'daddypay_qr',
            120241: 'yeepay_card',
            120214: 'neteller',
            1204131: 'alipay_transfer',
            1204628: 'qr_wechat',
            1204373: 'transfer_unionpay'
        };

        return {
            make: _make,
            getMethodName: _getMethodName,
            makeByMethod: _makeByMethod
        };

        function _make(depositMethodId) {

            var gatewayName = gatewayMap[depositMethodId];

            if (gatewayName) {

                return new Pt.Deposit[gatewayName]();

            }

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

                }

                if ( Pt.Rules.validation.deposit[gatewayName] ) {

                    RulesHelper.extendDepositAmountRules(
                        gatewayName,
                        depositMethod.getMinimumAmount(),
                        depositMethod.getMaximumAmount(),
                        'affiliate'
                    );

                }

                var depositValidator = new Validator(
                    gateway.form, 
                    RulesHelper.getMethodRules(gatewayName, 'deposit', 'affiliate')
                );
                
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

(function (
    $,
    _,
    Managers,
    Services,
    Helpers,
    absCtrl
) {

    "use strict";

    _.Class( 'Pt.Controllers.FundsManagementController', FundsManagementController);

    function FundsManagementController() {

        this.container = '[data-js=page-container]';
        this.fundsContainer = '[data-js=funds-container]';
        this.balanceContainer = '[data-js=balance-container]';
        this.balanceRefreshContainer = '[data-js=balance-refresh-container]';
        this.btnRefreshBalance = '[data-js=balance-refresh]';
        this.balanceObj = {};
        this.currentContext = null;

        this.actions = [
            [ this.btnRefreshBalance, 'click', 'onRefreshBalanceClick' ]
        ];

    }

    FundsManagementController.prototype = _.extend(absCtrl, {

        resolve: function(next, requestContext) {

            var self = this;
            var view = Managers.Template.get('aweb.downlineDisabled');
            this.currentContext = requestContext;
            
            Services.Affiliates.DownlineService.getStatus().then(function(isEnabled) {

                if ( isEnabled ) {

                    view = Managers.Template.get('aweb.funds', {
                        activePage: requestContext.path
                    });

                    self.getBalance();

                }

            }).fail(function(fail) {

                void 0;

            }).finally(function() {

                self.render(self.container, view);
                next();

            });

        },

        getBalance: function(refresh) {

            var self = this;
            var balanceView = Managers.Template.get('aweb.fundsBalance', {
                balanceObj: self.balanceObj
            });

            Services.Affiliates.FundsService.getBalance(refresh).then(function(res) {

                self.balanceObj = res;
                balanceView = Managers.Template.get('aweb.fundsBalance', {
                    balanceObj: self.balanceObj
                });

            }).fail(function(fail) {

                void 0;

            }).finally(function() {

                self.render(self.balanceContainer, balanceView);

            });

        },

        onRefreshBalanceClick: function(e) {

            e.preventDefault();
            var self = e.data.context;
            Helpers.Preloader.small(self.balanceRefreshContainer);
            self.getBalance(true);

        }

    }, Pt.Core.Extend('Controllers.FundsManagementController'));

})(
    jQuery,
    _,
    Pt.Managers,
    Pt.Services,
    Pt.Helpers,
    _.clone(Pt.Controllers.AbstractController)
);


(function (
    $,
    _,
    $q,
    Config,
    Managers,
    $tpl,
    FundsService,
    GatewayFactory,
    Router,
    Preloader,
    fundsController
) {

    "use strict";

    _.Class( 'Pt.Controllers.DepositController', DepositController);

    function DepositController() {

        this.container = '[data-js=page-container]';
        this.depositMethods = [];
        this.depositChannels = Config.depositChannels;
        this.depositFormContainer = "[data-js=deposit-form-container]";
        this.currentDepositGateway = {};
        this.currentDepositMethod = {};
        this.currentMethodId = '';
        this.form = 'form[data-js=deposit-form]';
        this.depositMethodNav = '[data-js="deposit-method-nav"]';
        this.validator = null;
        this.banks = [];

        this.actions = _.union(this.actions, [
            [ this.form, 'submit', 'submitDepositForm'],
        ]);

    }

    DepositController.prototype = _.extend({}, new fundsController, {

        init: function(next) {

            var self = this;

            var requests = [
                FundsService.getDepositMethods()
            ];

            $q.all(requests).then(function(data) {

                self.depositMethods = data[0];

            }).finally(function() {
                    
                self.initDeposit();

            });

        },

        initDeposit: function() {

            if ( this.depositMethods.length ) {

                this.currentMethodId = this.currentContext.params.method;

                if ( _.isEmpty(this.currentMethodId) ) {
                
                    this.currentMethodId = this.depositMethods[0].id;

                }

                this.setDepositMethod(parseInt(this.currentMethodId))
                    .render(this.fundsContainer, this.getPreparedView())
                    .initGateway();

            } else {

                var view = Managers.Template.get('aweb.depositNoActive');
                this.render(this.fundsContainer, view);

            }

        },

        setDepositMethod: function(methodId) {

            this.currentDepositMethod = _.findWhere(this.depositMethods, { id: methodId });;

            return this;
            
        },

        initGateway: function() {

            this.currentDepositGateway = GatewayFactory.makeByMethod(
                this.currentDepositMethod
            )

            return this;

        },

        submitDepositForm: function(e) {

            e.preventDefault();
            var self = e.data.context;
            var frm = $(this);
            var bankAccountName = frm.find('#bankAccountName');

            bankAccountName.val(bankAccountName.val().trim());
            self.validator.validate(self._onValidationSuccess, self, false);

        },

        getPreparedView: function() {

            var depositNavigation = $tpl.get('aweb.depositNavigation',{
                depositMethods: this.depositMethods,
                currentMethod: this.currentMethodId
            });

            return $tpl.get('aweb.fundsDeposit',{
                depositNavigation: depositNavigation,
            });

        },

        getDepositSettingsTpl: function() {

            return $tpl.get('aweb.depositSettings', {
                depositMethod: this.depositMethod
            });

        },

        addCsfValidations: function (self, processType) {

            var csfValidations = {};

            if (self.depositMethod.hasFormFields()) {

                Pt.Rules.validation.affiliate.deposit['old_' + processType] = 
                    _.clone(Pt.Rules.validation.affiliate.deposit[processType]);

                _.each(self.depositMethod.formFields, function (field) {

                    csfValidations[field.fieldName] = {};

                    var ruleDefinition;

                    if ( !_.isEmpty(field.validationRules) ) {

                        _.each(field.validationRules, function (rule) {

                            ruleDefinition = rule.split(':');

                            if (_.size(ruleDefinition) === 1) {

                                csfValidations[field.fieldName][rule] = {
                                    message: "^" + _.trans('errors.csf_basic_' + rule)
                                };

                                return;

                            }

                            try {

                                var validationName = ruleDefinition[0];

                                if ( _.isFunction(Pt.Rules.provider[validationName]) ) {

                                    var args = ruleDefinition.splice(1);

                                    args.push(field.fieldName);
                                    csfValidations[field.fieldName][validationName] = Pt.Rules.provider[validationName](args);

                                }


                            } catch (e) {

                                void 0;

                            }

                        });

                    } else {

                        if ( Pt.Rules.validation.affiliate.deposit['old_' + processType] ) {

                            Pt.Rules.validation.affiliate.deposit[processType] = 
                                _.clone(Pt.Rules.validation.affiliate.deposit['old_' + processType]);

                        }

                    }

                });

                _.extend(Pt.Rules.validation.affiliate.deposit[processType], csfValidations);
                self.validator.setRules(Pt.Rules.validation.affiliate.deposit[processType]);

            } else {

                if (Pt.Rules.validation.affiliate.deposit['old_' + processType]) {

                    Pt.Rules.validation.affiliate.deposit[processType] = 
                        _.clone(Pt.Rules.validation.affiliate.deposit['old_' + processType]);
                    self.validator.setRules(Pt.Rules.validation.affiliate.deposit[processType]);

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

    }, Pt.Core.Extend('Controllers.DepositController'));

})(
    jQuery,
    _,
    Q,
    Pt.Config,
    Pt.Managers,
    Pt.Managers.Template,
    Pt.Services.Affiliates.FundsService,
    Pt.Deposit.DepositGatewayFactory,
    Pt.Core.Router,
    Pt.Helpers.Preloader,
    Pt.Controllers.FundsManagementController
);

(function (
    $,
    $q,
    moment,
    Settings,
    Managers,
    $tpl,
    DatePicker,
    TimePicker,
    $nProg,
    Notify,
    Form,
    ErrorHandler,
    DepositController,
    FundsService,
    Config
) {

    /**
     * @namespace OfflineDeposit
     * @memberOf Pt.Deposit
     * @constructor
     */
    _.Class('Pt.Deposit.OfflineDeposit', OfflineDeposit);

    function OfflineDeposit() {

        this.systemBankAccountRadio = '[data-js=system-bank-account-radio]';
        this.systemBankDetailsContainer = '[data-js=system-bank-details-container]';
        this.inputFileUploadSelector = '[data-js=deposit-file]';
        this.fileNameDisplaySelector = '[data-js=offline-deposit-file-name]';
        this.depositDate = '[data-js="depositDate"]';
        this.depositTime = '[data-js="depositTime"]';
        
        this.systemBankAccounts = [];
        this.depositMethod = {};
        
        this.actions = _.union(this.actions, [
            ['[data-js="bankCode"]','change','changeBankAccount'],
            [ this.inputFileUploadSelector, 'change', '_onFileChange'],
            [ '[data-js=offline-deposit-upload-file]', 'click', '_onFileUploadBtnClick'],
            [ this.systemBankAccountRadio, 'change', 'onSystemBankAccountRadioChange' ]
        ]);

    }

    OfflineDeposit.prototype = _.extend({}, new DepositController, {
        
        init: function(method, validator) {

            var self = this;

            this.depositMethod = method;
            this.validator = validator;

            var requests = [
                FundsService.getBanks(),
                FundsService.getSystemBanksAccounts()
            ];

            $q.all(requests).then(function(data) {

                self.banks = data[0];
                self.systemBankAccounts = data[1];

            }).finally(function() {
                
                self.displayForm()
                    .validator
                    .bindInput(true)
                    .shouldSerialize(false)
                    .init();

                self.initForm()
                    ._bindEvents();

            });

        },

        displayForm: function() {

            var depositView = $tpl.get('aweb.offlineDeposit', {
                depositSettings: this.getDepositSettingsTpl(),
                systemBankAccounts: this.getSystemBanksTpl(),
                depositChannels: this.depositChannels,
                banks: this.banks
            });

            this.render(this.depositFormContainer, depositView);

            $('[data-toggle=tooltip]').tooltip({ html: true });

            return this;

        },

        getSystemBanksTpl: function() {

            return $tpl.get('aweb.offlineSystemBanks', {
                systemBankAccounts: this.systemBankAccounts,
                systemBankDetails: this.getSystemBankDetailsTpl()
            });

        },

        getSystemBankDetailsTpl: function(systemBankAccount) {

            return $tpl.get('aweb.offlineSystemBankDetails', {
                systemBankAccount: systemBankAccount || 
                    ( this.systemBankAccounts.length ? this.systemBankAccounts[0] : {} )
            });

        },

        initForm: function() {

            this.initFieldSettings();

            DatePicker.activate(this.depositDate, {
                format: "yyyy-mm-dd",
                endDate: moment(new Date())._d,
                language: Managers.Cookie.get('lang')
            }, Config.datePickerLocale[Managers.Cookie.get('lang')]);

            TimePicker.activate(this.depositTime, {
                defaultTime: false,
                showMeridian: false,
                minuteStep: 1,
                showInputs:false
            });

            return this;

        },

        initFieldSettings: function() {

            var self = this;
            var fieldSettings = _.propertyValue(
                this.depositMethod, 
                'customFields.fieldSettings'
            ) || [];

            _.each(fieldSettings, function(field) {

                var $field = $("[data-js=" + field.name + "]");

                if ( ! _.isEmpty(field.defaultValue) ) {

                    if ( field.inputType ) {

                        $field.attr("type", field.inputType);

                    }

                    $field.val(field.defaultValue);

                    if ( ! _.isEmpty($field.defaultValue) ) {

                        $field.change();

                    }

                }

                var rules = self.validator.getRules();

                if ( ! field.shouldDisplay ) {

                    $field.closest(".form-group").hide();

                    if ( rules[$field.attr('name')] ) {

                        delete rules[$field.attr('name')];

                    }

                }
                
                self.validator.setRules(rules);

            });

            return this;

        },

        _onFileChange: function(e) {

            var self = e.data.context;
            $(self.fileNameDisplaySelector).val($(self.inputFileUploadSelector).val().split('\\').pop());

        },

        _onFileUploadBtnClick: function (e) {

            var self = e.data.context;

            $(self.inputFileUploadSelector).trigger('click');

        },

        changeBankAccount: function(e){

            var bankAccountOptions = $(this);
            var bankNameNative = bankAccountOptions.find(':selected').data('bank-name-native');

            $('[data-js="bank-name-native-container"]')
                .find('input')
                .val(bankNameNative);

        },

        _onValidationSuccess: function (data, context) {

            var self = context;
            var file = null;
            var bankCode = data.get('bankCode');
            var bank = _.findWhere(self.banks, { bankCode: bankCode }) || {};
            var depositTime = data.get('depositTime') || moment().format("HH:mm:ss");
            var depositDate = data.get('depositDate') || moment().format("YYYY-MM-DD");
            var bankTransferDate = moment(depositDate + ' ' + depositTime ).format("YYYY-MM-DD HH:mm:ss+08:00");

            try {

                file = $('[data-js=deposit-file]')[0].files[0];

            } catch (e) {}

            data.set('bankName', bank.bankName);
            data.set('bankTransferDate', bankTransferDate);

            if (bankCode !== 'OTHER' || ! data.get('bankNameNative')) {

                data.set('bankNameNative', bank.bankNativeName);

            }

            if (file) {

                data.set('depositFile', file);

            }

            $nProg.start();
            Form.lockForm(self.form, true);

            FundsService.createOfflineTransaction(
                self.depositMethod.id,
                data.toFormData()
            ).then(function(response) {
                    
                Notify.success(
                    _.str_replace_key({
                        ':transactionId': response.invId
                    }, _.trans('funds.success_message_offline_deposit'))
                );

                self._resetForm(self.form);

            }).fail(function(errors) {

                ErrorHandler.show(errors);

            }).finally(function() {

                Form.lockForm(self.form, false);
                $nProg.done();

            });

        },

        _resetForm: function (form) {

            $(form)[0].reset();

            this._setDefaultValues();

        },

        _setDefaultValues: function(){

            this.initFieldSettings();

        },

        onSystemBankAccountRadioChange: function(e) {

            var self = e.data.context;
            var id = parseInt($(this).val());

            self.render(self.systemBankDetailsContainer, self.getSystemBankDetailsTpl(
                _.findWhere(self.systemBankAccounts, { accountId: id })
            ));

        }

    }, Pt.Core.Extend('Deposit.OfflineDeposit'));

})(
    jQuery,
    Q,
    moment,
    Pt.Settings,
    Pt.Managers,
    Pt.Managers.Template,
    Pt.Helpers.DatePicker,
    Pt.Helpers.TimePicker,
    Pt.Helpers.Nprogress,
    Pt.Helpers.Notify,
    Pt.Helpers.Form,
    Pt.Helpers.ErrorHandler,
    Pt.Controllers.DepositController,
    Pt.Services.Affiliates.FundsService,
    Pt.Config
);
(function (
    $,
    $q,
    moment,
    Settings,
    $tpl,
    $nProg,
    DepositController,
    FundsService,
    DepositLauncherService,
    Config
) {

    _.Class('Pt.Deposit.BankTransfer', BankTransfer);

    function BankTransfer() {

        this.view = 'aweb.bankTransfer';
        this.depositAmount = '[data-js=amount]';
        this.depositMethod = {};
        this.actualAmount = 0;
        
        this.actions = _.union(this.actions, [
            [ this.depositAmount, 'input',  '_onAmountChange' ]
        ]);

    }

    BankTransfer.prototype = _.extend({}, new DepositController, {
        
        init: function(method, validator) {

            var self = this;
            
            this.depositMethod = method;
            this.validator = validator;

            self.displayForm();
            self.validator
                .bindInput(true)
                .shouldSerialize(false)
                .init();

            self.addCsfValidations(self, 'bank_transfer');
            self._bindEvents();

        },

        displayForm: function() {

            var depositView = $tpl.get(this.view, {
                depositSettings: this.getDepositSettingsTpl(),
                depositMethod: this.depositMethod,
                banks: this.depositMethod.get('supportedBanks')
            });

            this.render(this.depositFormContainer, depositView);

        },

        _updateAmount: function (e) {

            e.preventDefault();
            e.stopPropagation();
            var self = e.data.context;
            $(self.form + ' ' + self.depositAmount).val($(this).attr('data-value')).trigger('input');

        },

        _onValidationSuccess: function (data, context) {

            var method = this.depositMethod;
            var self = this;
            var params = {
                methodId: method.get('id'),
                amount: self.actualAmount,
                launcherUrl: method.get('launcherUrl'),
                custom: { bankCode: data.get('bankCode') },
                title: _.trans('funds.payment_' + method.get('id'))
            };

            if ( self.depositMethod.hasFormFields() ) {

                _.extend( params.custom, self._getCsfValues(self) );

            }

            DepositLauncherService.launch(params);
            self._resetProcessingFee();
            $(this.form)[0].reset();

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

            } catch ( e ) {}

        },

        _resetProcessingFee: function (  ) {

            this.actualAmount = 0;
            $( '[data-js=processing-fee]' ).text( '' );

        }


    }, Pt.Core.Extend('Deposit.BankTransfer'));

})(
    jQuery,
    Q,
    moment,
    Pt.Settings,
    Pt.Managers.Template,
    Pt.Helpers.Nprogress,
    Pt.Controllers.DepositController,
    Pt.Services.Affiliates.FundsService,
    Pt.Deposit.AffiliateDepositLauncherService,
    Pt.Config
);

(function (
    $,
    _,
    Managers,
    Helpers,
    Config,
    Rules,
    Services,
    fundsController
) {

    "use strict";

    _.Class('Pt.Controllers.FundsHistoryController', FundsHistory);

    function FundsHistory() {

        this.form = '[data-js=funds-history-form]';
        this.rangePickers = '[data-js=input-daterange]';
        this.resultsContainer = '[data-js=funds-history-result]';
        this.resultsTable = '[data-js=funds-history-result-table]';

        this.actions = _.union(this.actions, [
            [ this.form, 'submit', 'onFormSubmit' ]
        ]);
        
    }

    FundsHistory.prototype = _.extend({}, new fundsController, {

        init: function() {

            var view = Managers.Template.get('aweb.fundsHistory');

            this.render(this.fundsContainer, view)
                .initForm()
                ._bindEvents();

        },

        initForm: function() {

            this.initDatepickers()
                .initValidator();

            return this;

        },

        initDatepickers: function() {

            Helpers.DatePicker.activate($(this.rangePickers), {
                format: "yyyy-mm-dd",
                todayHighlight: true,
                toggleActive: false,
                endDate: new Date(),
                language: Managers.Cookie.get('lang')
            }, Config.datePickerLocale[Managers.Cookie.get('lang')]);

            return this;

        },

        initValidator: function() {

            this.validator = new Managers.Validation(
                this.form, 
                Rules.validation.affiliate.fundsHistory
            );

            this.validator.bindInput(true).init();

            return this;

        },

        onFormSubmit: function(e) {

            e.preventDefault();
            var self = e.data.context;
            self.validator.validate(self.onValidationSuccess, self);

        },

        onValidationSuccess: function(data, self) {

            var form = $(this.form);

            self.secureFormRequest(form, true);
            Helpers.Nprogress.start();
            Helpers.Preloader.basic(self.resultsContainer);

            var view = Managers.Template.get('aweb.fundsHistoryResult', {
                history: []
            });

            Services.Affiliates.FundsService.getHistory(data).then(function(res) {

                self.history = res || [];

                view = Managers.Template.get('aweb.fundsHistoryResult', {
                    history: self.history
                });

            }).fail(function(fail) {

                Helpers.Error.show(fail);

            }).finally(function() {

                Helpers.Nprogress.done();
                self.secureFormRequest(form, false, false);
                self.render(self.resultsContainer, view);
                self.initDatatable();

            });

        },

        initDatatable: function() {

            if ( $(this.resultsTable).length ) {

                this.datatableInstance = Helpers.DataTable.render(
                    this.resultsTable,
                    { fixedColumns: false }
                );

            }

        }        

    }, Pt.Core.Extend('Controllers.FundsHistoryController'));

})(
    jQuery,
    _,
    Pt.Managers,
    Pt.Helpers,
    Pt.Config,
    Pt.Rules,
    Pt.Services,
    Pt.Controllers.FundsManagementController
);


/*************************
 * AFFILIATE PROFILE CONTROLLER
 ***********************/

/**
 * Created by jomaf on 6/9/17.
 */
(function ( $,
    $q,
    _,
    Helpers,
    Managers,
    Services,
    Preloader,
    $absController
) {

    "use strict";


    /**
     * @namespace Pt.Controllers.AbstractProfileController
     * @extends Pt.Controllers.AbstractController
     * @property preRender
     * @property resolve
     * @property showUnknownError
     */
    var AbstractProfileController = _.extend($absController, {

        preRender: function() {

            var self = this;
            var path = window.location.pathname.replace('/affiliate/profile', '');
            var view = Managers.Template.get('aweb.profile',
                {
                    active: path.replace('/', ''),
                    canAccessPaymentType: self.canAccessPaymentType
                });

            self.container = '[data-js=page-container]';
            self.render(self.container, view);

        },

        resolve: function (next, context) {

            var self = this;

            if ( ! self.preloaded ) {

                Preloader.basic('[data-js=page-container]');
                self.preloaded = true;

            }

            var requests = [
                Services.Affiliates.ProfileService.getMemberInfo(context.path === '/member/profile'),
                Services.Cms.WidgetService.get('signup'),
                Services.Affiliates.SessionService.countryList(),
                Services.Affiliates.ProfileService.checkPaymentTypeAccess()
            ];

            $q.allSettled(requests).then(function (res) {

                self.member = res[0].state === 'fulfilled' ? res[0].value : {};
                self.formSettings = res[1].state === 'fulfilled' ? res[1].value.affiliatesite : {};
                self.formSettings.countries = res[2].state === 'fulfilled' ? res[2].value : [];
                self.canAccessPaymentType = res[3].state === 'fulfilled' ? res[3].value : false;

            }).fail(function () {

                Helpers.Notify.error(_.trans('errors.unknown_error_notification'));

            }).finally(function () {

                self.preRender();
                next();

            });

        },

        showUnknownError: function() {

            Helpers.Notify.error(_.trans('errors.unknown_error_notification'));

        }


    });

    _.Class('Pt.Controllers.AbstractProfileController', AbstractProfileController);

})(
    jQuery,
    Q,
    _,
    Pt.Helpers,
    Pt.Managers,
    Pt.Services,
    Pt.Helpers.Preloader,
    _.clone(Pt.Controllers.AbstractController)
);
/**
 * Created by jomaf on 6/9/17.
 */
(function (
    $,
    _,
    $q,
    Settings,
    Rules,
    Helpers,
    Widgets,
    Managers,
    Services,
    Config,
    absCtrl
) {

    "use strict";

    _.Class( 'Pt.Controllers.BaseProfileController', BaseProfileController);

    /**
     * @namespace Pt.Controllers.BaseProfileController
     * @extends Pt.Controllers.AbstractProfileController
     * @memberOf Pt.Controllers
     * @constructor
     */
    function BaseProfileController() {

        this.formSettings = {};
        this.wrapper = '[data-js=profile-container]';
        this.validator = null;
        this.form = '[data-js=account]';
        this.addWebsite = '[data-js=add-website]';
        this.website = '[data-js=new-website]';
        this.websiteTable = '[data-js=website-table]';
        this.actions = [

            [this.form, 'submit', "_onFormSubmit"],
            [this.addWebsite, 'click', "_addWebsite"],
            ['[data-js=delete-site]', 'click', "_deleteWebsite"],
            ['[data-js=edit-site]', 'click', "_toggleControls"],
            ['[data-js=submit-edit-site]', 'click', "_submitEditSite"],
            ['[data-js=cancel-edit-site]', 'click', "_toggleControls"]

        ];
        this.datepicker = '[data-js=datepicker]';
        this.languages = {
            "en": "en-us",
            "zh-hans": "zh-cn",
            "vi": "vi-vn",
            "th": "th-th",
            "id": "id-id",
            "km": "km-kh",
            "ko": "ko-kr",
            "ja": "ja-jp"
        };
        
    }

    BaseProfileController.prototype = _.extend(absCtrl, {


        init: function() {

            var self = this;
            var supportedLanguages = Settings.supported_language || [];

            _.map(supportedLanguages, function(supportedLanguage) {

                supportedLanguage.value = self.languages[supportedLanguage.code];
                return supportedLanguage;

            });

            var member = self._escapeHTML(_.clone(this.member)),
                viewData = {
                    formSettings: this.formSettings,
                    member: member,
                    disableBankFields: this.shouldDisableBankFields(this.member),
                    language: supportedLanguages
                };

            var view = Managers.Template.get('aweb.account', viewData);

            this.render(this.wrapper, view);

            this.validator = new Managers.Validation(this.form, Rules.validation.affiliate.account);
            this.validator
                .bindInput(true)
                .init();

            this._initForm();
            this._bindEvents();

        },

        shouldDisableBankFields: function(member) {

            if ( member && ! _.isEmpty(member.accountName) ) {

                var day = ( new Date() ).getDate();

                if ( member.payout === 'Monthly' ) {

                    if ( day <= 6 ) {

                        return true;

                    }

                } else {

                    if ( day <= 6 || ( day >= 16 && day <= 21) ) {

                        return true;

                    }

                }

            }

            return false;
        },

        _initForm: function () {

            Helpers.DatePicker.activate(this.datepicker, {
                endDate: moment(new Date()).subtract(18, 'years')._d,
                language: Managers.Cookie.get('lang'),
                format: 'yyyy-mm-dd'
            }, Config.datePickerLocale[Managers.Cookie.get('lang')]);

            return this;

        },

        _onFormSubmit: function (e) {

            e.preventDefault();

            var self = e.data.context;

            self.validator.validate(self._onValidationSuccess, self);

        },

        _onValidationSuccess: function(data, self) {

            var form = $(this.form);

            if (this.inProgress) {

                return this;

            }

            this.inProgress = true;
            Helpers.Form.lockForm(form, true);
            Helpers.Nprogress.start();

            data = this._unescapeHTML(data);

            Services.Affiliates.ProfileService.updateMemberInfo(data)
                .then(function( ) {

                    Helpers.Notify.success(_.trans('affiliate.profile_msg_success'));

                })
                .fail(function(e) {

                    Helpers.Error.show(e);

                })
                .finally(function() {

                    self.secureFormRequest(form, false, false);
                    Helpers.Nprogress.done();

                });


        },

        _submitEditSite: function(e) {

            var self = e.data.context;
            var $parent = $(this).closest('[data-js=parent]');
            var website = $parent.find('input').val();
            var siteId = $(this).data('siteId');
            var valid = _.isUndefined(self.validator.single(website, { presence: true, url: true } ));

            if ( valid ) {

                Helpers.Nprogress.start();
                Services.Affiliates.ProfileService.editWebsite({ siteId: siteId, websiteUrl: website })
                    .then( function () {

                        $parent.find('[data-js=cancel-edit-site]').trigger('click');
                        Helpers.Notify.success(_.trans('affiliate.profile_msg_website_edit_success'));

                    })
                    .fail(function(e) {

                        Helpers.Error.show(e);

                    })
                    .finally(function() {

                        Helpers.Nprogress.done();

                    });

                return;

            }

            Helpers.Notify.error(_.trans('errors.website_url_invalid'));

        },

        _addWebsite: function(e) {

            var self = e.data.context;
            var website = $(self.website).val();
            var valid = _.isUndefined(self.validator.single(website, { presence: true, url: true } ));

            if ( valid ) {

                Helpers.Nprogress.start();
                Services.Affiliates.ProfileService.addWebsite(website)
                    .then( function () {

                        $(self.website).val('');
                        self._rebuildWebsiteList();
                        Helpers.Notify.success(_.trans('affiliate.profile_msg_website_add_success'));

                    })
                    .fail(function(e) {

                        Helpers.Error.show(e);

                    })
                    .finally(function() {

                        Helpers.Nprogress.done();

                    });

                return;

            }

            Helpers.Notify.error(_.trans('errors.website_url_invalid'));

        },


        _rebuildWebsiteList: function( ) {

            var self = this;
            Helpers.Nprogress.start();
            Services.Affiliates.ProfileService.getWebsites().then(function(response) {

                if ( ! _.isEmpty(response)) {

                    self.member.websites = response;
                    self._renderWebsites();

                }

            }).fail(function(e) {

                Helpers.Error.show(e);

            }).finally(function() {

                Helpers.Nprogress.done();

            });

        },

        _renderWebsites: function() {

            var view = Managers.Template.get('aweb.affiliateUrl', { websites: this.member.websites });
            this.render(this.websiteTable, view);

        },

        _deleteWebsite: function(e) {

            var self = e.data.context;
            var siteId = $(this).data('siteId');
            var unDeletedSites = [];
            Helpers.Nprogress.start();
            Services.Affiliates.ProfileService.deleteWebsite( siteId ).then(function() {

                unDeletedSites = _.reject(self.member.websites, function (website) {

                    return website.affiliatememberurlid === siteId + "";

                });

                self.member.websites = unDeletedSites;
                Helpers.Notify.success(_.trans('affiliate.profile_msg_website_delete_success'));
                self._renderWebsites();

            }).fail(function(e) {

                Helpers.Error.show(e);

            }).finally(function () {

                Helpers.Nprogress.done();

            });

        },

        _toggleControls: function() {

            var attr = $(this).data();
            var $parent = $(this).closest('[data-js=parent]');

            if (attr.js.indexOf('cancel') > - 1 ) {

                $parent.find('input').prop('readonly', true);
                $parent.find('[data-js=main-controls]').removeClass('hide');
                $parent.find('[data-js=edit-controls]').addClass('hide');
                return false;

            }

            $parent.find('input').prop('readonly', false);
            $parent.find('[data-js=main-controls]').addClass('hide');
            $parent.find('[data-js=edit-controls]').removeClass('hide');

        },

        /**
         * PHP's htmlspecialchars equivalent
         * 
         * @param {Array|Object} data
         * @returns {Array|Object}
         */
        _escapeHTML: function(data) {
            var constructor = data.constructor.toString(),
                map = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    '\'': '&#039;'
                };

            if (constructor.indexOf("Object") !== -1) {
                Object.keys(data).forEach(function(p) {
                    if (typeof(data[p]) === "string") {
                        data[p] = data[p].replace(/[&<>"']/g, function(m) { return map[m]; });
                    }
                });
            } else if (constructor.indexOf("Array") !== -1) {
                _.forEach(data, function(d, i) {
                    if (typeof(d) === "string") {
                        data[i] = data[p].replace(/[&<>"']/g, function(m) { return map[m]; });
                    }
                });
            }

            return data;
        },

        /**
         * PHP's htmlspecialchars_decode equivalent
         * 
         * @param {Array|Object} data
         * @returns {Array|Object}
         */
        _unescapeHTML: function(data) {
            var constructor = data.constructor.toString(),
                map = {
                    '&amp;': '&',
                    '&lt;': '<',
                    '&gt;': '>',
                    '&quot;': '"',
                    '&#039;': '\''
                };

            if (constructor.indexOf("Object") !== -1) {
                Object.keys(data).forEach(function(p) {
                    if (typeof(data[p]) === "string") {
                        data[p] = data[p].replace(/&quot;|&lt;|&gt;|&#039;|&amp;/g, function(m) { return map[m]; });
                    }
                });
            } else if (constructor.indexOf("Array") !== -1) {
                _.forEach(data, function(d, i) {
                    if (typeof(d) === "string") {
                        data[i] = data[i].replace(/&quot;|&lt;|&gt;|&#039;|&amp;/g, function(m) { return map[m]; });
                    }
                });
            }

            return data;
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
    Pt.Config,
    _.clone(Pt.Controllers.AbstractProfileController)
);
/**
 * Created by jomaf on 6/9/17.
 */
(function (
    $,
    _,
    $q,
    Settings,
    Rules,
    Helpers,
    Widgets,
    Managers,
    Services,
    absCtrl
) {

    "use strict";

    _.Class( 'Pt.Controllers.BaseChangePasswordController', BaseChangePasswordController);

    /**
     * @namespace Pt.Controllers.BaseChangePasswordController
     * @extends Pt.Controllers.AbstractProfileController
     * @constructor
     */
    function BaseChangePasswordController() {

        this.wrapper = '[data-js=profile-container]';
        this.form = '[data-js=change-password]';
        this.actions = [
            [this.form, 'submit', '_onFormSubmit']
        ];

    }

    BaseChangePasswordController.prototype = _.extend(absCtrl, {

        init: function() {

            var view = Managers.Template.get('aweb.changePassword', {});
            this.render(this.wrapper, view);
            this.validator = new Managers.Validation(this.form, Rules.validation.affiliate.changePassword);
            this.validator
                .bindInput(true)
                .init();

            this._bindEvents();

        },

        _onFormSubmit: function(e) {

            e.preventDefault();

            var self = e.data.context;

            self.validator.validate(self._onValidationSuccess, self);

        },

        _onValidationSuccess: function(data, self) {

            var form = $(this.form);

            if (this.inProgress) {

                return this;

            }

            this.inProgress = true;

            Helpers.Form.lockForm(form, true);

            Helpers.Nprogress.start();

            Services.Affiliates.ProfileService.changePassword(data)
                .then(function( ) {

                    Helpers.Notify.success(_.trans('affiliate.profile_change_password_success'));

                })
                .fail(function(e) {

                    Helpers.Error.show(e);

                })
                .finally(function() {

                    self.secureFormRequest(form, false, true);
                    Helpers.Nprogress.done();

                });

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
    _.clone(Pt.Controllers.AbstractProfileController)
);
/**
 * Created by jomaf on 6/9/17.
 */
(function (
    $,
    _,
    $q,
    Settings,
    Rules,
    Helpers,
    Widgets,
    Managers,
    Services,
    absCtrl
) {

    "use strict";

    _.Class( 'Pt.Controllers.BaseSubAffiliateController', BaseSubAffiliateController);

    /**
     * @namespace Pt.Controllers.BaseSubAffiliateController
     * @extends Pt.Controllers.AbstractProfileController
     * @constructor
     */
    function BaseSubAffiliateController() {

        this.wrapper = '[data-js=profile-container]';
        this.form = '[data-js=sub-affiliate]';
        this.actions = [
            [this.form, 'submit', '_onFormSubmit']
        ];

    }

    BaseSubAffiliateController.prototype = _.extend(absCtrl, {

        init: function() {

            var view = Managers.Template.get('aweb.subAffiliate', {
                isDownlineInvite: this.isDownlineInvite
            });

            this.render(this.wrapper, view);
            this.validator = new Managers.Validation(this.form, Rules.validation.affiliate.subAffiliate);
            this.validator
                .bindInput(true)
                .init();

            this._bindEvents();

        },
        _onFormSubmit: function(e) {

            e.preventDefault();

            var self = e.data.context;

            self.validator.validate(self._onValidationSuccess, self);

        },

        _onValidationSuccess: function (data, self) {

            var form = $(this.form);

            if (this.inProgress) {

                return this;

            }

            var emails = _.map(_.filter(data, function(email) {

                return ! _.isEmpty(email.value);

            }), function(email) {

                return email.value;

            });


            if ( ! emails.length ) {

                Helpers.Notify.error(_.trans('errors.email_required'));
                return false;

            }

            this.inProgress = true;

            Helpers.Form.lockForm(form, true);

            Helpers.Nprogress.start();

            Services.Affiliates.ProfileService.inviteSubAffiliate(emails)
                .then(function() {

                    Helpers.Notify.success(_.trans('affiliate.profile_msg_invitation_success'));

                })
                .fail(function(e) {

                    Helpers.Error.show(e);

                })
                .finally(function () {

                    Helpers.Nprogress.done();
                    self.inProgress = false;
                    self.secureFormRequest(form, false, true);

                });

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
    _.clone(Pt.Controllers.AbstractProfileController)
);
/**
 * Created by custer on 11/25/19.
 */
(function(
    _,
    $,
    ProfileService,
    Router,
    Rules,
    Managers,
    Helpers,
    AbstractProfileController
){
    'use strict';

    var CASH = 'cash'
        , BANK_TRANSFER = 'bank transfer'
        , PAYMENT_TYPES = [
            {
                value: '',
                label: _.trans('funds.default_option_select')
            },
            {
                value: CASH,
                label: _.trans('affiliate.profile_label_cash')
            },
            {
                value: BANK_TRANSFER,
                label: _.trans('affiliate.profile_label_bank_transfer')
            }
        ];

    _.Class('Pt.Controllers.BasePaymentTypeController', BasePaymentTypeController);

    function BasePaymentTypeController() {

        this.view = 'aweb.paymentType';
        this.wrapper = '[data-js=profile-container]';
        
        this.form = '[name=payment-type]';
        this.paymentTypes = '[data-js=payment-types]';
        this.fileUpload = '[data-js=payment-type-file-upload]';
        this.fileSelectorBtn = '[data-js=payment-type-file-selector]';
        this.fileInputName = '[data-js=payment-type-file-name]';

        this.actions = [
            [this.paymentTypes, 'change', '_onTypeChange'],
            [this.fileSelectorBtn, 'click', '_onChooseFileClick'],
            [this.fileUpload, 'change', '_onFileUploadChange'],
            [this.form, 'submit', '_onFormSubmit']
        ];
    }

    BasePaymentTypeController.prototype = Object.create(AbstractProfileController);

    _.extend(BasePaymentTypeController.prototype, {

        constructor: BasePaymentTypeController,

        init: function() {

            var self = this;

            if (self.canAccessPaymentType !== true) {
                Router.redirect('/member/profile');
            }

            ProfileService
                .getPaymentType()
                .then(function(response) {

                    self.paymentType = response;

                    self.render(
                        self.wrapper,
                        Managers.Template.get(self.view, {
                            paymentType: self.paymentType,
                            paymentTypes: PAYMENT_TYPES
                        })
                    );
                })
                .finally(function() {

                    self._bindEvents();

                    $('[data-toggle=tooltip]').tooltip({
                        html:true
                    });

                    $(self.paymentTypes).trigger('change');

                    self.validator = new Managers.Validation(self.form, Rules.validation.affiliate.paymentType);
                    self.validator
                        .bindInput(true)
                        .shouldSerialize(false)
                        .init();
                });
        },

        _onTypeChange: function(e) {

            e.stopPropagation();

            var self = e.data.context
                , fileUpload = $(self.form + ' .payment-type-attachment');

            if (this.value === CASH) {
                fileUpload.show();
            } else {
                fileUpload.hide();
            }
        },

        _onChooseFileClick: function(e) {

            e.stopPropagation();

            var self = e.data.context;

            $(self.fileUpload).trigger('click');
        },

        _onFileUploadChange: function(e) {

            e.stopPropagation();

            var self = e.data.context
                , filename = $(this).val().split('\\').pop()
                , fileInputName = $(self.fileInputName);

            fileInputName.val(filename);
        },

        _onFormSubmit: function(e) {

            e.preventDefault();

            var self = e.data.context;

            self.validator.validate(self._onValidationSuccess, self, false);
        },

        _onValidationSuccess: function(data, context) {

            var self = context
                , file;

            try {
                file = $(self.fileUpload)[0].files[0] || null;
            } catch (e) {
                file = null;
            }

            data.set('attachment', file);

            Helpers.Nprogress.start();
            Helpers.Form.lockForm(self.form, true);

            ProfileService
                .savePaymentType(data.toFormData())
                .then(function() {
                    Helpers.Notify.success(_.trans('profile.success_message_payment_type'));
                    self.init();
                })
                .fail(function(errors) {
                    Helpers.ErrorHandler.show(errors);
                })
                .finally(function() {
                    Helpers.Form.lockForm(self.form, false);
                    Helpers.Nprogress.done();
                });
        }

    });

})(
    _,
    jQuery,
    Pt.Services.Affiliates.ProfileService,
    Pt.Core.Router,
    Pt.Rules,
    Pt.Managers,
    Pt.Helpers,
    _.clone(Pt.Controllers.AbstractProfileController)
);


/**
* PrometheusFrontend
* Created by isda on 13/12/2016.
*/

(function (
    _baseHomeController
) {

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

        }, Pt.Core.Extend('Controllers.HomeController'));

        return new Class();

    }

})(
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

        } , Pt.Core.Extend('Controllers.SignupController'));

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

        } , Pt.Core.Extend('Controllers.LoginController'));

        return new Class();

    }

})(
    Pt.Controllers.BaseLoginController
);
/**
 * Created by jomaf on 6/9/17.
 */
(function (
    BaseProfileController
) {

    "use strict";

    _.Class( 'Pt.Controllers.ProfileController', ProfileController);

    /**
     * @namespace Pt.Controllers.ProfileController
     * @constructor
     */
    function ProfileController() {

        function Class() {

            BaseProfileController.call(this);

        }

        Class.prototype = Object.create(BaseProfileController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        } , Pt.Core.Extend('Controllers.ProfileController'));


        return new Class();

    }


})(
    Pt.Controllers.BaseProfileController
);
/**
 * Created by jomaf on 6/9/17.
 */
(function (
    BaseChangePasswordController
) {

    "use strict";

    _.Class( 'Pt.Controllers.ChangePasswordController', ChangePasswordController);

    /**
     * @namespace Pt.Controllers.ChangePasswordController
     * @constructor
     */
    function ChangePasswordController() {

        function Class() {

            BaseChangePasswordController.call(this);

        }

        Class.prototype = Object.create(BaseChangePasswordController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        } , Pt.Core.Extend('Controllers.ChangePasswordController'));

        return new Class();

    }


})(
    Pt.Controllers.BaseChangePasswordController
);
/**
 * Created by jomaf on 6/9/17.
 */
(function (
    BaseSubAffiliateController
) {

    "use strict";

    _.Class( 'Pt.Controllers.SubAffiliateController', SubAffiliateController);

    /**
     * @namespace Pt.Controllers.SubAffiliateController
     * @constructor
     */
    function SubAffiliateController() {

        function Class() {

            BaseSubAffiliateController.call(this);

        }

        Class.prototype = Object.create(BaseSubAffiliateController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        } , Pt.Core.Extend('Controllers.SubAffiliateController'));

        return new Class();

    }


})(
    Pt.Controllers.BaseSubAffiliateController
);
/**
 * Created by custer on 11/25/19.
 */
(function(
    _,
    BasePaymentTypeController
){
    'use strict';

    _.Class('Pt.Controllers.PaymentTypeController', PaymentTypeController);

    function PaymentTypeController() {

        BasePaymentTypeController.call(this);
    }

    PaymentTypeController.prototype = Object.create(BasePaymentTypeController.prototype);

    _.extend(PaymentTypeController.prototype, {

        constructor: PaymentTypeController

    });

})(
    _,
    Pt.Controllers.BasePaymentTypeController
);

/**
 * PrometheusFrontend
 * Created by isda on 15/12/2016.
 */

(function (_baseCreativeController) {

    _.Class('Pt.Controllers.CreativeController', CreativeController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.CreativeController
     * @constructor
     */
    function CreativeController() {

        function Class() {

            _baseCreativeController.call(this);

            this.defaultCountry = 'KR';

        }

        Class.prototype = Object.create(_baseCreativeController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        }, Pt.Core.Extend('Controllers.CreativeController'));

        return new Class();

    }

})(
    Pt.Controllers.BaseCreativeController
);
/**
 * PrometheusFrontend
 * Created by isda on 15/12/2016.
 */

(function (_baseOverviewController) {

    _.Class('Pt.Controllers.OverviewController', OverviewController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.OverviewController
     * @constructor
     */
    function OverviewController() {

        function Class() {

            _baseOverviewController.call(this);

            this.defaultCountry = 'KR';

        }

        Class.prototype = Object.create(_baseOverviewController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

        } , Pt.Core.Extend('Controllers.OverviewController'));


        return new Class();

    }

})(
    Pt.Controllers.BaseOverviewController
);
/**
 * PrometheusFrontend
 * Created by isda on 15/12/2016.
 */

(function (
    Managers,
    Helpers,
    _baseTrackingController
) {

    _.Class('Pt.Controllers.TrackingController', TrackingController);

    /**
     * Home Controller
     * @namespace Pt.Controllers.TrackingController
     * @constructor
     */
    function TrackingController() {

        function Class() {

            _baseTrackingController.call(this);

        }

        Class.prototype = Object.create(_baseTrackingController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

            _renderReports: function () {

                var view = Managers.Template.get('aweb.trackingReports', { stats: this.trackingStatistics });
                this.render(this.el.reportWrapper, view);

                if ( $('[data-js=tracking-reports-table]').length ) {

                    Helpers.DataTable.render(
                        '[data-js=tracking-reports-table]',
                        { fixedColumns: false }
                    );

                }

            }

        } , Pt.Core.Extend('Controllers.TrackingController'));

        return new Class();

    }

})(
    Pt.Managers,
    Pt.Helpers,
    Pt.Controllers.BaseTrackingController
);



(function (
    Managers,
    Helpers,
    BaseReportsController
) {

    "use strict";

    _.Class( 'Pt.Controllers.ReportsController', ReportsController);

    /**
     * @namespace Pt.Controllers.ReportsController
     * @memberOf Pt.Controllers
     * @constructor
     */
    function ReportsController() {

        function Class() {

            BaseReportsController.call(this);

        }

        Class.prototype = Object.create(BaseReportsController.prototype);
        Class.prototype.constructor = Class;

        _.extend(Class.prototype, {

            _renderReports: function (report) {

                var template = 'aweb.' + report.type;
                var view = Managers.Template.get(template, { reports: report.reports });
                this.render(this.el.wrapper, view);
                this._bindPopOverToggle();

                if (this.serviceMapping[report.type].dataTable) {

                    if ($('[data-js=' + report.type + ']').length) {

                        this.dTableInstance = Helpers.DataTable.render(
                            '[data-js=' + report.type + ']',
                            { fixedColumns: false }
                        );

                    }

                }
            }

        } , Pt.Core.Extend('Controllers.ReportsController'));

        return new Class();

    }

})(
    Pt.Managers,
    Pt.Helpers,
    Pt.Controllers.BaseReportsController
);

/**
* PrometheusFrontend
* Created by isda on 13/12/2016.
*/

(function (
    Widgets,
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
    Pt.Widgets,
    Pt.Controllers.BaseStaticPageController
);

/**
 * Created by jomaf - Joseph John Fontanilla
 * Date: 5/24/19
 * Time: 1:36 PM
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
 * Created by jomaf - Joseph John Fontanilla
 * Date: 5/24/19
 * Time: 1:36 PM
 */
(function (_baseArticleController) {

        _.Class('Pt.Controllers.ArticleController', ArticleController);

        /**
         * Home Controller
         * @namespace Pt.Controllers.ArticleController
         * @constructor
         */
        function ArticleController() {

            function Class() {

                _baseArticleController.call(this);

            }

            Class.prototype = Object.create(_baseArticleController.prototype);
            Class.prototype.constructor = Class;

            _.extend(Class.prototype, {

            }, Pt.Core.Extend('Controllers.ArticleController'));

            return new Class();

        }

    }
)(
    Pt.Controllers.BaseArticleController
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
                route: "/promotions/:category?/:promoId?",
                controller: 'Pt.Controllers.PromoController@init'
            },
            {
                route: "/article/:category?/:articleId?",
                controller: 'Pt.Controllers.ArticleController@init'
            },
            {
                route: "/daily/:category?/:articleId?",
                controller: 'Pt.Controllers.ArticleController@init'
            },
            {
                route: "/member/overview",
                controller: 'Pt.Controllers.OverviewController@init'
            },
            {
                route: "/member/creative",
                controller: 'Pt.Controllers.CreativeController@init'
            },
            {
                route: "/member/tracking-statistics",
                controller: 'Pt.Controllers.TrackingController@init'
            },
            {
                route: "/member/profile/sub-affiliate-management",
                controller: 'Pt.Controllers.SubAffiliateController@init'
            },
            {
                route: "/member/profile/change-password",
                controller: 'Pt.Controllers.ChangePasswordController@init'
            },
            {
                route: "/member/profile/payment-type",
                controller: 'Pt.Controllers.PaymentTypeController@init'
            },
            {
                route: "/member/profile",
                controller: 'Pt.Controllers.ProfileController@init'
            },
            {
                route: "/member/reports",
                controller: 'Pt.Controllers.ReportsController@init'
            },
            {
                route: "/member/downline-management",
                controller: 'Pt.Controllers.DownlineAffiliateMemberController@init'
            },
            {
                route: "/member/downline-management/create-affiliate",
                controller: 'Pt.Controllers.DownlineCreateAffiliateController@init'
            },
            {
                route: "/member/downline-management/create-member",
                controller: 'Pt.Controllers.DownlineCreateMemberController@init'
            },
            {
                route: "/member/downline-management/invite-affiliate",
                controller: 'Pt.Controllers.DownlineInviteAffiliateController@init'
            },
            {
                route: "/member/downline-management/topup-history",
                controller: 'Pt.Controllers.DownlineTopupHistoryController@init'
            },
            {
                route: "/member/fund-management",
                controller: 'Pt.Controllers.DepositController@init'
            },
            {
                route: "/member/fund-management/deposit/:method?",
                controller: 'Pt.Controllers.DepositController@init'
            },
            {
                route: "/member/fund-management/history",
                controller: 'Pt.Controllers.FundsHistoryController@init'
            },
            {
                route: "/tracker/:aid/:cid?/:tid?",
                controller: 'Pt.Controllers.TrackController@init'
            },
            {
                route: "/track",
                controller: 'Pt.Controllers.TrackController@init'
            },
            {
                route: "/:page?/:subpage?",
                controller: 'Pt.Controllers.StaticPageController@init'
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


