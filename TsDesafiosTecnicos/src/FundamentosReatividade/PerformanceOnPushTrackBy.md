# 2.4. Performance — OnPush e trackBy

### 1. O que é o `trackBy` e por que ele ajuda?

**O Problema (Como o Angular trabalha sem ele):**
Imagine que você tem uma lousa com 500 nomes anotados. De repente, a lista de nomes recebe uma pequena atualização. O que o Angular faz por padrão? Ele **apaga a lousa inteira e reescreve os 500 nomes do zero**, mesmo que 499 nomes ainda sejam os mesmos! Fazer isso na tela do computador exige muito esforço e deixa o site lento e travando.

**A Solução com o `trackBy`:**
O `trackBy` é como dar um "RG" ou "Crachá" (um ID único) para cada item da lista.
Quando a lista atualiza, o Angular olha para os crachás. Se ele vê que o crachá "123" já está na lousa, ele não apaga a linha dele, apenas reaproveita e atualiza se tiver alguma letrinha diferente. Ele só vai ter o trabalho de apagar ou escrever os nomes que realmente saíram ou entraram. Isso deixa tudo muito mais rápido!

**Como fazer no código:**
```html
<!-- Se for Angular mais novo (versão 17+): -->
@for (item of itens; track item.id) {
  <li>{{ item.nome }}</li>
}

<!-- Se for no Angular mais antigo (usando *ngFor): -->
<li *ngFor="let item of itens; trackBy: trackPorId">
  {{ item.nome }}
</li>
```
*(No código mais antigo, você precisaria de uma função no TypeScript para retornar o ID).*

---

### 2. O que é o `OnPush` e como ele reduz o trabalho à toa?

**Como funciona:**
O Angular, por natureza, é super "preocupado". Se qualquer coisinha acontece na tela (como você digitar uma letra lá do outro lado do site ou clicar num botão qualquer), o Angular corre e verifica o site **inteiro**, incluindo a sua lista de 500 itens, perguntando: *"Será que mudou alguma coisa aqui?"*. Ele faz isso sem parar.

A estratégia **`OnPush`** é como pendurar uma placa de **"Não Perturbe"** na sua lista. 

Com o `OnPush`, o Angular **pula** a sua lista e não fica verificando ela à toa. Ele só vai entrar lá para atualizar a tela se:
1. Você entregar uma lista física totalmente nova para ele.
2. Alguém clicar em um botão especificamente de dentro da sua lista.

Isso é excelente porque poupa o computador de fazer centenas de verificações inúteis, deixando o site muito mais leve.

---

### 3. O que acontece se a gente não usar isso (usar o modo Default)?

Se a gente não colocar essa placa de "Não Perturbe" (ou seja, se a gente deixar o comportamento padrão do Angular, que é o **Default**), teremos um problemão.

**O Impacto:**
Como sua lista tem centenas de itens, cada vez que o usuário interagir com o site (abrir um menu em cima, digitar uma tecla na barra de busca), o Angular vai parar tudo para conferir os 500 itens, um por um.

**Na prática:** Isso significa que **o site vai ficar lento, travando e engasgado**. A tela pode dar umas "congeladas" quando o usuário tentar usar o sistema, porque o "cérebro" do navegador estará sufocado checando centenas de coisas que nem precisavam ser checadas naquele momento.
