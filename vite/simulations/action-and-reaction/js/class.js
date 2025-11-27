// class.jsはクラス管理専用のファイルです。

// クラスの定義方法の例
// class ExampleClass{
//     constructor(p1,p2){
//         this.property1 =p1;
//         this.property2 =p2;
//     }
//     exampleMethod(){
//         this.property1 += this.property2
//     }
// }

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// 以下にクラスを定義してください。

/**
 * Bookクラス - 本を表現するクラス
 */
class Book {
    constructor(x, y, mass = 1.0) {
        this.x = x;
        this.y = y;
        this.width = 120;
        this.height = 20;
        this.mass = mass; // 質量（kg）
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.color = color(139, 69, 19); // 茶色
        this.vy = 0; // Y方向の速度
        this.gravity = 0.5; // 重力加速度（シミュレーション用）
        this.slider = null; // 質量調整用スライダー
        this.massText = null; // 質量表示用テキスト
        this.isEditing = false; // 編集モード
    }

    // UIを作成
    createUI() {
        if (!this.slider) {
            this.slider = createSlider(0.1, 5.0, this.mass, 0.1);
            this.slider.style('width', '100px');
            this.slider.input(() => {
                this.mass = this.slider.value();
            });
            
            this.massText = createP('');
            this.massText.style('color', 'white');
            this.massText.style('margin', '0');
            this.massText.style('font-size', '12px');
        }
    }

    // UIの位置を更新
    updateUIPosition() {
        if (this.slider && this.isEditing) {
            const canvasScale = width / 1000;
            const screenX = this.x * canvasScale;
            const screenY = (this.y - 60) * canvasScale + 60; // navbarの高さを考慮
            
            this.slider.position(screenX, screenY);
            this.slider.show();
            
            this.massText.position(screenX, screenY + 25);
            this.massText.html(`${this.mass.toFixed(1)} kg`);
            this.massText.show();
        } else if (this.slider) {
            this.slider.hide();
            this.massText.hide();
        }
    }

    // UIを削除
    removeUI() {
        if (this.slider) {
            this.slider.remove();
            this.slider = null;
        }
        if (this.massText) {
            this.massText.remove();
            this.massText = null;
        }
    }

    // 本を描画
    display() {
        push();
        
        // 編集モードの時は枠を強調
        if (this.isEditing) {
            fill(200, 150, 100);
            stroke(255, 200, 0);
            strokeWeight(4);
        } else {
            fill(this.color);
            stroke(100);
            strokeWeight(2);
        }
        
        rect(this.x, this.y, this.width, this.height, 5);
        
        // 本のテキスト
        fill(255);
        noStroke();
        textSize(14);
        text(`${this.mass.toFixed(1)} kg`, this.x + this.width / 2, this.y + this.height / 2);
        
        // 編集モードの時は指示を表示
        if (this.isEditing) {
            textSize(10);
            fill(255, 200, 0);
            text('クリックで編集終了', this.x + this.width / 2, this.y - 25);
        }
        
        pop();
    }

    // 編集モードを切り替え
    toggleEdit() {
        this.isEditing = !this.isEditing;
        if (this.isEditing) {
            this.createUI();
        }
    }


