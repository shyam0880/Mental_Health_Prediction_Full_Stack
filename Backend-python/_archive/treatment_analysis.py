def treatment_group_counts(df, columns):
    all_counts = {}

    for col in columns:
        if col not in df.columns:
            continue

        grouped = df.groupby(col)['treatment'].value_counts().unstack(fill_value=0)
        grouped_reset = grouped.reset_index()
        all_counts[col] = grouped_reset.to_dict(orient='records')

    return all_counts
