<template>
  <div id="image-uploader">
    <a-space direction="vertical" :style="{ width: '100%' }">
      <a-upload
        :action="`${BASE_URL}/file/upload/${props.imageType}`"
        :fileList="file ? [file] : []"
        :show-file-list="false"
        @change="onChange"
        @progress="onProgress"
        @success="onSuccess"
        :data="{biz: BIZ_MAPPING[props.imageType]}"
        :draggable="true"
        :with-credentials="true"
      >
        <template #upload-button>
          <div
            :class="`arco-upload-list-item${
            file && file.status === 'error' ? '上传失败' : ''
          }`"
          >
            <div
              class="arco-upload-list-picture custom-upload-avatar"
              v-if="file && file.url"
            >
              <a-image :src="file.url" />
              <div class="arco-upload-list-picture-mask">
                <IconEdit />
              </div>
              <a-progress
                v-if="file.status === 'uploading' && file.percent && file.percent < 100"
                :percent="file.percent"
                type="circle"
                size="mini"
                :style="{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
              }"
              />
            </div>
            <div class="arco-upload-picture-card" v-else>
              <div class="arco-upload-picture-card-text">
                <IconPlus />
                <div style="margin-top: 10px; font-weight: 600">Upload</div>
              </div>
            </div>
          </div>
        </template>
      </a-upload>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon'
import { ref } from 'vue'
import type { FileItem } from '@arco-design/web-vue'
import { BASE_URL } from '@/config/request'
import { BIZ_MAPPING } from '@/enums/bizEnums'

interface Props {
  imageType: 'avatar' | 'bank' | 'result',
  onSuccess: (file: FileItem) => void,
}

const props = defineProps<Props>()

const file = ref<FileItem>()

const onChange = (_: any, currentFile: FileItem) => {
  file.value = {
    ...currentFile
    // url: URL.createObjectURL(currentFile.file),
  }
}
const onProgress = (currentFile: FileItem) => {
  file.value = currentFile
}


</script>

<style scoped>

</style>