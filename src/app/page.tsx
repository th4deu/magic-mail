import CreateBoxForm from '@/components/CreateBoxForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <CreateBoxForm />
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-violet-100 rounded-full text-sm font-medium text-violet-600 mb-4">
            Por que usar?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Dois super poderes
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Email Mode Card */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-cyan-300 transition-all hover:shadow-lg">
            <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Email Temporário</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Cansado de spam? Use um email descartável para cadastros em sites. Receba confirmações e verificações sem poluir seu email real.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-600">
                <span className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Receba de qualquer site
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <span className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Zero spam no email real
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <span className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Emails chegam na hora
              </li>
            </ul>
          </div>

          {/* Anonymous Mode Card */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-pink-300 transition-all hover:shadow-lg">
            <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Mensagens Secretas</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Receba mensagens anônimas de qualquer pessoa. Perfeito para feedbacks honestos, confissões ou aquela pergunta que ninguém tem coragem de fazer.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-600">
                <span className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                100% anônimo
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <span className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Compartilhe nas redes
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <span className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Feedbacks sinceros
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-emerald-100 rounded-full text-sm font-medium text-emerald-600 mb-4">
              Super simples
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              3 passos e pronto
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-violet-500 rounded-full flex items-center justify-center text-3xl font-black text-white mx-auto mb-6 hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Escolha um nome</h3>
              <p className="text-gray-500">
                Pode ser qualquer coisa! A gente sugere nomes legais se você quiser.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center text-3xl font-black text-white mx-auto mb-6 hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pegue o link</h3>
              <p className="text-gray-500">
                Use o email para cadastros ou compartilhe o link para receber mensagens.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center text-3xl font-black text-white mx-auto mb-6 hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Receba tudo</h3>
              <p className="text-gray-500">
                Emails e mensagens chegam instantaneamente na sua caixa secreta.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-amber-100 rounded-full text-sm font-medium text-amber-600 mb-4">
            Para que usar?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mil e uma utilidades
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Um email temporário serve para muito mais do que você imagina
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Cadastros em sites */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Cadastros em sites</h3>
            <p className="text-sm text-gray-500">Teste apps, sites e serviços sem usar seu email real. Evite spam eterno.</p>
          </div>

          {/* Feedbacks anônimos */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-pink-300 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Feedbacks anônimos</h3>
            <p className="text-sm text-gray-500">Receba opiniões sinceras de clientes, alunos ou funcionários sem constrangimento.</p>
          </div>

          {/* Testes de desenvolvimento */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-emerald-300 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Testes de desenvolvimento</h3>
            <p className="text-sm text-gray-500">Desenvolvedores podem testar envio de emails sem usar contas reais.</p>
          </div>

          {/* Promoções e cupons */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-amber-300 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Promoções e cupons</h3>
            <p className="text-sm text-gray-500">Pegue cupons e promoções de lojas sem encher sua caixa de entrada.</p>
          </div>

          {/* Caixa de sugestões */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-violet-300 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Caixa de sugestões</h3>
            <p className="text-sm text-gray-500">Crie um canal anônimo para sua empresa receber ideias e sugestões.</p>
          </div>

          {/* Confissões secretas */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-rose-300 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Confissões secretas</h3>
            <p className="text-sm text-gray-500">Deixe amigos ou crushes mandarem mensagens sem saber quem enviou.</p>
          </div>

          {/* Perguntas anônimas */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-indigo-300 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Perguntas anônimas</h3>
            <p className="text-sm text-gray-500">Influencers e criadores podem receber perguntas tipo &quot;Ask me anything&quot;.</p>
          </div>

          {/* Newsletters sem spam */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-cyan-300 hover:shadow-lg transition-all group">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Newsletters sem spam</h3>
            <p className="text-sm text-gray-500">Assine newsletters que você quer testar sem poluir seu email principal.</p>
          </div>
        </div>
      </div>

      {/* Fun facts */}
      <div className="container mx-auto px-4 py-20 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center border-2 border-gray-100 hover:border-violet-300 transition-colors">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">100%</div>
              <div className="text-sm text-gray-500">Privado</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border-2 border-gray-100 hover:border-pink-300 transition-colors">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">2s</div>
              <div className="text-sm text-gray-500">Para criar</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border-2 border-gray-100 hover:border-emerald-300 transition-colors">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">Grátis</div>
              <div className="text-sm text-gray-500">Sempre</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border-2 border-gray-100 hover:border-cyan-300 transition-colors">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">7</div>
              <div className="text-sm text-gray-500">Domínios</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4 py-12">
          {/* Other Products */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 mb-6">Conheça nossos outros produtos</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://sorteador.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-50 hover:bg-violet-50 rounded-full text-gray-600 hover:text-violet-600 transition-all text-sm font-medium border border-gray-200 hover:border-violet-200"
              >
                Sorteador
              </a>
              <a
                href="https://sorteando.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-50 hover:bg-pink-50 rounded-full text-gray-600 hover:text-pink-600 transition-all text-sm font-medium border border-gray-200 hover:border-pink-200"
              >
                Sorteando
              </a>
              <a
                href="https://gerador.de"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-50 hover:bg-cyan-50 rounded-full text-gray-600 hover:text-cyan-600 transition-all text-sm font-medium border border-gray-200 hover:border-cyan-200"
              >
                Gerador.de
              </a>
              <a
                href="https://simplesmente.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-50 hover:bg-emerald-50 rounded-full text-gray-600 hover:text-emerald-600 transition-all text-sm font-medium border border-gray-200 hover:border-emerald-200"
              >
                Simplesmente
              </a>
              <a
                href="https://amigosecreto.org"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-50 hover:bg-amber-50 rounded-full text-gray-600 hover:text-amber-600 transition-all text-sm font-medium border border-gray-200 hover:border-amber-200"
              >
                Amigo Secreto
              </a>
            </div>
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center pt-6 border-t border-gray-100">
            <a href="https://uaise.com" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-80 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 25 380 140" className="h-6" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#374151"/>
                    <stop offset="100%" stopColor="#4b5563"/>
                  </linearGradient>
                </defs>
                <g fill="url(#logoGradient)">
                  <g transform="translate(5.820622, 158.005855)">
                    <path d="M 96.46875 -130.796875 C 97.550781 -130.796875 98.09375 -130.304688 98.09375 -129.328125 L 98.09375 -43.65625 C 98.09375 -34.5 95.941406 -26.648438 91.640625 -20.109375 C 87.335938 -13.566406 81.476562 -8.578125 74.0625 -5.140625 C 66.65625 -1.710938 58.316406 0 49.046875 0 C 40.109375 0 31.90625 -1.769531 24.4375 -5.3125 C 16.976562 -8.851562 11.039062 -13.894531 6.625 -20.4375 C 2.207031 -26.976562 0 -34.71875 0 -43.65625 L 0 -107.09375 L 24.6875 -107.09375 L 24.6875 -43.8125 C 25.445312 -37.382812 28.195312 -32.476562 32.9375 -29.09375 C 37.6875 -25.71875 43.054688 -24.03125 49.046875 -24.03125 C 53.191406 -24.03125 57.113281 -24.738281 60.8125 -26.15625 C 64.519531 -27.570312 67.546875 -29.75 69.890625 -32.6875 C 72.234375 -35.632812 73.40625 -39.289062 73.40625 -43.65625 L 73.40625 -129.328125 C 73.40625 -130.304688 74.003906 -130.796875 75.203125 -130.796875 Z"/>
                  </g>
                  <g transform="translate(94.258477, 158.005855)">
                    <path d="M 102.671875 -1.96875 C 102.890625 -1.53125 102.835938 -1.09375 102.515625 -0.65625 C 102.191406 -0.21875 101.753906 0 101.203125 0 L 78.640625 0 C 77.878906 0 77.390625 -0.328125 77.171875 -0.984375 L 51.34375 -73.90625 L 25.828125 -0.984375 C 25.722656 -0.328125 25.179688 0 24.203125 0 L 1.796875 0 C 1.035156 0 0.519531 -0.21875 0.25 -0.65625 C -0.0195312 -1.09375 -0.0507812 -1.53125 0.15625 -1.96875 L 49.703125 -129.8125 C 49.921875 -130.46875 50.460938 -130.796875 51.328125 -130.796875 C 52.203125 -130.796875 52.75 -130.46875 52.96875 -129.8125 Z"/>
                  </g>
                  <g transform="translate(187.6006, 158.005855)">
                    <path d="M 53.296875 -22.40625 C 54.492188 -22.40625 55.09375 -21.910156 55.09375 -20.921875 L 55.09375 -1.46875 C 55.09375 -0.488281 54.492188 0 53.296875 0 L 1.796875 0 C 0.597656 0 0 -0.488281 0 -1.46875 L 0 -20.921875 C 0 -21.910156 0.597656 -22.40625 1.796875 -22.40625 L 15.203125 -22.40625 L 15.203125 -130.796875 L 40.21875 -130.796875 L 40.21875 -22.40625 Z"/>
                  </g>
                  <g transform="translate(242.848481, 133.873911)">
                    <path d="M 49.078125 -59.375 C 54.691406 -56.789062 58.988281 -53.023438 61.96875 -48.078125 C 64.957031 -43.128906 66.453125 -37.488281 66.453125 -31.15625 C 66.453125 -24.46875 64.867188 -18.804688 61.703125 -14.171875 C 58.546875 -9.535156 54.445312 -6.015625 49.40625 -3.609375 C 44.375 -1.203125 39.003906 0 33.296875 0 C 33.296875 0 33.25 0 33.15625 0 L 33.15625 -19.25 C 33.25 -19.25 33.296875 -19.25 33.296875 -19.25 C 36.859375 -19.25 39.976562 -20.34375 42.65625 -22.53125 C 45.332031 -24.71875 46.671875 -27.59375 46.671875 -31.15625 C 46.671875 -33.832031 45.976562 -36.101562 44.59375 -37.96875 C 43.207031 -39.84375 41.488281 -41.316406 39.4375 -42.390625 C 37.394531 -43.460938 35.347656 -44.039062 33.296875 -44.125 C 32.847656 -44.125 31.0625 -44.28125 27.9375 -44.59375 C 24.820312 -44.90625 21.304688 -45.953125 17.390625 -47.734375 C 11.859375 -50.316406 7.578125 -53.90625 4.546875 -58.5 C 1.515625 -63.09375 0 -68.507812 0 -74.75 C 0 -81.4375 1.582031 -87.1875 4.75 -92 C 7.914062 -96.8125 12.035156 -100.507812 17.109375 -103.09375 C 22.191406 -105.675781 27.585938 -106.96875 33.296875 -106.96875 C 39.441406 -106.96875 44.96875 -105.695312 49.875 -103.15625 C 54.78125 -100.625 58.679688 -97.0625 61.578125 -92.46875 C 64.472656 -87.875 65.96875 -82.546875 66.0625 -76.484375 C 66.144531 -76.304688 66.03125 -76.082031 65.71875 -75.8125 C 65.40625 -75.550781 65.03125 -75.421875 64.59375 -75.421875 L 47.875 -75.421875 C 47.519531 -75.421875 47.1875 -75.550781 46.875 -75.8125 C 46.5625 -76.082031 46.40625 -76.304688 46.40625 -76.484375 C 46.3125 -80.316406 44.972656 -83.144531 42.390625 -84.96875 C 39.804688 -86.800781 36.773438 -87.71875 33.296875 -87.71875 C 29.640625 -87.71875 26.492188 -86.625 23.859375 -84.4375 C 21.234375 -82.257812 19.921875 -79.03125 19.921875 -74.75 C 19.921875 -70.914062 21.300781 -67.992188 24.0625 -65.984375 C 26.832031 -63.984375 29.910156 -62.984375 33.296875 -62.984375 C 33.566406 -62.984375 34.457031 -62.9375 35.96875 -62.84375 C 37.488281 -62.757812 39.425781 -62.472656 41.78125 -61.984375 C 44.144531 -61.492188 46.578125 -60.625 49.078125 -59.375 Z"/>
                  </g>
                  <g transform="translate(300.737301, 133.873911)">
                    <path d="M 50.8125 -19.921875 L 50.8125 0 L 1.46875 0 C 0.488281 0 0 -0.398438 0 -1.203125 L 0 -105.765625 C 0 -106.566406 0.488281 -106.96875 1.46875 -106.96875 L 50.8125 -106.96875 L 50.8125 -87.578125 L 20.453125 -87.578125 L 20.453125 -63.375 L 62.453125 -63.375 C 63.429688 -63.375 63.921875 -62.972656 63.921875 -62.171875 L 63.921875 -45.203125 C 63.921875 -44.398438 63.429688 -44 62.453125 -44 L 20.453125 -44 L 20.453125 -19.921875 Z"/>
                  </g>
                </g>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
