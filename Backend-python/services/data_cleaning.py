import pandas as pd

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    df = df.drop_duplicates()
    df = df[(df['Age'] >= 0) & (df['Age'] <= 100)]

    df['Gender'].replace(
        ['Male ', 'male', 'M', 'm', 'Male', 'Cis Male', 'Man', 'cis male', 'Mail',
         'Male-ish', 'Male (CIS)', 'Cis Man', 'msle', 'Malr', 'Mal', 'maile', 'Make'],
        'Male', inplace=True)

    df['Gender'].replace(
        ['Female ', 'female', 'F', 'f', 'Woman', 'Female', 'femail', 'Cis Female',
         'cis-female/femme', 'Femake', 'Female (cis)', 'woman'],
        'Female', inplace=True)

    df['Gender'].replace(
        ['Female (trans)', 'queer/she/they', 'non-binary', 'fluid', 'queer',
         'Androgyne', 'Trans-female', 'male leaning androgynous', 'Agender',
         'A little about you', 'Nah', 'All', 'ostensibly male, unsure what that really means',
         'Genderqueer', 'Enby', 'p', 'Neuter', 'something kinda male?',
         'Guy (-ish) ^_^', 'Trans woman'],
        'Other', inplace=True)

    return df

def treatment_group_counts(df: pd.DataFrame, columns: list) -> dict:
    all_counts = {}
    for col in columns:
        if col not in df.columns:
            continue
        grouped = df.groupby(col)['treatment'].value_counts().unstack(fill_value=0)
        grouped_reset = grouped.reset_index()
        all_counts[col] = grouped_reset.to_dict(orient='records')
    return all_counts
