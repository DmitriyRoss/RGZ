import readline from "node:readline";
import { Builder, By } from "selenium-webdriver";

const rlInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const getUserInput = (question) =>
    new Promise((resolve, reject) => {
        rlInterface.question(question, (input) => {
            rlInterface.close();
            resolve(input);
        });
    });

const forbiddenKeywords = [
    "?",
    "#",
    "File:",
    "Wikipedia:",
    "Template:",
    "Talk:",
    "Portal:",
    "Special:",
    "Help:",
    "(disambiguation)",
];

const main = async () => {
    const initialArticleTitle = await getUserInput("Enter the title of the article: ");

    const driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions({ headless: true })
        .build();
    
    const visitedURLs = new Set();

    let currentURL = `https://en.wikipedia.org/wiki/${initialArticleTitle}`;

    const keywordsToSearch = ["Філософія", "Philosophy", "філософія", "philosophy"];

    visitedURLs.add(currentURL);
    let isKeywordFound = false;
    let noMoreLinks = false;

    try {
        await driver.get(currentURL);

        let stepCounter = 0;
        for (; stepCounter < 100; stepCounter++) {
            const currentTitle = await driver.getTitle();
            console.log(`Visited: ${currentTitle}: Step ${stepCounter} - URL: ${currentURL}`);

            isKeywordFound = keywordsToSearch.some((keyword) => currentTitle.includes(keyword));

            if (isKeywordFound) {
                console.log("TRUE");
                break;
            }

            const linksOnPage = await driver.findElements(By.className("mw-redirect"));
            const previousURL = currentURL;

            for (const linkElement of linksOnPage) {
                const linkHref = await linkElement.getAttribute("href");
                if (!linkHref) continue;

                const isValidLink =
                    !forbiddenKeywords.some((keyword) => linkHref.includes(keyword)) &&
                    !visitedURLs.has(linkHref);

                if (isValidLink) {
                    try {
                        visitedURLs.add(linkHref);
                        currentURL = linkHref;
                        await linkElement.click();
                        break;
                    } catch (error) {
                        currentURL = previousURL;
                    }
                }
            }

            if (currentURL === previousURL) {
                console.log("FALSE: No valid links");
                noMoreLinks = true;
                break;
            }
        }

        if (!isKeywordFound && !noMoreLinks) {
            console.log("FALSE: More than 100 steps");
        }
    } catch (error) {
        console.log(error);
    } finally {
        await driver.quit();
    }
};

main();
