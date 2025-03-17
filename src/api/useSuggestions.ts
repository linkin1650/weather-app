export const useSuggestions = () => {
    const suggestionsFetcher = (url: string) => fetch(url).then((res) => res.json())

    return {
        suggestionsFetcher,
    }
}