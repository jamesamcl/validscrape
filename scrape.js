
let fs = require('fs')
let pdf = require('pdf-parse')

async function main() {

    let dataBuffer = fs.readFileSync('sbol.pdf')

    let rules = []

    await pdf(dataBuffer, {
        pagerender: renderPage
    })

    async function renderPage(pageData) {

        let t = await pageData.getTextContent({
            normalizeWhitespace: true,
            disableCombineTextItems: false
        })

        let inRule = false
        let ruleNum = ''
        let ruleText = []

        for(let i = 0; i < t.items.length; ++ i) {
            let s = t.items[i].str
            let match = s.match(/sbol\-[0-9]+/g)

            if(match && match.length > 0) {
                if(inRule) {
                    rules.push({
                        num: ruleNum,
                        page: pageData.pageIndex,
                        text: ruleText.join(' ').trim()
                    })
                    ruleText = []
                }
                inRule = true
                ruleNum = match[0]
            } else {
                ruleText.push(s.trim())
            }

        }


        return Promise.resolve(t)
    }

    console.log(JSON.stringify(rules, null, 2))
}

main()