    // 作用反作用の力を描画
    displayForces(tableY, booksBelow) {
        const g = 9.8; // 重力加速度
        const forceScale = 5; // 力の矢印のスケール
        
        // 本の中心座標
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        // この本の上にある本の総質量を計算
        let totalMassAbove = this.mass;
        for (let book of booksBelow) {
            totalMassAbove += book.mass;
        }
        
        const totalWeight = totalMassAbove * g; // 総重力（N）
        
        // 机または他の本と接触しているかチェック
        const isOnTable = Math.abs(this.y + this.height - tableY) < 2;
        const isOnOtherBook = booksBelow.length > 0;
        const isSupported = isOnTable || isOnOtherBook;
        
        if (isSupported) {
            // 重力（下向き）- 本にかかる力
            this.drawArrow(
                centerX, 
                centerY, 
                centerX, 
                centerY + this.mass * g * forceScale,
                color(255, 100, 100),
                `重力 ${(this.mass * g).toFixed(1)} N`
            );
            
            // 垂直抗力（上向き）- 机または他の本から本への力
            const supportY = isOnTable ? this.y + this.height : this.y + this.height;
            this.drawArrow(
                centerX, 
                supportY, 
                centerX, 
                supportY - totalWeight * forceScale,
                color(100, 100, 255),
                `垂直抗力 ${totalWeight.toFixed(1)} N`
            );
            
            // 本から机/他の本への力（作用反作用）- 下向き
            if (isOnTable) {
                // 机への反作用
                this.drawArrow(
                    centerX, 
                    tableY, 
                    centerX, 
                    tableY + totalWeight * forceScale,
                    color(100, 255, 100),
                    `本→机 ${totalWeight.toFixed(1)} N`
                );
            } else if (isOnOtherBook) {
                // 下の本への反作用
                const bottomBook = booksBelow[booksBelow.length - 1];
                const bottomCenterY = bottomBook.y + bottomBook.height / 2;
                this.drawArrow(
                    centerX, 
                    bottomBook.y, 
                    centerX, 
                    bottomBook.y + totalWeight * forceScale * 0.7,
                    color(100, 255, 100),
                    `本→本 ${totalWeight.toFixed(1)} N`
                );
            }
        }
    }

    // 矢印を描画するヘルパーメソッド
    drawArrow(x1, y1, x2, y2, col, label) {
        push();
        stroke(col);
        strokeWeight(3);
        fill(col);
        
        // 矢印の線
        line(x1, y1, x2, y2);
        
        // 矢印の先端
        const angle = atan2(y2 - y1, x2 - x1);
        const arrowSize = 10;
        translate(x2, y2);
        rotate(angle);
        triangle(0, 0, -arrowSize, -arrowSize / 2, -arrowSize, arrowSize / 2);
        
        pop();
        
        // ラベル
        push();
        fill(col);
        noStroke();
        textSize(12);
        textAlign(LEFT, CENTER);
        text(label, x2 + 15, (y1 + y2) / 2);
        pop();
    }

    // 他の本と重なっているかチェック
    collidesWith(other) {
        return !(this.x + this.width < other.x ||
                 this.x > other.x + other.width ||
                 this.y + this.height < other.y ||
                 this.y > other.y + other.height);
    }

    // 物理演算の更新
    updatePhysics(tableY, otherBooks) {
        if (this.isDragging) {
            this.vy = 0;
            return;
        }

        // 重力を適用
        this.vy += this.gravity;
        this.y += this.vy;

        // 机との衝突判定
        if (this.y + this.height >= tableY) {
            this.y = tableY - this.height;
            this.vy = 0;
        }

        // 他の本との衝突判定（下方向のみ）
        for (let other of otherBooks) {
            if (other !== this && this.vy > 0) {
                // 水平方向に重なっているかチェック
                const horizontalOverlap = !(this.x + this.width < other.x || this.x > other.x + other.width);
                
                if (horizontalOverlap) {
                    // この本の底が他の本の上に来た場合
                    if (this.y + this.height >= other.y && this.y + this.height <= other.y + other.height) {
                        this.y = other.y - this.height;
                        this.vy = 0;
                    }
                }
            }
        }

        // 画面外に出ないように制限
        this.x = constrain(this.x, 50, 950 - this.width);
        this.y = constrain(this.y, 50, tableY - this.height);
    }

    // マウスクリック判定
    isMouseOver(mx, my) {
        return mx > this.x && mx < this.x + this.width &&
               my > this.y && my < this.y + this.height;
    }

    // ドラッグ開始
    startDrag(mx, my) {
        this.isDragging = true;
        this.offsetX = mx - this.x;
        this.offsetY = my - this.y;
    }

