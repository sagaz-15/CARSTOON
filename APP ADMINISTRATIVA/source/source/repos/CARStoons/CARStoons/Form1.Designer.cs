namespace CARStoons
{
    partial class Form1
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        private void InitializeComponent()
        {
            dgvPrincipal = new DataGridView();
            btnActualizar = new Button();
            btnEliminar = new Button();
            flowLayoutPanel1 = new FlowLayoutPanel();
            btnMenuResenas = new Button();
            btnMenuUsuarios = new Button();
            btnMenuVehiculos = new Button();
            btnMenuEspecializaciones = new Button();
            btnMenuMecanicos = new Button();
            btnMenuServicios = new Button();
            btnMenuOrdenes = new Button();
            btnMenuOrdenesRenta = new Button();
            btnMenuOrdenesPersonalizacion = new Button();
            btnMenuServiciosOrden = new Button();
            btnMenuPagos = new Button();
            btnMenuCitas = new Button();
            btnMenuMetodosPago = new Button();
            lblTitulo = new Label();
            btnInsertar = new Button();
            ((System.ComponentModel.ISupportInitialize)dgvPrincipal).BeginInit();
            flowLayoutPanel1.SuspendLayout();
            SuspendLayout();
           
            // dgvPrincipal
             
            dgvPrincipal.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            dgvPrincipal.Location = new Point(200, 86);
            dgvPrincipal.Name = "dgvPrincipal";
            dgvPrincipal.RowHeadersWidth = 51;
            dgvPrincipal.Size = new Size(1250, 500);
            dgvPrincipal.TabIndex = 0;
            dgvPrincipal.CellValueChanged += dgvPrincipal_CellValueChanged;
           
            // btnActualizar
             
            btnActualizar.Location = new Point(200, 627);
            btnActualizar.Name = "btnActualizar";
            btnActualizar.Size = new Size(250, 50);
            btnActualizar.TabIndex = 1;
            btnActualizar.Text = "Guardar Cambios";
            btnActualizar.Visible = false;
            btnActualizar.Click += btnActualizar_Click;
            
            // btnEliminar
             
            btnEliminar.Location = new Point(473, 627);
            btnEliminar.Name = "btnEliminar";
            btnEliminar.Size = new Size(150, 50);
            btnEliminar.TabIndex = 2;
            btnEliminar.Text = "Eliminar Fila";
            btnEliminar.Click += btnEliminar_Click;
            
            // flowLayoutPanel1
             
            flowLayoutPanel1.Controls.Add(btnMenuResenas);
            flowLayoutPanel1.Controls.Add(btnMenuUsuarios);
            flowLayoutPanel1.Controls.Add(btnMenuVehiculos);
            flowLayoutPanel1.Controls.Add(btnMenuEspecializaciones);
            flowLayoutPanel1.Controls.Add(btnMenuMecanicos);
            flowLayoutPanel1.Controls.Add(btnMenuServicios);
            flowLayoutPanel1.Controls.Add(btnMenuOrdenes);
            flowLayoutPanel1.Controls.Add(btnMenuOrdenesRenta);
            flowLayoutPanel1.Controls.Add(btnMenuOrdenesPersonalizacion);
            flowLayoutPanel1.Controls.Add(btnMenuServiciosOrden);
            flowLayoutPanel1.Controls.Add(btnMenuPagos);
            flowLayoutPanel1.Controls.Add(btnMenuCitas);
            flowLayoutPanel1.Controls.Add(btnMenuMetodosPago);
            flowLayoutPanel1.Dock = DockStyle.Top;
            flowLayoutPanel1.Location = new Point(0, 0);
            flowLayoutPanel1.Name = "flowLayoutPanel1";
            flowLayoutPanel1.Size = new Size(1729, 80);
            flowLayoutPanel1.TabIndex = 3;
            
            // btnMenuResenas
             
            btnMenuResenas.Location = new Point(3, 3);
            btnMenuResenas.Name = "btnMenuResenas";
            btnMenuResenas.Size = new Size(75, 50);
            btnMenuResenas.TabIndex = 0;
            btnMenuResenas.Text = "Reseñas";
            btnMenuResenas.Click += Menu_Click;
             
            // btnMenuUsuarios
             
            btnMenuUsuarios.Location = new Point(84, 3);
            btnMenuUsuarios.Name = "btnMenuUsuarios";
            btnMenuUsuarios.Size = new Size(120, 50);
            btnMenuUsuarios.TabIndex = 0;
            btnMenuUsuarios.Text = "Usuarios";
            btnMenuUsuarios.Click += Menu_Click;
            
            // btnMenuVehiculos
             
            btnMenuVehiculos.Location = new Point(210, 3);
            btnMenuVehiculos.Name = "btnMenuVehiculos";
            btnMenuVehiculos.Size = new Size(120, 50);
            btnMenuVehiculos.TabIndex = 1;
            btnMenuVehiculos.Text = "Vehiculos";
            btnMenuVehiculos.Click += Menu_Click;
             
            // btnMenuEspecializaciones
             
            btnMenuEspecializaciones.Location = new Point(336, 3);
            btnMenuEspecializaciones.Name = "btnMenuEspecializaciones";
            btnMenuEspecializaciones.Size = new Size(150, 50);
            btnMenuEspecializaciones.TabIndex = 2;
            btnMenuEspecializaciones.Text = "Especializaciones";
            btnMenuEspecializaciones.Click += Menu_Click;
             
            // btnMenuMecanicos
             
            btnMenuMecanicos.Location = new Point(492, 3);
            btnMenuMecanicos.Name = "btnMenuMecanicos";
            btnMenuMecanicos.Size = new Size(120, 50);
            btnMenuMecanicos.TabIndex = 3;
            btnMenuMecanicos.Text = "Mecanicos";
            btnMenuMecanicos.Click += Menu_Click;
             
            // btnMenuServicios
             
            btnMenuServicios.Location = new Point(618, 3);
            btnMenuServicios.Name = "btnMenuServicios";
            btnMenuServicios.Size = new Size(120, 50);
            btnMenuServicios.TabIndex = 4;
            btnMenuServicios.Text = "Servicios";
            btnMenuServicios.Click += Menu_Click;
             
            // btnMenuOrdenes
             
            btnMenuOrdenes.Location = new Point(744, 3);
            btnMenuOrdenes.Name = "btnMenuOrdenes";
            btnMenuOrdenes.Size = new Size(120, 50);
            btnMenuOrdenes.TabIndex = 5;
            btnMenuOrdenes.Text = "Ordenes";
            btnMenuOrdenes.Click += Menu_Click;
             
            // btnMenuOrdenesRenta
             
            btnMenuOrdenesRenta.Location = new Point(870, 3);
            btnMenuOrdenesRenta.Name = "btnMenuOrdenesRenta";
            btnMenuOrdenesRenta.Size = new Size(120, 50);
            btnMenuOrdenesRenta.TabIndex = 6;
            btnMenuOrdenesRenta.Text = "Ordenes Renta";
            btnMenuOrdenesRenta.Click += Menu_Click;
             
            // btnMenuOrdenesPersonalizacion
             
            btnMenuOrdenesPersonalizacion.Location = new Point(996, 3);
            btnMenuOrdenesPersonalizacion.Name = "btnMenuOrdenesPersonalizacion";
            btnMenuOrdenesPersonalizacion.Size = new Size(141, 50);
            btnMenuOrdenesPersonalizacion.TabIndex = 7;
            btnMenuOrdenesPersonalizacion.Text = "Ordenes Perz.";
            btnMenuOrdenesPersonalizacion.Click += Menu_Click;
             
            // btnMenuServiciosOrden
             
            btnMenuServiciosOrden.Location = new Point(1143, 3);
            btnMenuServiciosOrden.Name = "btnMenuServiciosOrden";
            btnMenuServiciosOrden.Size = new Size(120, 50);
            btnMenuServiciosOrden.TabIndex = 8;
            btnMenuServiciosOrden.Text = "Servicios Orden";
            btnMenuServiciosOrden.Click += Menu_Click;
             
            // btnMenuPagos
             
            btnMenuPagos.Location = new Point(1269, 3);
            btnMenuPagos.Name = "btnMenuPagos";
            btnMenuPagos.Size = new Size(120, 50);
            btnMenuPagos.TabIndex = 9;
            btnMenuPagos.Text = "Pagos";
            btnMenuPagos.Click += Menu_Click;
             
            // btnMenuCitas
             
            btnMenuCitas.Location = new Point(1395, 3);
            btnMenuCitas.Name = "btnMenuCitas";
            btnMenuCitas.Size = new Size(120, 50);
            btnMenuCitas.TabIndex = 10;
            btnMenuCitas.Text = "Citas";
            btnMenuCitas.Click += Menu_Click;
             
            // btnMenuMetodosPago
             
            btnMenuMetodosPago.Location = new Point(1521, 3);
            btnMenuMetodosPago.Name = "btnMenuMetodosPago";
            btnMenuMetodosPago.Size = new Size(120, 50);
            btnMenuMetodosPago.TabIndex = 11;
            btnMenuMetodosPago.Text = "Metodos Pago";
            btnMenuMetodosPago.Click += Menu_Click;
             
            // lblTitulo
             
            lblTitulo.Location = new Point(20, 100);
            lblTitulo.Name = "lblTitulo";
            lblTitulo.Size = new Size(150, 37);
            lblTitulo.TabIndex = 4;
            lblTitulo.Text = "Entidad: ";
            lblTitulo.Click += lblTitulo_Click;
             
            // btnInsertar
             
            btnInsertar.Location = new Point(649, 627);
            btnInsertar.Name = "btnInsertar";
            btnInsertar.Size = new Size(250, 50);
            btnInsertar.TabIndex = 5;
            btnInsertar.Text = "Insertar";
            btnInsertar.Click += btnInsertar_Click;
             
            // Form1
             
            ClientSize = new Size(1729, 704);
            Controls.Add(btnInsertar);
            Controls.Add(lblTitulo);
            Controls.Add(flowLayoutPanel1);
            Controls.Add(btnEliminar);
            Controls.Add(btnActualizar);
            Controls.Add(dgvPrincipal);
            Name = "Form1";
            Text = "Carstoons Admin Dashboard";
            Load += Form1_Load;
            ((System.ComponentModel.ISupportInitialize)dgvPrincipal).EndInit();
            flowLayoutPanel1.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        // 2. Declaración de Variables 
        private System.Windows.Forms.DataGridView dgvPrincipal;
        private System.Windows.Forms.Button btnActualizar;
        private System.Windows.Forms.Button btnEliminar;
        private System.Windows.Forms.FlowLayoutPanel flowLayoutPanel1;
        private System.Windows.Forms.Button btnMenuUsuarios;
        private System.Windows.Forms.Button btnMenuVehiculos;
        private System.Windows.Forms.Button btnMenuEspecializaciones;
        private System.Windows.Forms.Button btnMenuMecanicos;
        private System.Windows.Forms.Button btnMenuServicios;
        private System.Windows.Forms.Button btnMenuOrdenes;
        private System.Windows.Forms.Button btnMenuOrdenesRenta;
        private System.Windows.Forms.Button btnMenuOrdenesPersonalizacion;
        private System.Windows.Forms.Button btnMenuServiciosOrden;
        private System.Windows.Forms.Button btnMenuPagos;
        private System.Windows.Forms.Button btnMenuCitas;
        private System.Windows.Forms.Button btnMenuMetodosPago;
        private System.Windows.Forms.Label lblTitulo;
        private System.Windows.Forms.Button btnInsertar;
        private System.Windows.Forms.Button btnMenuResenas;
    }
}