import { spawn } from "child_process";

export async function suggestTags(
  input: string
): Promise<string[]> {

  return new Promise((resolve, reject) => {

    const py = spawn("python", [
      "src/lib/ml/predict.py",
      input
    ]);

    let result = "";

    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (err) => {

  console.error("PYTHON ERROR:");

  console.error(err.toString());
});

    py.on("close", () => {

      try {

        const tags = JSON.parse(result);

        resolve(tags);

      } catch (err) {

        reject(err);
      }
    });
  });
}