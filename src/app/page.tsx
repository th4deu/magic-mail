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
            <p className="text-sm text-gray-500 mb-4">Outros produtos</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://sorteador.com.br" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Sorteador
              </a>
              <span className="text-gray-300">•</span>
              <a href="https://sorteando.com.br" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Sorteando
              </a>
              <span className="text-gray-300">•</span>
              <a href="https://gerador.de" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Gerador.de
              </a>
              <span className="text-gray-300">•</span>
              <a href="https://simplesmente.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Simplesmente
              </a>
              <span className="text-gray-300">•</span>
              <a href="https://amigosecreto.com.br" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Amigo Secreto
              </a>
            </div>
          </div>

          {/* Developed by */}
          <div className="text-center pt-6 border-t border-gray-100">
            <p className="text-gray-400 text-sm">
              Desenvolvido por{' '}
              <a href="https://uaise.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors font-semibold">
                UAISE.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
