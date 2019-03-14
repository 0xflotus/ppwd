const crypto = require("crypto"),
  https = require("https");

if (3 > process.argv.length) {
  console.log("Please specify a password");
} else {
  process.argv.slice(2).forEach(pw => {
    const shasum = crypto.createHash("sha1");
    shasum.update(pw);
    const shaRes = shasum.digest("hex").toUpperCase();

    const [head, tail] = [shaRes.slice(0, 5), shaRes.slice(5)];

    https.get("https://api.pwnedpasswords.com/range/" + head, res => {
      const arrayBuffer = [];

      res
        .on("data", data => {
          arrayBuffer.push(data.toString());
        })
        .on("end", () => {
          const result = arrayBuffer
            .join("")
            .split("\r\n")
            .map(string => string.split(":"))
            .filter(arr => arr[0] === tail);

          console.log(
            "%s occurrences of '%s' with hash <%s>",
            result[0] ? result[0][1] : 0,
            pw,
            shaRes
          );
        });
    });
  });
}
