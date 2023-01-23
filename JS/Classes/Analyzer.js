import Lex from "./Lex.js"

export default class Analyzer {
    constructor(prgrmText)
    {
        // - Текст программы на обед
        this.prgrmText = prgrmText

        // - Состояния автомата с типами лексем
        this.table = 
        {
            start:   { 
                number:  {state: 'number' },
                name:  {state: 'name' }, 
                op: {state: 'op'},
                special: {state: 'special'}, 
                indent:  {state: 'indent' },
                newline: {state: 'newline'},
                null:    {state: 'null'   },
                EOL:     {res:   'EOL'    },
            },
            number:  { 
                number:  {state: 'number' }, 
                name:    {state: 'null'   }, 
                op:      {res:   'number' },
                special: {res:   'number' },
                indent:  {res:   'number' },
                newline: {res:   'number' },
                null:    {state: 'null'   },
                EOL:     {res:   'number' },
            },
            name:  { 
                number:  {state: 'name' },
                name:    {state: 'name' }, 
                op:      {res:   'name' },
                special: {res:   'name' },
                indent:  {res:   'name' },
                newline: {res:   'name' },
                null:    {state: 'null' },
                EOL:     {res:   'name' },
            },
            op:  { 
                number:  {res:   'op'  },
                name:    {res:   'op'  }, 
                op:      {state: 'op'  },
                special: {res:   'op'  },
                indent:  {res:   'op'  },
                newline: {res:   'op'  }, 
                null:    {state: 'null'},
                EOL:     {res:   'op'  },
            },
            special: {
                number:  {res:   'special'},
                name:    {res:   'special'},
                op:      {res:   'special'},
                special: {res:   'special'},
                indent:  {res:   'special'},
                newline: {res:   'special'},
                null:    {state: 'null'   },
                EOL:     {res:   'special'},
            },
            indent: {
                number:  {res:   'indent'},
                name:    {res:   'indent'},
                op:      {res:   'indent'},
                special: {res:   'indent'},
                indent:  {state: 'indent'},
                newline: {res:   'indent'},
                null:    {state: 'null'  },
                EOL:     {res:   'indent'},
            },
            newline: {
                name:    {res:   'newline'},
                op:      {res:   'newline'},
                special: {res:   'newline'},
                indent:  {res: 'newline'},
                newline: {res:   'newline'},
                null:    {state: 'null'  },
                EOL:     {res:   'newline'},                
            },
            null:  { 
                number:  {state: 'null'   },
                name:  {state: 'null'   },
                op: {res:   'null'   }, 
                special: {res:   'null'   },
                indent:  {res:   'null'   },
                newline: {state: 'null'   },
                null:    {state: 'null'   },
                EOL:     {res:   'null'   },
            },
        }

        // - Результат анализа
        this.result = []
    }

    symbolClass(char) { 
        switch (true) {
          case char === 'EOL': return "EOL";
          case /[0-9]/.test(char): return "number";
          case /[a-zA-Z]/.test(char): return "name";
          case /[\-,\+,.\,,*,/,;<,>,(,),\[,\],~,`,@,#,$,%,^,&,{,}.?,_,=,|,:,!,^,?)]/.test(char): return "op";
          case char == ' ' : return "indent";
          case /[\n]/.test(char) : return "newline";
          case /[\r,\s]/.test(char) : return "special";
          default : return "null";
        }
    }

    Analyze()
    {
        let i = 0;
        let state = 'start';
        let shift = true;
        let pos = 0;
        let symbol = ''
        let lex, symClass

        for(i = 0; i<=this.prgrmText.length; i++) {
          symbol = this.prgrmText[i] || 'EOL';
          symClass = this.symbolClass(symbol);
          state = this.table[state][symClass];

          if(state.res) {
            lex = new Lex(0, state.res, this.prgrmText.slice(pos,i))
            this.result.push({
              Type: lex.type,
              Value: lex.value,
            });
    
            state = 'start';
            pos = i;
            i = shift ? i-1 : i;
            
            shift = false;        
          } 
          else {
            
            state = state.state;
            
            shift = true;
          }
        }
        return this.result
    }
}