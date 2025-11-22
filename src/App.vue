<template>
  <router-view />
</template>

<style>
/* Global Dark Mode */
body[data-theme='dark'] {
  background-color: #121212;
  color: #eee;
}

/* Card and Table */
body[data-theme='dark'] .card,
body[data-theme='dark'] .table,
body[data-theme='dark'] .el-card,
body[data-theme='dark'] .el-table,
body[data-theme='dark'] .el-dialog {
  background-color: #1e1e1e !important;
  color: #eee !important;
}

/* Table text + headers */
body[data-theme='dark'] .el-table th,
body[data-theme='dark'] .el-table td {
  color: #eee !important;
  background-color: #333 !important; /* Add background to improve contrast */
}

/* Pagination */
body[data-theme='dark'] .el-pagination {
  color: #eee !important;
}

/* Input, Button, and Form */
body[data-theme='dark'] .el-input__inner,
body[data-theme='dark'] .el-button {
  background-color: #333 !important;
  color: #eee !important;
}

/* Border for hover or selected states */
body[data-theme='dark'] .el-table th,
body[data-theme='dark'] .el-table td,
body[data-theme='dark'] .el-card {
  border-color: #333 !important;
}

/* Optional: Light theme explicit */
body[data-theme='light'] {
  background-color: #fff;
  color: #212529;
}

body[data-theme='light'] .card,
body[data-theme='light'] .table {
  background-color: #fff;
  color: #212529;
}


</style>
