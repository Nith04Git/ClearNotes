window.addEventListener(
    "load",
    async () => {

        try {

            const school =
                JSON.parse(
                    localStorage.getItem(
                        "chosenSchool"
                    )
                );

            if (
                !school ||
                school.lat === undefined ||
                school.lon === undefined
            ) {
                return;
            }

let iconPath = "";

const hour = new Date().getHours();
if (hour >= 17 && hour < 21) {
return;
}

let wordingContext;

if (hour >= 21) {
wordingContext = "tomorrow";
}
else{
wordingContext = "today";
}

            const latitude =
                Number(school.lat);

            const longitude =
                Number(school.lon);

            const response =
                await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,precipitation_probability_max,temperature_2m_max,wind_speed_10m_max&timezone=auto`
                );

            const weather =
                await response.json();

            const rainChance =
                weather.daily
                ?.precipitation_probability_max?.[0] || 0;

            const maxTemp =
                weather.daily
                ?.temperature_2m_max?.[0] || 0;

            const maxWind =
                weather.daily
                ?.wind_speed_10m_max?.[0] || 0;

            const weatherCode =
                weather.daily
                ?.weathercode?.[0] || 0;

            let confidence = 0;

            let title = "";
            let message = "";

            /*
                Rain scoring
            */

            if (rainChance >= 90) {
                confidence += 50;
            }
            else if (rainChance >= 75) {
                confidence += 35;
            }
            else if (rainChance >= 50) {
                confidence += 20;
            }

            /*
                Heat scoring
            */

            if (maxTemp >= 40) {
                confidence += 40;
            }
            else if (maxTemp >= 36) {
                confidence += 20;
            }

            /*
                Wind scoring
            */

            if (maxWind >= 50) {
                confidence += 20;
            }

            /*
                Weather recommendation
            */

            if (rainChance >= 80) {
iconPath =
        "climate_icons/heavyrainy.png";


                title =
                    "There could be heavy rainfall.";

                message =
                    `It's ${rainChance}% likely to rain near your school. It is encouraged to carry an umbrella, rain coat, bag cover, and to prioritize on protecting notebooks from water damage.`;

            }

            else if (
                maxTemp >= 38
            ) {
    iconPath =
        "climate_icons/heat.png";

                title =
                    "High heat in your area.";

                message =
                    `Temperatures could reach ${maxTemp}°C near your school ${wordingContext}. It is encouraged to carry water and stay hydrated, while avoiding wearing heavy coats or jackets.`;

            }

            else if (
                rainChance >= 40
            ) {
iconPath =
        "climate_icons/rainy.png";

                title =
                    "Possibly, there is chance of rain in your area.";

                message =
                    `There is a ${rainChance}% chance of rain near your school ${wordingContext}. Carrying an umbrella may be helpful.`;

            }

            /*
                Extreme weather codes
            */

            if (
                weatherCode >= 95
            ) {

iconPath =
    "climate_icons/thunderstorm.png";

                title =
                    "There seems to be severe thunderstorms brewing.";

                message =
                    `Thunderstorm conditions are forecast near your school ${wordingContext}. It is heavily suggested to validate these conditions and take necessary precautions if needed.`;

                confidence += 30;

            }

            /*
                Only show card if relevant
            */

            if (confidence < 20) {
                return;
            }

            const card =
                document.getElementById(
                    "academic-climate-card"
                );

            const titleBox =
                document.getElementById(
                    "academic-climate-title"
                );

            const messageBox =
                document.getElementById(
                    "academic-climate-message"
                );

            let climateSection =
                document.getElementById(
                    "academic-climate-section"
                );

const climateIcon =
    document.getElementById(
        "academic-climate-icon"
    );

if (iconPath) {

    climateIcon.src =
        iconPath;

    climateIcon.style.display =
        "block";

}

            titleBox.textContent = title;
            messageBox.textContent = message;
            climateSection.style.display = "block";
            card.style.display =
                "block";

        }

        catch (error) {
            console.error(
                "Academic Climate Engine:",
                error
            );
        }
    }
);
