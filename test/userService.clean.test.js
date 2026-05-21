const { UserService } = require('../src/userService');

describe('UserService', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  // --- createUser ---

  describe('createUser', () => {
    test('deve retornar um usuário com id gerado ao criar com dados válidos', () => {
      // Arrange
      const nome = 'Fulano de Tal';
      const email = 'fulano@teste.com';
      const idade = 25;

      // Act
      const usuario = userService.createUser(nome, email, idade);

      // Assert
      expect(usuario.id).toBeDefined();
      expect(usuario.nome).toBe(nome);
      expect(usuario.email).toBe(email);
      expect(usuario.idade).toBe(idade);
      expect(usuario.status).toBe('ativo');
    });

    test('deve lançar erro ao criar usuário menor de idade', () => {
      // Arrange
      const nome = 'Menor';
      const email = 'menor@email.com';
      const idade = 17;

      // Act & Assert
      expect(() => userService.createUser(nome, email, idade)).toThrow(
        'O usuário deve ser maior de idade.'
      );
    });

    test('deve lançar erro ao criar usuário sem nome', () => {
      // Act & Assert
      expect(() => userService.createUser('', 'email@teste.com', 20)).toThrow(
        'Nome, email e idade são obrigatórios.'
      );
    });

    test('deve lançar erro ao criar usuário sem email', () => {
      // Act & Assert
      expect(() => userService.createUser('Fulano', '', 20)).toThrow(
        'Nome, email e idade são obrigatórios.'
      );
    });
  });

  // --- getUserById ---

  describe('getUserById', () => {
    test('deve retornar o usuário correto ao buscar por id existente', () => {
      // Arrange
      const usuarioCriado = userService.createUser('Alice', 'alice@email.com', 28);

      // Act
      const usuarioEncontrado = userService.getUserById(usuarioCriado.id);

      // Assert
      expect(usuarioEncontrado.nome).toBe('Alice');
      expect(usuarioEncontrado.id).toBe(usuarioCriado.id);
    });

    test('deve retornar null ao buscar por id inexistente', () => {
      // Act
      const resultado = userService.getUserById('id-que-nao-existe');

      // Assert
      expect(resultado).toBeNull();
    });
  });

  // --- deactivateUser ---

  describe('deactivateUser', () => {
    test('deve desativar um usuário comum com sucesso', () => {
      // Arrange
      const usuario = userService.createUser('Comum', 'comum@teste.com', 30);

      // Act
      const resultado = userService.deactivateUser(usuario.id);

      // Assert
      expect(resultado).toBe(true);
      expect(userService.getUserById(usuario.id).status).toBe('inativo');
    });

    test('não deve desativar um usuário administrador', () => {
      // Arrange
      const admin = userService.createUser('Admin', 'admin@teste.com', 40, true);

      // Act
      const resultado = userService.deactivateUser(admin.id);

      // Assert
      expect(resultado).toBe(false);
      expect(userService.getUserById(admin.id).status).toBe('ativo');
    });

    test('deve retornar false ao tentar desativar um id inexistente', () => {
      // Act
      const resultado = userService.deactivateUser('id-inexistente');

      // Assert
      expect(resultado).toBe(false);
    });
  });

  // --- generateUserReport ---

  describe('generateUserReport', () => {
    test('deve incluir o cabeçalho no relatório', () => {
      // Arrange
      userService.createUser('Alice', 'alice@email.com', 28);

      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toContain('--- Relatório de Usuários ---');
    });

    test('deve incluir o nome e status do usuário no relatório', () => {
      // Arrange
      userService.createUser('Alice', 'alice@email.com', 28);

      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toContain('Alice');
      expect(relatorio).toContain('ativo');
    });

    test('deve retornar mensagem adequada quando não há usuários cadastrados', () => {
      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toContain('Nenhum usuário cadastrado.');
    });
  });
});
