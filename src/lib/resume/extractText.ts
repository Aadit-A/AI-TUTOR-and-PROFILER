import PDFParser from "pdf2json";

export async function extractTextFromPDF(
    buffer: Buffer
): Promise<string> {

    return new Promise((resolve, reject) => {

        try {

            const pdfParser = new PDFParser();

            pdfParser.on(
                "pdfParser_dataError",
                (errData: any) => {

                    console.error(errData);

                    reject(
                        new Error(
                            "Failed to parse PDF"
                        )
                    );
                }
            );

            pdfParser.on(
                "pdfParser_dataReady",
                (pdfData: any) => {

                    let extractedText = "";

                    for (const page of pdfData.Pages) {

                        for (const text of page.Texts) {

                            for (const run of text.R) {

                                extractedText +=
                                    decodeURIComponent(run.T) + " ";
                            }
                        }
                    }

                    extractedText = extractedText
                        .replace(/\s+/g, " ")
                        .trim();

                    resolve(extractedText);
                }
            );

            pdfParser.parseBuffer(buffer);

        } catch (error) {

            console.error(error);

            reject(
                new Error(
                    "Failed to extract text from PDF"
                )
            );
        }
    });
}