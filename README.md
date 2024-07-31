# Sintese_3D

Esta animação utiliza a biblioteca Three.js para criar uma cena 3D interativa com diversos elementos. O projeto inclui os seguintes componentes:

- **Céu de fundo:** Uma textura de galáxia é aplicada ao fundo da cena para criar um ambiente espacial.
- **Sol:** Um cubo com textura que representa o sol. Ele gira continuamente ao longo do eixo Y.
- **Terra:** Uma esfera com textura que orbita ao redor do sol, girando continuamente.
- **Modelo Externo:** Um modelo 3D carregado no formato GLTF, que é escalado e posicionado na cena. Se um objeto com o nome 'Head' for encontrado no modelo, um coração 3D é anexado a ele. Caso contrário, o coração é posicionado manualmente na cena.
- **Coração:** Um coração 3D extrudido e texturizado, que brilha com uma cor vermelha emissiva. Ele gira juntamente com o modelo externo, se estiver anexado.

Fontes de Iluminação:

O projeto utiliza três fontes de iluminação para criar uma cena bem iluminada e visualmente interessante:

- **Luz Ambiente**:
 - Descrição: Ilumina todos os objetos de maneira uniforme, garantindo que todas as áreas da cena sejam visíveis, mesmo que não estejam diretamente iluminadas por outras fontes de luz.

- **Luz Direcional**:
 - Descrição: Simula a luz proveniente de uma fonte distante, como o sol. Projeta luz paralela em toda a cena, criando sombras definidas e iluminando objetos de maneira direcional.

- **Luz Pontual**:
 - Descrição: Emite luz em todas as direções a partir de um ponto específico, criando uma iluminação localizada e gerando sombras suaves em objetos próximos.

Tecnologias Utilizadas:

- Three.js
- GLTFLoader
- OrbitControls
