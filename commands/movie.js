const Command = require('../handlers/commandHandler');

class TitleCommand extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Get information about a movie.',
            'longDescription': 'TODO',
            'usage': 'Movie Name or IMDb ID',
            'visible': true,
            'restricted': false,
            'weight': 999
        });
    }

    async process(message) {
        if (!message.arguments[0])
            return this.client.handlers.embed.error(message.channel.id, `${this.info.usage} required.`);
        const query = message.arguments.join(' ');

        const status = await this.client.handlers.embed.create(message.channel.id, {
            'title': 'Searching...'
        });

        const movie = await this.client.handlers.api.title(query);
        if (movie.error) return this.client.handlers.embed.error(status, movie.error);

        this.client.handlers.embed.edit(status, {
            'url': movie.imdb_id ? `https://www.imdb.com/title/${movie.imdb_id}` : `https://www.themoviedb.org/movie/${movie.id}`,
            'title': movie.title,
            'description': movie.overview,
            'thumbnail': `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            'fields': [{
                'name': 'Status',
                'value': movie.status
            }, {
                'name': 'Release Year',
                'value': new Date(movie.release_date).getFullYear()
            }, {
                'name': 'Runtime',
                'value': `${movie.runtime} Minutes`
            }, {
                'name': 'Adult',
                'value': movie.adult ? 'Yes' : 'No'
            }, {
                'name': 'Genres',
                'value': movie.genres.map(genre => genre.name).join(', '),
                'inline': false
            }, {
                'name': 'Countries',
                'value': movie.production_countries.map(country => country.name).join(', '),
                'inline': false
            }, {
                'name': 'Languages',
                'value': movie.spoken_languages.map(language => language.name).join(', '),
                'inline': false
            }, {
                'name': 'Budget',
                'value': movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'
            }, {
                'name': 'Revenue',
                'value': movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'
            }, {
                'name': 'Homepage',
                'value': movie.homepage || 'N/A',
                'inline': movie.homepage ? false : true
            }, {
                'name': 'Vote Average',
                'value': movie.vote_average ? movie.vote_average.toString() : 'N/A'
            }, {
                'name': 'Vote Count',
                'value': movie.vote_count ? movie.vote_count.toString() : 'N/A'
            }, {
                'name': 'IMDb ID',
                'value': movie.imdb_id || 'N/A'
            }, {
                'name': 'TMDb ID',
                'value': movie.id
            }].map(field => ({ ...field, 'inline': typeof field.inline === 'boolean' ? field.inline : true })),
            'footer': `Data sourced from The Movie Database`
        });
    }
}

module.exports = TitleCommand;