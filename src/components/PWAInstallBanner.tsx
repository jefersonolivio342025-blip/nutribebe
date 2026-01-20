import { Download, X, Share, Plus } from 'lucide-react';
import { useState } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const PWAInstallBanner = () => {
  const { isInstallable, isInstalled, isIOS, showIOSModal, promptInstall, closeIOSModal } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if already installed, not installable, or dismissed
  if (isInstalled || !isInstallable || dismissed) {
    return null;
  }

  return (
    <>
      {/* Install Banner */}
      <div className="bg-gradient-to-r from-sage to-sage-dark text-white rounded-2xl p-4 mb-4 shadow-lg animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🥗</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm">Baixar Aplicativo no Celular 📲</h3>
            <p className="text-xs text-white/80 mt-0.5">
              Tenha o NutriBebê sempre à mão!
            </p>
          </div>
          <button
            onClick={promptInstall}
            className="bg-white text-sage-dark font-bold px-4 py-2 rounded-xl text-sm hover:bg-white/90 transition-colors flex items-center gap-1.5 flex-shrink-0"
          >
            <Download size={16} />
            Instalar
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-white/60 hover:text-white p-1"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* iOS Installation Tutorial Modal */}
      <Dialog open={showIOSModal} onOpenChange={closeIOSModal}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-lg">
              Instalar NutriBebê no iPhone 📱
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <p className="text-sm text-muted-foreground text-center">
              Siga os passos abaixo para adicionar o app à sua tela inicial:
            </p>

            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-sage-dark">1</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Toque em Compartilhar</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Clique no ícone de compartilhar{' '}
                  <span className="inline-flex items-center bg-secondary rounded p-1">
                    <Share size={14} className="text-primary" />
                  </span>{' '}
                  na barra inferior do Safari
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-sage-dark">2</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Adicionar à Tela de Início</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Role para baixo e toque em{' '}
                  <span className="inline-flex items-center gap-1 bg-secondary rounded px-2 py-0.5">
                    <Plus size={14} className="text-primary" />
                    <span className="text-xs">Tela de Início</span>
                  </span>
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-sage-dark">3</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Confirmar</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Toque em "Adicionar" no canto superior direito
                </p>
              </div>
            </div>

            {/* Visual Guide */}
            <div className="bg-sage-light/50 rounded-xl p-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-sage flex items-center justify-center mx-auto mb-2 shadow-md">
                <span className="text-3xl">🥗</span>
              </div>
              <p className="text-sm font-medium text-foreground">NutriBebê</p>
              <p className="text-xs text-muted-foreground">Pronto na sua tela!</p>
            </div>
          </div>

          <button
            onClick={closeIOSModal}
            className="w-full bg-sage text-white font-bold py-3 rounded-xl hover:bg-sage-dark transition-colors"
          >
            Entendi! 👍
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PWAInstallBanner;
