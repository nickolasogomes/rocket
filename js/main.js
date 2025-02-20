$(function() {
  // Efeito de fadeIn para os cards de curso
  $('.course-card').hide().fadeIn(1000);

  // Inicializa máscara para telefone
  const phoneInput = $('#phone');
  if (phoneInput.length) {
    phoneInput.mask('(00) 00000-0000');
  }

  // Função para exibir alertas de erro
  function showAlert(errors) {
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return true;
    }
    return false;
  }

  // Formulário de Cadastro
  $('#cadastroForm').on('submit', function(e) {
    e.preventDefault();
    const nome = $('#nome').val().trim();
    const email = $('#email').val().trim();
    const password = $('#password').val();
    const confirmPassword = $('#confirmPassword').val();
    const gender = $('#gender').val();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let errors = [];

    if (!nome) errors.push("O nome é obrigatório.");
    if (!email || !emailRegex.test(email)) errors.push("Informe um e-mail válido.");
    if (password.length < 6) errors.push("A senha deve ter no mínimo 6 caracteres.");
    if (password !== confirmPassword) errors.push("As senhas não conferem.");
    if (!gender) errors.push("Selecione um gênero.");
    if (!$('#terms').is(':checked')) errors.push("Você deve aceitar os termos e condições.");

    if (showAlert(errors)) return;

    const userData = { nome, email, gender };
    localStorage.setItem("user", JSON.stringify(userData));
    
    fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(() => {
      alert("Cadastro realizado com sucesso!");
      $('#cadastroForm')[0].reset();
    })
    .catch(() => alert("Erro ao realizar cadastro. Tente novamente."));
  });

  // Formulário de Login
  $('#loginForm').on('submit', function(e) {
    e.preventDefault();
    const email = $('#email').val().trim();
    const password = $('#password').val();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let errors = [];

    if (!email || !emailRegex.test(email)) errors.push("Informe um e-mail válido.");
    if (!password) errors.push("A senha é obrigatória.");

    if (showAlert(errors)) return;

    let storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && email === storedUser.email) {
      alert("Login realizado com sucesso!");
      $('#loginForm')[0].reset();
    } else {
      alert("Usuário não encontrado.");
    }
  });

  // Carregamento dinâmico de cursos
  if ($('#highlightCoursesContent').length) {
    const fakeCourses = [
      { name: "NLP Tokenization", image: "https://img-c.udemycdn.com/course/750x422/6060633_b445.jpg", description: "Desbloqueie o poder do NLP." },
      { name: "Basic Python", image: "https://img-c.udemycdn.com/course/750x422/5779686_63e2_2.jpg", description: "Introdução ao Python." },
      { name: "Python Modules", image: "https://img-c.udemycdn.com/course/750x422/6067565_0eb2.jpg", description: "Domine módulos do Python." }
    ];
    
    fakeCourses.forEach((course, index) => {
      $('#highlightCoursesContent').append(`
        <div class="carousel-item${index === 0 ? ' active' : ''}">
          <div class="d-flex justify-content-center align-items-center" style="height:400px;">
            <div class="card course-card">
              <img src="${course.image}" class="card-img-top" alt="${course.name}">
              <div class="card-body">
                <h5 class="card-title">${course.name}</h5>
                <p class="card-text">${course.description}...</p>
                <a href="#" class="btn btn-outline-primary">Ver Curso</a>
              </div>
            </div>
          </div>
        </div>`);
    });

    //API Udemy

    fetch("https://udemy-paid-courses-for-free-api.p.rapidapi.com/rapidapi/courses/search?page=1&page_size=15&query=python", {
      method: "GET",
      headers: {
        "X-Rapidapi-Key": "ab0d264becmsh572292e3d024a68p14a0bfjsnf1059247d6b0",
        "X-Rapidapi-Host": "udemy-paid-courses-for-free-api.p.rapidapi.com"
      }
    })
    .then(response => response.json())
    .then(data => {
      const courses = data.courses || [];
      courses.forEach(course => {
        $('#otherCoursesContainer').append(`
          <div class="col-md-4 col-lg-3 mb-4">
            <div class="card course-card h-100">
              <img src="${course.image}" class="card-img-top" alt="${course.name}">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${course.name.substring(0, 30)}...</h5>
                <p class="card-text flex-grow-1">${course.description.substring(0, 100)}...</p>
                <a href="${course.clean_url}" target="_blank" class="btn btn-outline-primary mt-2">Ver Curso</a>
              </div>
            </div>
          </div>`);
      });
    })
    .catch(error => console.error('Erro ao carregar cursos via API:', error));
  }
});
