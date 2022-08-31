

class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/characters';
    _apiKey = 'apikey=cfabb022b87384c01f9a4b1303f70349';
    _apiOffset = 210;
    getRecurse = async (url) => {
        let res = await fetch(url);

        if(!res.ok) {
            throw new Error(`Could not feth ${url}, status: ${res.status}`)
        }
        return await res.json();
    }

    

    getAllCharacters = async (offset = this._apiOffset) => {
        const res = await this.getRecurse(`${this._apiBase}?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter)
    }
    getCharacter = async (id) => {
        const res = await this.getRecurse(`${this._apiBase}/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (char) => {
        const makeDescription = (descr) => {
            if (descr) {
                return `${descr.slice(0,150)}...`
            } else {
                return 'There should be a description of the presonage'
            }
            
        }
        return {
            id: char.id,
            name: char.name,
            description: makeDescription(char.description),
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
} 

export default MarvelService;