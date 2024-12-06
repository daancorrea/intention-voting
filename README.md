## O projeto

Esse sistema tem como foco o `back-end` sendo que o `front-end` é apenas um facilitador para visualizar as requisições da API.

É um sistema com o objetivo de trazer os dados de intenções de votos através de arquivos CSV e consultando dados do IBGE.

**Como funciona:**
*Processamento do CSV*
 
- O arquivo .CSV precisa ter os campos:
  - ["ID_PESQUISA", "DATA_PESQUISA", "MUNICÍPIO", "ESTADO", "INTENÇÃO DE VOTO"]
- Arquivo CSV validado com as colunas corretas, vai processar e persistir os dados em uma tabela.

*Atualização da base com dados do IBGE*
- O botão `Atualizar base 2024` faz uma chamada a API.
- Ele verifica se a base local está atualizada.
- Se não tiver, faz uma busca no site do *IBGE* com a estimativa da população anual.
- Se encontra o *PDF* ele extrai as informações do PDF e persiste os dados na base local.

*Cruzamento de dados*
- No `INPUT` é colocado o ID da pesquisa. (ex: P1)
- Ele puxa os dados persistidos referente a pesquisa.
- Puxa a população da cidade na base atualizada com o *IBGE*.
- Separa por candidato (*A* e *B*).
- Verifica a intenção de voto da cidade e faz a somatória agrupando a cidade ao estado.
- Calcula a `porcentagem` de intenção de voto por estado.

Os dados são tratados e retornados da seguinte maneira:
Ex de busca para o ID de Pesquisa "P4".

```json
{
	"searchId": "P4",
	"states": [
		{
		"state": "PE",
		"statePopulation": 5115080,
		"percentVoting": 65,
		"candidateAhead": "A"
		},
		...
	],
	"totalPopulation": 109112526,
	"leaderOverall": {
			"A": 11,
			"B": 16
	}
}
```

--- 
### Para rodar o projeto:
Entre na pasta `api`
1. Instale as dependencias `npm install`
2. Suba o banco *PostgreSQL* com o comando `docker compose up`
3. Gere o arquivo prisma `npx prisma generate`
4. Rode as migrations `npx prisma migrate up`
5. Rode o projeto `npm run dev`

Para o front-end:
1. Entre na pasta `app`
2. Instale as dependencias `npm install`
3. Rode o projeto `npm run dev`

Vou subir na pasta raíz exemplos de CSV e o arquivo *.env* não contém dados sensíveis, vai estar na pasta `api`.

---
### Tecnologias 

Back-end:
* NodeJs
* Express
* Typescript
* Prisma
* PostgreSQL
- Bibliotecas para tratamento de PDF e CSV

Front-end:
- React
- Typescript
- Tailwind
--- 
### Pontos de melhoria para o projeto:
- Tratamento de erros.
- Níveis de logs.
- Testes (unitários e integração).
- Refatoração de alguns métodos (isolamento para respeitar Single-Responsibility).
- Nomenclaturas.