    // ドラッグ中の更新
    updateDrag(mx, my, tableY, otherBooks) {
        if (this.isDragging) {
            let newX = mx - this.offsetX;
            let newY = my - this.offsetY;
            
            // 範囲制限
            newX = constrain(newX, 50, 950 - this.width);
            newY = constrain(newY, 50, tableY - this.height);
            
            // 一時的に新しい位置を設定
            const oldX = this.x;
            const oldY = this.y;
            this.x = newX;
            this.y = newY;
            
            // 他の本と重なっているかチェック
            let hasCollision = false;
            for (let other of otherBooks) {
                if (other !== this && this.collidesWith(other)) {
                    hasCollision = true;
                    break;
                }
            }
            
            // 重なっている場合は元の位置に戻す
            if (hasCollision) {
                this.x = oldX;
                this.y = oldY;
            }
            
            // 机と重なっている場合
            if (this.y + this.height > tableY) {
                this.y = tableY - this.height;
            }
        }
    }

    // ドラッグ終了
    stopDrag() {
        this.isDragging = false;
    }

    // この本の下にある本を取得
    getBooksBelow(otherBooks) {
        const booksBelow = [];
        const centerX = this.x + this.width / 2;
        
        for (let other of otherBooks) {
            if (other !== this) {
                // この本の真下にあるかチェック
                const otherCenterX = other.x + other.width / 2;
                const horizontalOverlap = Math.abs(centerX - otherCenterX) < this.width / 2;
                const verticallyBelow = other.y > this.y + this.height - 5 && other.y < this.y + this.height + 5;
                
                if (horizontalOverlap && verticallyBelow) {
                    booksBelow.push(other);
                    // 再帰的にさらに下の本も取得
                    const moreBooksBelow = other.getBooksBelow(otherBooks);
                    booksBelow.push(...moreBooksBelow);
                }
            }
        }
        
        return booksBelow;
    }
}


/**
 * BicpemaCanvasControllerクラス
 *
 * Bicpemaの動的なキャンバスサイズをコントロールする。
 */
class BicpemaCanvasController {
    /**
     * @constructor
     * @param {boolean} f 回転時に比率を固定化するか
     * @param {boolean} i 3Dかどうか
     * @param {number} w_r 幅の比率（0.0~1.0）
     * @param {number} h_r 高さの比率（0.0~1.0）
     */
    constructor(f = true, i = false, w_r = 1.0, h_r = 1.0) {
        this.fixed = f;
        this.is3D = i;
        this.widthRatio = w_r;
        this.heightRatio = h_r;
    }
    /**
     * HTML要素で生成している#p5Canvasと#navBarを元にcanvasを生成する。
     */
    fullScreen() {
        const P5_CANVAS = select("#p5Canvas");
        const NAV_BAR = select("#navBar");
        let canvas, w, h;
        if (this.fixed) {
            const RATIO = 9 / 16;
            w = windowWidth;
            h = w * RATIO;
            if (h > windowHeight - NAV_BAR.height) {
                h = windowHeight - NAV_BAR.height;
                w = h / RATIO;
            }
        } else {
            w = windowWidth;
            h = windowHeight - NAV_BAR.height;
        }
        if (this.is3D) {
            canvas = createCanvas(w * this.widthRatio, h * this.heightRatio, WEBGL);
        } else {
            canvas = createCanvas(w * this.widthRatio, h * this.heightRatio);
        }
        canvas.parent(P5_CANVAS).class("rounded border border-1");
    }

    /**
     * HTML要素で生成している#p5Canvasと#navBarを元にcanvasをリサイズする。
     */
    resizeScreen() {
        const NAV_BAR = select("#navBar");
        let w = 0;
        let h = 0;
        if (this.fixed) {
            const RATIO = 9 / 16;
            w = windowWidth;
            h = w * RATIO;
            if (h > windowHeight - NAV_BAR.height) {
                h = windowHeight - NAV_BAR.height;
                w = h / RATIO;
            }
        } else {
            w = windowWidth;
            h = windowHeight - NAV_BAR.height;
        }
        resizeCanvas(w * this.widthRatio, h * this.heightRatio);
    }
}