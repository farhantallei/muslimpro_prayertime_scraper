const express = require('express');
const request = require('request-promise');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const PORT = process.env.PORT;
const apiKey = process.env.API_KEY;
const baseUrl = `http://api.scraperapi.com?api_key=${apiKey}&autoparse=true`;

app.use(express.json());

app.get('/', async (req, res) => {
    function parse() {
        return new Promise((resolve, reject) => {
            request(
                `${baseUrl}&url=https://www.muslimpro.com/id/Waktu-sholat-Bandung-Indonesia-1650357`,
                (error, response, body) => {
                    if (error) return reject(error);
                    if (response.statusCode !== 200)
                        return reject('no result.');
                    try {
                        const days = [];

                        const splitBody = body.split(
                            '<td class="prayertime-1">'
                        );

                        const dayEls = [
                            ...splitBody.slice(0, 0),
                            ...splitBody.slice(1, splitBody.length),
                        ];

                        for (var i = 0; i < dayEls.length; i++) {
                            const subuh = dayEls[i].split(
                                '</td><td class="prayertime">'
                            )[1];
                            const terbit = dayEls[i].split(
                                '</td><td class="prayertime">'
                            )[2];
                            const dzuhur = dayEls[i].split(
                                '</td><td class="prayertime">'
                            )[3];
                            const ashar = dayEls[i].split(
                                '</td><td class="prayertime">'
                            )[4];
                            const maghrib = dayEls[i].split(
                                '</td><td class="prayertime">'
                            )[5];
                            const isya = dayEls[i]
                                .split('</td><td class="prayertime">')[6]
                                .split('</td></tr>')[0];

                            days.push({
                                date: i + 1,
                                time: {
                                    subuh,
                                    terbit,
                                    dzuhur,
                                    ashar,
                                    maghrib,
                                    isya,
                                },
                            });
                        }
                        resolve(days);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }

    try {
        const result = await parse();

        res.json({ result });
    } catch (error) {
        res.json({ error });
    }
});

app.listen(PORT, () => console.log(`Server run on: ${PORT}`));
