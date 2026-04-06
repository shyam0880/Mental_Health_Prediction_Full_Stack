
const initialData  = {
    "categorical_counts": {
        "anonymity": {
            "Don't know": 816,
            "No": 64,
            "Yes": 374
        },
        "benefits": {
            "Don't know": 408,
            "No": 372,
            "Yes": 474
        },
        "care_options": {
            "No": 499,
            "Not sure": 314,
            "Yes": 441
        },
        "coworkers": {
            "No": 258,
            "Some of them": 772,
            "Yes": 224
        },
        "family_history": {
            "No": 764,
            "Yes": 490
        },
        "leave": {
            "Don't know": 561,
            "Somewhat difficult": 125,
            "Somewhat easy": 266,
            "Very difficult": 97,
            "Very easy": 205
        },
        "mental_health_consequence": {
            "Maybe": 476,
            "No": 489,
            "Yes": 289
        },
        "mental_health_interview": {
            "Maybe": 207,
            "No": 1005,
            "Yes": 42
        },
        "mental_vs_physical": {
            "Don't know": 574,
            "No": 338,
            "Yes": 342
        },
        "no_employees": {
            "1-5": 160,
            "100-500": 176,
            "26-100": 288,
            "500-1000": 60,
            "6-25": 289,
            "More than 1000": 281
        },
        "obs_consequence": {
            "No": 1072,
            "Yes": 182
        },
        "phys_health_consequence": {
            "Maybe": 273,
            "No": 922,
            "Yes": 59
        },
        "phys_health_interview": {
            "Maybe": 556,
            "No": 497,
            "Yes": 201
        },
        "remote_work": {
            "No": 881,
            "Yes": 373
        },
        "seek_help": {
            "Don't know": 363,
            "No": 643,
            "Yes": 248
        },
        "self_employed": {
            "No": 1092,
            "Yes": 144,
            "nan": 18
        },
        "supervisor": {
            "No": 390,
            "Some of them": 350,
            "Yes": 514
        },
        "tech_company": {
            "No": 226,
            "Yes": 1028
        },
        "treatment": {
            "No": 621,
            "Yes": 633
        },
        "wellness_program": {
            "Don't know": 187,
            "No": 839,
            "Yes": 228
        },
        "work_interfere": {
            "Never": 213,
            "Often": 141,
            "Rarely": 173,
            "Sometimes": 464,
            "nan": 263
        }
    },
    "charts": {
        "anonymity": [
            {
                "No": 447,
                "Yes": 369,
                "anonymity": "Don't know"
            },
            {
                "No": 27,
                "Yes": 37,
                "anonymity": "No"
            },
            {
                "No": 147,
                "Yes": 227,
                "anonymity": "Yes"
            }
        ],
        "benefits": [
            {
                "No": 257,
                "Yes": 151,
                "benefits": "Don't know"
            },
            {
                "No": 193,
                "Yes": 179,
                "benefits": "No"
            },
            {
                "No": 171,
                "Yes": 303,
                "benefits": "Yes"
            }
        ],
        "care_options": [
            {
                "No": 293,
                "Yes": 206,
                "care_options": "No"
            },
            {
                "No": 191,
                "Yes": 123,
                "care_options": "Not sure"
            },
            {
                "No": 137,
                "Yes": 304,
                "care_options": "Yes"
            }
        ],
        "coworkers": [
            {
                "No": 141,
                "Yes": 117,
                "coworkers": "No"
            },
            {
                "No": 383,
                "Yes": 389,
                "coworkers": "Some of them"
            },
            {
                "No": 97,
                "Yes": 127,
                "coworkers": "Yes"
            }
        ],
        "family_history": [
            {
                "No": 494,
                "Yes": 270,
                "family_history": "No"
            },
            {
                "No": 127,
                "Yes": 363,
                "family_history": "Yes"
            }
        ],
        "leave": [
            {
                "No": 308,
                "Yes": 253,
                "leave": "Don't know"
            },
            {
                "No": 44,
                "Yes": 81,
                "leave": "Somewhat difficult"
            },
            {
                "No": 135,
                "Yes": 131,
                "leave": "Somewhat easy"
            },
            {
                "No": 31,
                "Yes": 66,
                "leave": "Very difficult"
            },
            {
                "No": 103,
                "Yes": 102,
                "leave": "Very easy"
            }
        ],
        "mental_health_consequence": [
            {
                "No": 224,
                "Yes": 252,
                "mental_health_consequence": "Maybe"
            },
            {
                "No": 279,
                "Yes": 210,
                "mental_health_consequence": "No"
            },
            {
                "No": 118,
                "Yes": 171,
                "mental_health_consequence": "Yes"
            }
        ],
        "mental_health_interview": [
            {
                "No": 125,
                "Yes": 82,
                "mental_health_interview": "Maybe"
            },
            {
                "No": 478,
                "Yes": 527,
                "mental_health_interview": "No"
            },
            {
                "No": 18,
                "Yes": 24,
                "mental_health_interview": "Yes"
            }
        ],
        "mental_vs_physical": [
            {
                "No": 315,
                "Yes": 259,
                "mental_vs_physical": "Don't know"
            },
            {
                "No": 138,
                "Yes": 200,
                "mental_vs_physical": "No"
            },
            {
                "No": 168,
                "Yes": 174,
                "mental_vs_physical": "Yes"
            }
        ],
        "no_employees": [
            {
                "No": 71,
                "Yes": 89,
                "no_employees": "1-5"
            },
            {
                "No": 81,
                "Yes": 95,
                "no_employees": "100-500"
            },
            {
                "No": 139,
                "Yes": 149,
                "no_employees": "26-100"
            },
            {
                "No": 33,
                "Yes": 27,
                "no_employees": "500-1000"
            },
            {
                "No": 162,
                "Yes": 127,
                "no_employees": "6-25"
            },
            {
                "No": 135,
                "Yes": 146,
                "no_employees": "More than 1000"
            }
        ],
        "obs_consequence": [
            {
                "No": 565,
                "Yes": 507,
                "obs_consequence": "No"
            },
            {
                "No": 56,
                "Yes": 126,
                "obs_consequence": "Yes"
            }
        ],
        "phys_health_consequence": [
            {
                "No": 127,
                "Yes": 146,
                "phys_health_consequence": "Maybe"
            },
            {
                "No": 469,
                "Yes": 453,
                "phys_health_consequence": "No"
            },
            {
                "No": 25,
                "Yes": 34,
                "phys_health_consequence": "Yes"
            }
        ],
        "phys_health_interview": [
            {
                "No": 290,
                "Yes": 266,
                "phys_health_interview": "Maybe"
            },
            {
                "No": 240,
                "Yes": 257,
                "phys_health_interview": "No"
            },
            {
                "No": 91,
                "Yes": 110,
                "phys_health_interview": "Yes"
            }
        ],
        "remote_work": [
            {
                "No": 444,
                "Yes": 437,
                "remote_work": "No"
            },
            {
                "No": 177,
                "Yes": 196,
                "remote_work": "Yes"
            }
        ],
        "seek_help": [
            {
                "No": 197,
                "Yes": 166,
                "seek_help": "Don't know"
            },
            {
                "No": 323,
                "Yes": 320,
                "seek_help": "No"
            },
            {
                "No": 101,
                "Yes": 147,
                "seek_help": "Yes"
            }
        ],
        "self_employed": [
            {
                "No": 544,
                "Yes": 548,
                "self_employed": "No"
            },
            {
                "No": 68,
                "Yes": 76,
                "self_employed": "Yes"
            }
        ],
        "supervisor": [
            {
                "No": 186,
                "Yes": 204,
                "supervisor": "No"
            },
            {
                "No": 170,
                "Yes": 180,
                "supervisor": "Some of them"
            },
            {
                "No": 265,
                "Yes": 249,
                "supervisor": "Yes"
            }
        ],
        "tech_company": [
            {
                "No": 104,
                "Yes": 122,
                "tech_company": "No"
            },
            {
                "No": 517,
                "Yes": 511,
                "tech_company": "Yes"
            }
        ],
        "wellness_program": [
            {
                "No": 106,
                "Yes": 81,
                "wellness_program": "Don't know"
            },
            {
                "No": 422,
                "Yes": 417,
                "wellness_program": "No"
            },
            {
                "No": 93,
                "Yes": 135,
                "wellness_program": "Yes"
            }
        ],
        "work_interfere": [
            {
                "No": 183,
                "Yes": 30,
                "work_interfere": "Never"
            },
            {
                "No": 21,
                "Yes": 120,
                "work_interfere": "Often"
            },
            {
                "No": 51,
                "Yes": 122,
                "work_interfere": "Rarely"
            },
            {
                "No": 107,
                "Yes": 357,
                "work_interfere": "Sometimes"
            }
        ]
    },
    "duplicates": 0,
    "gender_count": {
        "Female": 247,
        "Male": 988,
        "Other": 19
    },
    "model_results": {
        "AdaBoost": {
            "accuracy": 0.8567
        },
        "DecisionTree": {
            "accuracy": 0.7389
        },
        "GradientBoosting": {
            "accuracy": 0.8217
        },
        "KNN": {
            "accuracy": 0.7389
        },
        "LogisticRegression": {
            "accuracy": 0.8185
        },
        "RandomForest": {
            "accuracy": 0.8185
        },
        "XGBoost": {
            "accuracy": 0.8025
        }
    },
    "overview": {
        // "describe": {
        //     "Age": {
        //         "25%": 27,
        //         "50%": 31,
        //         "75%": 36,
        //         "count": 1254,
        //         "max": 72,
        //         "mean": 32.01913875598086,
        //         "min": 5,
        //         "std": 7.375004736825698
        //     }
        // },
        "each_columns": [
            "Timestamp",
            "Age",
            "Gender",
            "Country",
            "state",
            "self_employed",
            "family_history",
            "treatment",
            "work_interfere",
            "no_employees",
            "remote_work",
            "tech_company",
            "benefits",
            "care_options",
            "wellness_program",
            "seek_help",
            "anonymity",
            "leave",
            "mental_health_consequence",
            "phys_health_consequence",
            "coworkers",
            "supervisor",
            "mental_health_interview",
            "phys_health_interview",
            "mental_vs_physical",
            "obs_consequence",
            "comments"
        ],
        "each_unique": {
            "Age": 48,
            "Country": 47,
            "Gender": 3,
            "Timestamp": 1242,
            "anonymity": 3,
            "benefits": 3,
            "care_options": 3,
            "comments": 159,
            "coworkers": 3,
            "family_history": 2,
            "leave": 5,
            "mental_health_consequence": 3,
            "mental_health_interview": 3,
            "mental_vs_physical": 3,
            "no_employees": 6,
            "obs_consequence": 2,
            "phys_health_consequence": 3,
            "phys_health_interview": 3,
            "remote_work": 2,
            "seek_help": 3,
            "self_employed": 2,
            "state": 45,
            "supervisor": 3,
            "tech_company": 2,
            "treatment": 2,
            "wellness_program": 3,
            "work_interfere": 4
        },
        "null_count": {
            "Age": 0,
            "Country": 0,
            "Gender": 0,
            "Timestamp": 0,
            "anonymity": 0,
            "benefits": 0,
            "care_options": 0,
            "comments": 1091,
            "coworkers": 0,
            "family_history": 0,
            "leave": 0,
            "mental_health_consequence": 0,
            "mental_health_interview": 0,
            "mental_vs_physical": 0,
            "no_employees": 0,
            "obs_consequence": 0,
            "phys_health_consequence": 0,
            "phys_health_interview": 0,
            "remote_work": 0,
            "seek_help": 0,
            "self_employed": 18,
            "state": 513,
            "supervisor": 0,
            "tech_company": 0,
            "treatment": 0,
            "wellness_program": 0,
            "work_interfere": 263
        }
    },
    "shape": [
        1259,
        27
    ],
    "value_counts": {
        "Age": {
            "5": 1,
            "8": 1,
            "11": 1,
            "18": 7,
            "19": 9,
            "20": 6,
            "21": 16,
            "22": 21,
            "23": 51,
            "24": 46,
            "25": 61,
            "26": 75,
            "27": 71,
            "28": 68,
            "29": 85,
            "30": 63,
            "31": 67,
            "32": 82,
            "33": 70,
            "34": 65,
            "35": 55,
            "36": 37,
            "37": 43,
            "38": 39,
            "39": 33,
            "40": 33,
            "41": 21,
            "42": 20,
            "43": 28,
            "44": 11,
            "45": 12,
            "46": 12,
            "47": 2,
            "48": 6,
            "49": 4,
            "50": 6,
            "51": 5,
            "53": 1,
            "54": 3,
            "55": 3,
            "56": 4,
            "57": 3,
            "58": 1,
            "60": 2,
            "61": 1,
            "62": 1,
            "65": 1,
            "72": 1
        },
        "Country": {
            "Australia": 21,
            "Austria": 3,
            "Bahamas, The": 1,
            "Belgium": 6,
            "Bosnia and Herzegovina": 1,
            "Brazil": 6,
            "Bulgaria": 4,
            "Canada": 72,
            "China": 1,
            "Colombia": 2,
            "Costa Rica": 1,
            "Croatia": 2,
            "Czech Republic": 1,
            "Denmark": 2,
            "Finland": 3,
            "France": 13,
            "Georgia": 1,
            "Germany": 45,
            "Greece": 2,
            "Hungary": 1,
            "India": 10,
            "Ireland": 27,
            "Israel": 5,
            "Italy": 7,
            "Japan": 1,
            "Latvia": 1,
            "Mexico": 3,
            "Moldova": 1,
            "Netherlands": 27,
            "New Zealand": 8,
            "Nigeria": 1,
            "Norway": 1,
            "Philippines": 1,
            "Poland": 7,
            "Portugal": 2,
            "Romania": 1,
            "Russia": 3,
            "Singapore": 4,
            "Slovenia": 1,
            "South Africa": 6,
            "Spain": 1,
            "Sweden": 7,
            "Switzerland": 7,
            "Thailand": 1,
            "United Kingdom": 184,
            "United States": 748,
            "Uruguay": 1
        },
        "Gender": {
            "Female": 247,
            "Male": 988,
            "Other": 19
        },
        "anonymity": {
            "Don't know": 816,
            "No": 64,
            "Yes": 374
        },
        "benefits": {
            "Don't know": 408,
            "No": 372,
            "Yes": 474
        },
        "care_options": {
            "No": 499,
            "Not sure": 314,
            "Yes": 441
        },
        "coworkers": {
            "No": 258,
            "Some of them": 772,
            "Yes": 224
        },
        "family_history": {
            "No": 764,
            "Yes": 490
        },
        "leave": {
            "Don't know": 561,
            "Somewhat difficult": 125,
            "Somewhat easy": 266,
            "Very difficult": 97,
            "Very easy": 205
        },
        "mental_health_consequence": {
            "Maybe": 476,
            "No": 489,
            "Yes": 289
        },
        "mental_health_interview": {
            "Maybe": 207,
            "No": 1005,
            "Yes": 42
        },
        "mental_vs_physical": {
            "Don't know": 574,
            "No": 338,
            "Yes": 342
        },
        "no_employees": {
            "1-5": 160,
            "100-500": 176,
            "26-100": 288,
            "500-1000": 60,
            "6-25": 289,
            "More than 1000": 281
        },
        "obs_consequence": {
            "No": 1072,
            "Yes": 182
        },
        "phys_health_consequence": {
            "Maybe": 273,
            "No": 922,
            "Yes": 59
        },
        "phys_health_interview": {
            "Maybe": 556,
            "No": 497,
            "Yes": 201
        },
        "remote_work": {
            "No": 881,
            "Yes": 373
        },
        "seek_help": {
            "Don't know": 363,
            "No": 643,
            "Yes": 248
        },
        "self_employed": {
            "No": 1092,
            "Yes": 144,
            "nan": 18
        },
        "state": {
            "AL": 7,
            "AZ": 7,
            "CA": 138,
            "CO": 9,
            "CT": 4,
            "DC": 4,
            "FL": 15,
            "GA": 12,
            "IA": 4,
            "ID": 1,
            "IL": 29,
            "IN": 27,
            "KS": 3,
            "KY": 5,
            "LA": 1,
            "MA": 20,
            "MD": 8,
            "ME": 1,
            "MI": 22,
            "MN": 20,
            "MO": 12,
            "MS": 1,
            "NC": 14,
            "NE": 2,
            "NH": 3,
            "NJ": 6,
            "NM": 2,
            "NV": 3,
            "NY": 57,
            "OH": 29,
            "OK": 6,
            "OR": 29,
            "PA": 29,
            "RI": 1,
            "SC": 5,
            "SD": 3,
            "TN": 45,
            "TX": 44,
            "UT": 11,
            "VA": 14,
            "VT": 3,
            "WA": 70,
            "WI": 12,
            "WV": 1,
            "WY": 2,
            "nan": 513
        },
        "supervisor": {
            "No": 390,
            "Some of them": 350,
            "Yes": 514
        },
        "tech_company": {
            "No": 226,
            "Yes": 1028
        },
        "treatment": {
            "No": 621,
            "Yes": 633
        },
        "wellness_program": {
            "Don't know": 187,
            "No": 839,
            "Yes": 228
        },
        "work_interfere": {
            "Never": 213,
            "Often": 141,
            "Rarely": 173,
            "Sometimes": 464,
            "nan": 263
        }
    }
};


export default initialData 
