const userSelect = '_id email altEmails displayName name avatarPublicId reviews darkMode';
const reviewSelect = '-__v';
const beerSelect =
    '_id beerName brewery style degrees abv bi logoPublicId description averageRating totalNumberOfRatings';
const tempBeerSelect = beerSelect + ' tempBeer tempBrewery';
const brewerySelect = '-__v -sumOfAllBeerRatings -dateCreated';

const averageRound = (a, b, c) => {
    const x = Math.pow(10, c || 0);
    return Math.round((a / b) * x) / x;
};

module.exports = { userSelect, reviewSelect, beerSelect, tempBeerSelect, brewerySelect, averageRound };
