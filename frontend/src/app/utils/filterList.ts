// RETURNS FILTERED GIVEN list ONLY WITH OBJECTS THAT INCLUDE THE GIVEN terms PRESENT IN ANY OF THE GIVEN columns

// -IT WON'T IGNORE THE PRESENCE OF ACCENTUATION IN terms, ONLY THE LACK OF IT
// -IF A COLUMN REPRESENTS AN OBJECT PROPERTY, IT MUST BE PASSED AS: "object.prop"
// -IF A COLUMN REPRESENTS AN ARRAY, IT MUST BE PASSED AS: "array!"
// -IF A COLUMN REPRESENTS AN ARRAY WITH AN OBJECT, IT MUST BE PASSED AS: "array!.prop"
// -ARRAYS DIRECTLY WITHIN ANOTHER ARRAY ARE NOT SUPPORTED

// EXAMPLE:
// -ELEMENT: { favFood: 'maçã', favThings: [{ books: false, activity: 'cozinhar', days: { weekdays: 3, weekends: 1 } }] }
// -COLUMNS: ['favFood', 'favThings!activity', 'favThings!days.weekdays']
// -TERMS THAT WOULD RETURN THIS OBJECT IF PRESENT IN list: 'maca', 'cozinhar', '3', 'nao'
// -TERMS THAT WOULD NOT RETURN THIS OBJECT IF PRESENT IN list: '1', 'sim'

export function filterList<List>(list: List[], terms: string[], columns: string[]): List[] {
  return list.filter(row => {
    let rowMatches: boolean = true
    const fields: string[] = []
    const normalizedFields: string[] = []

    function gatherField(field: unknown): string {
      if(typeof field == 'string') return field.toLowerCase()
      if(typeof field == 'number') return field.toString()
      if(typeof field == 'boolean') return field ? 'sim' : 'não'
      if(field instanceof Date) return field.toLocaleDateString('pt-br')

      else throw TypeError
    }

    function crawl(props: string[], value: unknown, start: number): void {
      for(let i = start; i < props.length; i++) {
        if(props[i].includes('!') && i != props.length-1) value![props[i].replace('!', '')].forEach(el => crawl(props, el, i+1))
    
        else if(props[i].includes('!') && i == props.length-1) value![props[i].replace('!', '')].forEach(el => fields.push(gatherField(el)))
    
        else fields.push(gatherField(value![props[i]]))
      }
    }

    // GATHERING ROW'S VALUES BASED ON GIVEN COLUMNS TO CONSIDER
    columns.forEach(column => {
      if(!column.includes('.')) fields.push(gatherField(row[column]))
      else {
        const props = column.split('.')
        let value: unknown = row[props[0]]

        crawl(props, value, 1)
      }
    })

    // CREATING COPY LIST OF VALUES WITHOUT ACCENTS
    fields.forEach(field => {
      normalizedFields.push(
        field
          .replace(/[ãáàâ]/, 'a')
          .replace(/[éê]/, 'e')
          .replace(/[í]/, 'i')
          .replace(/[õóô]/, 'o')
          .replace(/[ú]/, 'u')
          .replace(/[ç]/, 'c')
      )
    })

    // CHECKING IF ANY TERM IS PRESENT IN ANY OF THE VALUES
    for(let term of terms) {
      let aFieldMatches = false

      term = term.toString().trim().toLowerCase()

      for(let i = 0; i < fields.length; i++) {
        if(fields[i].includes(term) || normalizedFields[i].includes(term)) {
          aFieldMatches = true
          break
        }
      }

      if(!aFieldMatches) {
        rowMatches = false
        break
      }
    }

    return rowMatches
  })
}