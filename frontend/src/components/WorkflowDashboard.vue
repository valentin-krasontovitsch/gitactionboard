<template>
  <div id="container">
    <Dashboard
      :disable-max-idle-time="disableIdleOptimization"
      :max-idle-time="maxIdleTime"
      content-displayer="Job"
      :fetch-contents="fetchContents"
      :hide-by-key="'name'"
      :name-of-items="'job(s)'"
    />
  </div>
</template>

<script>
import router from '@/router';
import preferences from '@/services/preferences';
import Dashboard from '@/components/Dashboard';
import { fetchCctrayJson } from '@/services/apiService';

export default {
  el: '#app',
  name: 'WorkflowDashboard',
  components: { Dashboard },
  computed: {
    currentPath() {
      return router.currentRoute.value.path;
    },
    showHealthyBuilds() {
      return preferences.showHealthyBuilds;
    },
    disableIdleOptimization() {
      return preferences.disableIdleOptimization;
    },
    maxIdleTime() {
      return preferences.maxIdleTime;
    },
    showOnlyLastNameComponent() {
      return preferences.showOnlyLastNameComponent;
    }
  },
  methods: {
    fetchContents() {
      return fetchCctrayJson().then(this.marshalData);
    },
    isIdleHealthyBuild(lastBuildStatus, activity) {
      return lastBuildStatus === 'Success' && activity === 'Sleeping';
    },
    marshalData(data) {
      if (this.showOnlyLastNameComponent) {
        data = data.map(dataItem => {
          dataItem.name = dataItem.name.split("::").pop().split("/").pop().trim()
          return dataItem
        });
      }
      return data.filter(({ lastBuildStatus, activity }) => {
        return this.showHealthyBuilds ? true : !this.isIdleHealthyBuild(lastBuildStatus, activity);
      }
      );
    }
  }
};
</script>

<style scoped>
#container {
  height: 100%;
  width: 95%;
  padding-left: 30px;
  padding-right: 30px;
  overflow: scroll;
  padding-bottom: 1px;
}

</style>
